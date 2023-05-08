/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var shademask2_v1 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v1"),
    geometry_11 = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-70.30947571356651, 2.294272817961065],
                  [-70.32870178778526, 2.2949589128903582],
                  [-70.3307617243087, 2.279178646414297],
                  [-70.31153565008995, 2.2771203380086624]]]),
            {
              "id": 11,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-70.10691528876183, 2.128914570681864],
                  [-70.13026123602745, 2.1296007420964234],
                  [-70.12545471747276, 2.1069569246605337],
                  [-70.1110351618087, 2.109015467176341]]]),
            {
              "id": 11,
              "system:index": "1"
            })]),
    geometry_13 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-70.44405823309776, 2.2414425274252405],
                  [-70.4571044977462, 2.2325229383674814],
                  [-70.44886475165245, 2.2215449083140015],
                  [-70.42551880438683, 2.224289423492906]]]),
            {
              "id": 13,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-70.42757874091026, 2.277806441137374],
                  [-70.41933899481651, 2.2599676538690887],
                  [-70.39873962958214, 2.26065376513581],
                  [-70.39805298407433, 2.2750620266627446]]]),
            {
              "id": 13,
              "system:index": "1"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/** 
 * STEP 04-0: CLASIFICACION
 * by: Actualizacion para col4 23/11/2021 EYTC
 * ----------------------------------------------------------------------------------------------
 */


var param = {
  country: 'PERU',
  regionId: 70113,
  trees: 50,
  variables: [

  ],
  tileScale: 4,
  additionalSamples: {
    polygons: [geometry_11, geometry_13],
    classes: [ 11, 13 ],
    points: [500, 200]
  },
  yearsPreview: [2000, 2005, 2018, 2021], //
  driveFolder: 'RF-PRELIMINAR-CLASSIFICATION',
  samplesVersion: 1,
  outputVersion: 1,
  exports : {
    importance_variable: false,
    classification_drive: false
     },
  useRegionBuffer: false   // si se pone true se va a generar un buffer de 250m en la region de clasificacion
};




/**
 * Import Modules CollectionDirectories
 */
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;

/**
 * Get region vector and mask
 */
var region = ee.FeatureCollection(paths.regionVectorBuffer);
region = region.filterMetadata("id_regionC", "equals", param.regionId);

if(param.useRegionBuffer){
  region = region.map(function(fea){return fea.buffer(250)})
}

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
var nBands = variables.length;
var outputVersion = param.outputVersion;
var trees = param.trees;
var additionalSamples = param.additionalSamples;
var yearsPreview = param.yearsPreview;
var driveFolder = param.driveFolder;
var samplesVersion = param.samplesVersion;


// Paths
var basePath = paths.classificationRaisg;
var samplesPath = paths.trainingPoints01;
var trainingSamples = samplesPath + 'samples-' + country + '-' + regionId;
 
 
// Imports
var palette = require('users/mapbiomas/modules:Palettes.js').get('classification2');


// Constants
var years = [
  1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
  1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 
  2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
  2018, 2019, 2020, 2021
];


// Outputs initialization
var variablesImportance = ee.FeatureCollection([]);
var classified = ee.Image(0);






/**
 * Set up mosaics
 */
var mosaicRegion = param.regionId.toString().slice(0, 3);
var joinedMosaics;

/* 
if(param.country === 'PERU') {
  
  joinedMosaics = ee.ImageCollection('projects/mapbiomas-raisg/MOSAICOS/workspace-c3-v2')
    .filterMetadata('region_code', 'equals', mosaicRegion);
    
}

else {
*/  
  joinedMosaics = ee.ImageCollection(paths.mosaics_c4)//c3_v2
    .filterMetadata('region_code', 'equals', Number(mosaicRegion));
    
//}
print(joinedMosaics.first().bandNames())








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

 
 // Importar datos de altitud
  var altitude = ee.Image('JAXA/ALOS/AW3D30_V1_1')
    .select('AVE')
    .rename('altitude');
      
  var slope = ee.Terrain.slope(altitude).int8()
    .rename('slope');
    
  /**
   * Hand
   */
  //-----------------------------------------------------------------------------
    var hand30_100 = ee.ImageCollection('users/gena/global-hand/hand-100');
    var srtm = ee.Image("USGS/SRTMGL1_003");
    var hand30_1000 =  ee.Image("users/gena/GlobalHAND/30m/hand-1000");
    var hand90_1000 = ee.Image("users/gena/GlobalHAND/90m-global/hand-1000");
    var hand30_5000 = ee.Image("users/gena/GlobalHAND/30m/hand-5000");
    var fa = ee.Image("users/gena/GlobalHAND/90m-global/fa");
    var jrc = ee.Image("JRC/GSW1_0/GlobalSurfaceWater");
    var HS_fa = ee.Image("WWF/HydroSHEDS/15ACC");
    var HS_fa30 = ee.Image("WWF/HydroSHEDS/30ACC");
    var demUk = ee.Image("users/gena/HAND/test_uk_DSM");
    
    // smoothen HAND a bit, scale varies a little in the tiles
    hand30_100 = hand30_100.mosaic().focal_mean(0.1);
    
    // potential water (valleys)
    var thresholds = [0,1,2,5,10];
    var HANDm = ee.List([]);
    thresholds.map(function(th) {
      var water = hand30_100.lte(th)
        .focal_max(1)
        .focal_mode(2, 'circle', 'pixels', 5).mask(swbdMask);
        
      HANDm = HANDm.add(water.mask(water).set('hand', 'water_HAND_<_' + th + 'm'));
    });
    
    // exclude SWBD water
    var swbd = ee.Image('MODIS/MOD44W/MOD44W_005_2000_02_24').select('water_mask');
    Map.addLayer(swbd, {}, 'swbd mask', false);
    var swbdMask = swbd.unmask().not().focal_median(1);
    
    // water_hand	water (HAND < 5m)
    var HAND_water = ee.ImageCollection(HANDm)
    
    // exports.
    hand30_100  =hand30_100.rename('hand30_100');
    hand30_1000 =hand30_1000.rename('hand30_1000');
    hand30_5000 =hand30_5000.rename('hand30_5000');
    hand90_1000 =hand90_1000.rename('hand90_1000');
    HAND_water  =HAND_water.toBands().rename(['water_HAND_0m',
                                                  'water_HAND_1m',
                                                  'water_HAND_2m',
                                                  'water_HAND_5m',
                                                  'water_HAND_10m']);
            
    var Hand_bands =  hand30_100.addBands(hand30_1000)
                                .addBands(hand30_5000)
                                .addBands(hand90_1000)
                                .addBands(HAND_water);
                                
    // print(Hand_bands)
  
  /**
   * Latitud Longitud
   */
  //-----------------------------------------------------------------------------
  var longLat = ee.Image.pixelLonLat();
  
  /**
   * ShadeMask2
   */
  //-----------------------------------------------------------------------------
  var shademask2 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v2").rename('shademask2');
  
  /**
   * slppost
   */
  //-----------------------------------------------------------------------------
  var slppost = ee.Image("projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v1").rename('slppost');
  
  //-----------------------------------------------------------------------------
  
 
 
 
/**
 * Implement random forests classification
 */
ee.List(years).evaluate(function(years, error){
  
  if(error) print(error.message);
  
  var variablesImportance = ee.FeatureCollection([]);

  years.forEach(function(year) {
  
    var yearMosaic = joinedMosaics
      .filterMetadata('year', 'equals', year)
      .median()
      .addBands(altitude)
      .addBands(slope)
      .addBands(longLat)
      .addBands(Hand_bands)
      .addBands(slppost)
      .addBands(shademask2)
      .updateMask(regionMask);
      
    var yearMosaicRGB = yearMosaic;
    
    if(variables.length > 0) yearMosaic = yearMosaic.select(variables);
      
    var bands = yearMosaic.bandNames();
    
    var contained = bands.containsAll(ee.List(variables));
    

    var yearTrainingSamples = ee.FeatureCollection(
      ee.Algorithms.If(
        contained,
        ee.FeatureCollection(
          trainingSamples + '-' + year + '-' + 'p03-' + samplesVersion),
        null
      )
    );

    
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
    
    
    //Importance table
    var importances = ee.Feature(
      ee.Algorithms.If(
        contained,
        ee.Algorithms.If(
          // solución al problema 'only one class'
          ee.Algorithms.IsEqual(nClasSample, 1),
          null,
          ee.Feature( null, 
            ee.Dictionary(explainer.get('importance')))
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
        yearMosaicRGB,
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
      paso: 'P04-0'
    });
    
  print('Para Exportar: ',classified)

  // Exportar assets a GEE y Google Drive
  var filename = country + '-' + regionId + '-' + outputVersion;
  var imageId = basePath + '/' + filename;  
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
    description: tableName,
    folder: driveFolder,
    fileFormat: 'CSV',
  });
}
  
});


