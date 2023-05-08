/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hand30_100 = ee.ImageCollection("users/gena/global-hand/hand-100"),
    hand30_1000 = ee.Image("users/gena/GlobalHAND/30m/hand-1000"),
    hand90_1000 = ee.Image("users/gena/GlobalHAND/90m-global/hand-1000"),
    hand30_5000 = ee.Image("users/gena/GlobalHAND/30m/hand-5000"),
    swbd = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24"),
    altitude = ee.Image("JAXA/ALOS/AW3D30_V1_1"),
    srtm = ee.Image("USGS/SRTMGL1_003"),
    geometry_21 = /* color: #cae99e */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-69.97033008655744, -15.243514608869761]),
            {
              "id": 21,
              "system:index": "0"
            })]),
    geometry_13 = /* color: #98ff00 */ee.FeatureCollection([]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// step 6

var param = {
  country: 'PERU',
  regionId: 70501,
  trees: 50,
  variables: [


  ],
  // useHands: false,
  cicle: 'ciclo-1',
  tileScale: 8,
  additionalSamples: {
    polygons: [ ],//geometry_13, geometry_21
    classes: [ ],
    points: [ ]
  },
  yearsPreview: [2018, 2020 ],
  years: [
    2000, 2001, 2002, 2003, 
    2004, 2005, 2006, 2007, 
    2008, 2009, 2010, 2011, 
    2012, 2013, 2014, 2015, 
    2016, 2017, 2018, 2019, 
    2020, 2021
  ],
  driveFolder: 'RF-CLASSIFICATION',
  exports : {
    importance_variable: false,
    classification_drive: false
     }
};



var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
/**
 * Get region vector and mask
 */
var region = ee.FeatureCollection(paths.regionVectorBuffer)
           .filterMetadata("id_regionC", "equals", param.regionId);

var regionMask = region
  .map(function(item) {
    return item.set('version', 1);
  })
  .reduceToImage(['version'], ee.Reducer.first());


var geom = ee.FeatureCollection(
    region.geometry().bounds()
  )
  .map(function(item) {
    return item.set('version', 1);
  })
  .reduceToImage(['version'], ee.Reducer.first());
 
  


/**
 * Input data
 */
// Parameters
var country = param.country;
var regionId = param.regionId;
var variables = param.variables;
// var useHands = param.useHands;
var nBands = variables.length;
var cicle = param.cicle;
var trees = param.trees;
var additionalSamples = param.additionalSamples;
var yearsPreview = param.yearsPreview;
var driveFolder = param.driveFolder;
var years = param.years


// Paths
var basePath = paths.classification;
var samplesPath = paths.trainingPoints01;
var trainingSamples = samplesPath  + 'samples-' + country + '-' + regionId;
 
/**
 * Import Modules CollectionDirectories
 */
// var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
 
// Imports
altitude = altitude.select('AVE').updateMask(regionMask).rename('altitude');
var slppost = ee.Image('projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v2').updateMask(regionMask).rename('slppost');
var slope = ee.Terrain.slope(altitude).int8().rename('slope');
var palette = require('users/mapbiomas/modules:Palettes.js').get('classification2');


// Constants

var thresholds = [0, 1, 2, 5, 10];

var version = {
  'ciclo-1': { input_sample: 2, out_clas: 3, out_geo: 5 },
  'ciclo-2': { input_sample: 3, out_clas: 10, out_geo:8 }
};

var version = version[cicle];
var vSamples = version.input_sample;
var vOutClas = version.out_clas;


// Outputs initialization
var variablesImportance = ee.FeatureCollection([]);
var classified = ee.Image(0);




/**
 * Compute hands and shade mask 2 layers
 */
// smoothen HAND a bit, scale varies a little in the tiles
hand30_100 = hand30_100.mosaic().focal_mean(0.1);
swbd = swbd.select('water_mask');
var swbdMask = swbd.unmask().not().focal_median(1);

    
// potential water (valleys)
var HANDm = ee.List([]);
thresholds.map(function(th) {
  var water = hand30_100.lte(th)
    .focal_max(1)
    .focal_mode(2, 'circle', 'pixels', 5).mask(swbdMask);
    
  HANDm = HANDm.add(water.mask(water)
    .set('hand', 'water_HAND_<_' + th + 'm'));
});


// water_hand	water (HAND < 5m)
var HAND_water = ee.ImageCollection(HANDm);


// exports hands
hand30_100  = hand30_100.rename('hand30_100');
hand30_1000 = hand30_1000.rename('hand30_1000');
hand30_5000 = hand30_5000.rename('hand30_5000');
hand90_1000 = hand90_1000.rename('hand90_1000');
HAND_water  = HAND_water.toBands()
  .rename([
    'water_HAND_0m', 'water_HAND_1m', 'water_HAND_2m', 
    'water_HAND_5m', 'water_HAND_10m'
  ]);

HAND_water = ee.ImageCollection([ee.Image(0),ee.Image(0),ee.Image(0),ee.Image(0),ee.Image(0)]).toBands().rename([
    'water_HAND_0m', 'water_HAND_1m', 'water_HAND_2m', 
    'water_HAND_5m', 'water_HAND_10m'
  ]).where(HAND_water.gte(0), HAND_water)
  
var hands = hand30_100
  .addBands(hand30_1000).addBands(hand30_5000)
  .addBands(hand90_1000).addBands(HAND_water)
  .updateMask(regionMask);


    /**
   * shademask2
   */
  //-----------------------------------------------------------------------------
  var shademask2 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v2").rename('shademask2');
  
  //-----------------------------------------------------------------------------
  



/**
 * Join c3 mosaics
 */
var mosaicRegion = param.regionId.toString().slice(0, 3);

var joinedMosaics = ee.ImageCollection(paths.mosaics_c4)
                    .filter(ee.Filter.eq('region_code',  Number(mosaicRegion)))
                    .map(function(image) {
                      return image.updateMask(regionMask);
                    })

    
    

/**
 * Function for taking additional samples
 */
var resampleCover = function(mosaic, additionalSamples) {
  
  var polygons = additionalSamples.polygons,
      classIds = additionalSamples.classes,
      points = additionalSamples.points,
      newSamples = [];
  
  polygons.forEach(function(polygon, i) {
    
    var newSample = mosaic.sample({
      numPixels: points[ i ],
      region: polygon,
      scale: 30,
      projection: 'EPSG:4326',
      seed: 1,
      geometries: true,
      tileScale:param.tileScale
    })
    .map(function(item) { return item.set('reference', classIds[ i ]) });
    
    newSamples.push(newSample);

  });
  
  return ee.FeatureCollection(newSamples).flatten();

};

 
 
 
 
 
/**
 * Implement random forests classification
 */
ee.List(years).evaluate(function(years, error){
  
  if(error) print(error.message);

  years.forEach(function(year) {
  
    var yearMosaic = joinedMosaics
      .filterMetadata('year', 'equals', year)
      .median()
      .addBands([altitude, slppost, slope, shademask2,hands]);
      
    var yearMosaicAllBand = yearMosaic;
    // if(useHands) yearMosaic = yearMosaic.addBands([hands]);

    if(variables.length > 0) yearMosaic = yearMosaic.select(variables);
      
    var bands = yearMosaic.bandNames();
    
    var contained = bands.containsAll(ee.List(variables));
    

    var yearTrainingSamples = ee.FeatureCollection(
      ee.Algorithms.If(
        contained,
        ee.FeatureCollection(
          trainingSamples + '-' + year + '-' + 'p05' + '-' + vSamples),
        null
      )
    );

    print('AÑO ' + year, yearMosaic, yearTrainingSamples.first());
    
    
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
        .flatten()
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
      
      
      yearTrainingSamples = yearTrainingSamples.filterBounds(outsideVector)
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


    var importances = ee.Feature(
      ee.Algorithms.If(
        contained,
        ee.Algorithms.If(
          ee.Algorithms.IsEqual(nClasSample, 1) ,
          null,
          ee.Feature( null, ee.Dictionary(explainer.get('importance')))
            .set('_trees', explainer.get('numberOfTrees'))
            .set('_oobError', explainer.get('outOfBagErrorEstimate'))
            .set('_year', year)
        ),
        null
      )
    );

    
    variablesImportance = variablesImportance
        .merge( ee.FeatureCollection( [ importances ] ));
    
    
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
        yearMosaicAllBand.updateMask(regionMask),
        {
          bands: ['swir1_median', 'nir_median', 'red_median'],
          gain: [0.08, 0.06, 0.2]
        },
        'MOSAICO ' + year.toString(), false
      );
      
      Map.addLayer(
        img.select('classification_' + year),
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
      version: vOutClas,
      RFtrees: trees,
      samples_version: vSamples,
      descripcion: 'clasificacion-v1',
      paso: 'P06'
    });
  

  // Exportar assets a GEE y Google Drive
  var filename = country + '-' + regionId + '-' + vOutClas;
  var imageId = basePath + '/' + filename;  
  
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
  
 if(param.exports.classification_drive){
  Export.image.toDrive({
    image: classified,
    description: filename + '-DRIVE',
    folder: driveFolder,
    scale: 30,
    maxPixels: 1e13,
    region: region.geometry().bounds()
  });
 }
  if(param.exports.importance_variable){
  Export.table.toDrive({
    collection: variablesImportance, 
    description: 'IMPORTANCE-TABLE-' + filename,
    folder: driveFolder,
    fileFormat: 'CSV',
  });
  }
  
});


