var user = 'Mosaico_Clasification';


/**
 * PARÁMETROS DEL USUARIO
 */
var param = {
  country: 'VENEZUELA',
  regionId: 90503,
  years: [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2023
  ],
  removeSamples: [6, 13],
  variables: [
    "ndvi_median",
    "swir1_median",
    "red_median",
    "nir_median"
  ],
  additionalSamples: {
    polygons: [ ],
    classes: [ 12 ],
    points: [ 200 ]             // numero de puntos de cada clase complementaria
  },
  yearsPreview: [ 2015, 2018 ],
  driveFolder: 'RF-PRELIMINAR-CLASSIFICATION',
  samplesVersion: 1,
  outputVersion: 1
};






//Get region vector and mask
region = region.filterMetadata("id_regionC", "equals", param.regionId);

var regionMask = region
  .map(function(item) { return item.set('version', 1) })
  .reduceToImage(['version'], ee.Reducer.first());


var geom = ee.FeatureCollection(
    region.geometry().bounds()
  )
  .map(function(item) {
    return item.set('version', 1);
  })
  .reduceToImage(['version'], ee.Reducer.first());
 
  



// Input data and parameters
var tileScale = 8;
var trees = 100;

var country = param.country;
var regionId = param.regionId;
var variables = param.variables;
var nBands = variables.length;
var outputVersion = param.outputVersion;
var additionalSamples = param.additionalSamples;
var allYears = param.years;
var yearsPreview = param.yearsPreview;
var driveFolder = param.driveFolder;
var samplesVersion = param.samplesVersion;
var removeSamples = param.removeSamples;


// require modules
var assetsMosaics = 'projects/mapbiomas-raisg/MOSAICOS/mosaics-2';
var basePath = 'users/' + user + '/CURSO-PRACTICO-MAPBIOMAS/clasificacion/';
var samplesPath = 'projects/mapbiomas-raisg/MUESTRAS/VENEZUELA/COLECCION4/PUNTOS_ESTABLES/';
var trainingSamples = samplesPath + 'samples-' + country + '-' + regionId;
 
 
// Imports
var palette = require('users/mapbiomas/modules:Palettes.js').get('classification2');
palette[29] = 'brown';


// Constants
var missingYears = [];
var years = ee.List(allYears).removeAll(missingYears);



// Outputs initialization
var classified = ee.Image(0);



// Set up mosaics
var mosaicRegion = parseInt(regionId.toString().slice(0, 3), 10);
var joinedMosaics = ee.ImageCollection(assetsMosaics)
  .filterMetadata('region_code', 'equals', mosaicRegion)
  .map(function(image) { return image.int() });




// Function for taking additional samples
var resampleCover = function(mosaic, additionalSamples) {
  
  var polygons = additionalSamples.polygons,
      classIds = additionalSamples.classes,
      points = additionalSamples.points,
      newSamples = [];
  
  polygons.forEach(function(polygon, i) {
    
    var newSample = mosaic.sample({
      numPixels: points[ i ],
      region: polygon.geometry(),
      scale: 30,
      projection: 'EPSG:4326',
      seed: 1,
      geometries: true,
      tileScale: tileScale
    })
    .map(function(item) { return item.set('reference', classIds[ i ]) });
    
    newSamples.push(newSample);

  });
  
  return ee.FeatureCollection(newSamples).flatten();

};

 

// Implement random forests classification
var training = ee.FeatureCollection(trainingSamples + '-p03-' + samplesVersion);

training = removeSamples.length > 0
  ? training.filter(ee.Filter.inList('reference', removeSamples).not())
  : training;


years.evaluate(function(years, error){
  
  if(error) print(error.message);
  

  years.forEach(function(year) {
    
  
    var yearMosaic = joinedMosaics
      .filterMetadata('year', 'equals', year)
      .median()
      .updateMask(regionMask);
      

    if(variables.length > 0) yearMosaic = yearMosaic.select(variables);
      
    var bands = yearMosaic.bandNames();
    
    var contained = bands.containsAll(ee.List(variables));

    var yearTrainingSamples = ee.FeatureCollection(
      ee.Algorithms.If(
        contained,
        training.filter(ee.Filter.eq('year', year)),
        null
      )
    )
    .select(bands.add('reference'))
    .filter(ee.Filter.notNull(bands));
    
    
    var nClasSample = ee.List(
      ee.Algorithms.If(
        contained,
        yearTrainingSamples
          .reduceColumns(ee.Reducer.toList(), ['reference'])
          .get('list'),
        null
      )
    );

    
    // Identify number of classes in th samples.
    nClasSample = nClasSample.reduce(ee.Reducer.countDistinct());
    
    
    // Here we put additional samples
    if(additionalSamples.polygons.length > 0){
      
      var insidePolygons = ee.FeatureCollection(additionalSamples.polygons)
        .reduceToImage(['id'], ee.Reducer.first());
      
      var outsidePolygons = insidePolygons.mask().eq(0).selfMask();
      outsidePolygons = geom.updateMask(outsidePolygons);

      
      var outsideVector = outsidePolygons.reduceToVectors({
        reducer: ee.Reducer.countEvery(),
        geometry: region.geometry().bounds(),
        scale: 30,
        maxPixels: 1e13
      });

      
      var newSamples = resampleCover(yearMosaic, additionalSamples);
      
      //if(year === 2020) Map.addLayer(newSamples);
      
      yearTrainingSamples = yearTrainingSamples
        .filterBounds(outsideVector)
        .merge(newSamples);
    }
    
    
    // Define classifier and compute importance tables
    var classifier = ee.Classifier.smileRandomForest({
        numberOfTrees: trees, 
        variablesPerSplit: 1
    });
    

    classifier = ee.Classifier(
      ee.Algorithms.If(
        contained,
        ee.Algorithms.If(
          // solución al problema 'only one class'
          ee.Algorithms.IsEqual(nClasSample, 1),
          null,
          classifier.train(yearTrainingSamples, 'reference', bands)
        ),
        null
      )
    );
    
    
    var explainer = ee.Dictionary(
      ee.Algorithms.If(
        contained,
        ee.Algorithms.If(
          ee.Algorithms.IsEqual(nClasSample, 1) ,
          null,
          classifier.explain()
        ),
        null
      )
    );
    
    
    
    // Compute classification
    var img = yearMosaic.classify(classifier)
      .select(['classification'], ['classification_' + year]);
      

    var maskBand = ee.Image(27).rename('classification_' + year);


    classified = ee.Image(
      ee.Algorithms.If(
        contained,
        ee.Algorithms.If(
          // Solution to problem of 'only one class'
          ee.Algorithms.IsEqual(nClasSample, 1),
          classified.addBands(maskBand),
          classified.addBands(img)
        ),
        classified.addBands(maskBand)
      )
    ).unmask(27).updateMask(regionMask).toByte();
    

    // display mosaic and classification
    if(yearsPreview.indexOf(year) > -1) {
      Map.addLayer(
        yearMosaic,
        {
          bands: ['swir1_median', 'nir_median', 'red_median'],
          gain: [0.08, 0.06, 0.2]
        },
        'MOSAICO ' + year.toString(), false
      );
      
      Map.addLayer(
        img.select('classification_' + year)
           .unmask(27).updateMask(regionMask),
        {
          min: 0,
          max: 34,
          palette: palette
        },
        'CLASIFICACIÓN ' + year, false
      );
    }

    return classified;

  });
  
  
  classified = classified.slice(1).toInt8()
    .set({
      code_region: regionId,
      pais: country,
      version: outputVersion,
      RFtrees: trees,
      samples_version: samplesVersion,
      descripcion: 'clasificacion-v1',
      paso: 'P04'
    });
    
  
  // Exportar assets a GEE y Google Drive
  var filename = country + '-' + regionId + '-' + outputVersion;
  var imageId = basePath + filename;  
  var tableName = 'IMPORTANCE-TABLE-' + country + '-';
  tableName = tableName + regionId + '-' + outputVersion;
  
  
  Export.image.toAsset({
    image: classified,
    description: filename,
    assetId: imageId,
    scale: 30,
    pyramidingPolicy: {
      '.default': 'mode'
    },
    maxPixels: 1e13,
    region: region.geometry().bounds()
  });
  

  Export.image.toDrive({
    image: classified,
    description: filename + '-DRIVE',
    folder: driveFolder,
    scale: 30,
    maxPixels: 1e13,
    region: region.geometry().bounds()
  });
  
});
