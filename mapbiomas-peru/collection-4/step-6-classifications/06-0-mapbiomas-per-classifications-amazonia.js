/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry_21 = 
    /* color: #cae99e */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.43964530524632, -13.686884131848567],
                  [-73.46985770759007, -13.68955270490702],
                  [-73.45887137946507, -13.722907311987726],
                  [-73.42453910407444, -13.720239117748564]]]),
            {
              "id": 21,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.37372733649632, -13.62282931033678],
                  [-73.36411429938694, -13.652189929611003],
                  [-73.33664847907444, -13.650855435222471],
                  [-73.34488822516819, -13.628167876204989]]]),
            {
              "id": 21,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.93952323493382, -13.81894205438262],
                  [-73.97660209235569, -13.822942644859507],
                  [-73.95188285407444, -13.861611473393516],
                  [-73.92167045173069, -13.850944852767519]]]),
            {
              "id": 21,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.22119328681454, -13.560759647014661],
                  [-73.24934575263485, -13.548076750077753],
                  [-73.25277898017391, -13.566767098735623],
                  [-73.23217961493954, -13.569437028493912]]]),
            {
              "id": 21,
              "system:index": "3"
            })]),
    geometry_13 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.40315434638485, -13.52838354332897],
                  [-73.42444035712704, -13.529051136341486],
                  [-73.4223804206036, -13.553750761320256],
                  [-73.40315434638485, -13.548410519193615]]]),
            {
              "id": 13,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.36676213447079, -13.711900815245622],
                  [-73.39010808173641, -13.72123969414363],
                  [-73.37225529853329, -13.746586205626189],
                  [-73.3619556159161, -13.730578201390363]]]),
            {
              "id": 13,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.25071904365048, -13.634507266536907],
                  [-73.26925847236141, -13.635841853351456],
                  [-73.27063176337704, -13.654525276624579],
                  [-73.25621220771298, -13.657194216324793],
                  [-73.25003239814266, -13.640512847811358]]]),
            {
              "id": 13,
              "system:index": "2"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var param = {
  country: 'PERU',
  regionId: 70302,
  trees: 50,
  variables: [
    //Amazonia Alta
    
    // 'swir1_median', 'nir_median', 'red_median', 'shademask2',
    // 'swir2_median', 'ndfi_median', 'savi_wet', 'ndwi_gao_median',
    // 'ndmir_max', 'ndsi2_min', 'swir2_dry', 'gli_max', 'green_median', 'ndsi_median',
    // 'green_min', 'ndfi_wet', 'gvs_dry', 'swir2_wet', 'ndbi_dry', 'ndrb_stdDev','altitude',
    // 'ndfib_median', 'hand30_100', 'slppost', 'ndmir_wet', 'npv_median',
    // 'wefi_stdDev', 'swir1_min', 'shade_median', 'ndmir_median', 'savi_dry',
    // 'blue_median', 'sefi_stdDev', 'ndvi_wet', 'red_wet', 'ndmi_dry', 'ndmir_min', 'nir_dry',
   
    
    //Amazonia Baja
 
    // 'swir1_median', 'nir_median', 'red_median', 'shademask2',
    // 'swir2_dry','gv_median','green_dry','ndsi_median','red_min',
    // 'swir2_median','nir_wet','shade_median','ndsi_min','altitude','wefi_wet',
    // 'nir_min','ndwi_mcfeeters_median','swir1_dry','savi_dry','ndmir_min','swir2_min',
    // 'sefi_median','pri_dry','swir2_wet','savi_median','ndsi2_min','swir1_min','textG_median',
    // 'mndwi_wet','ndvi_dry','ndfib_median','ndwi_gao_wet','ndsi2_wet','pri_median','cai_median',
    // 'gvs_median','ndbi_median',
   
    
    //Andes
    // 'swir1_median', 'nir_median', 'red_median', 'shademask2',
    // 'savi_dry','ndbi_median','hand30_100','ndgb_max','sefi_dry','gli_max','swir1_wet',
    // 'ndwi_mcfeeters_median','ndgb_median','swir2_dry','ndgb_wet','ndsi2_dry','ndmi_dry',
    // 'shade_median','ndrb_wet','ndgb_stdDev','mndwi_max','nir_stdDev','ndsi_median',
    // 'hand90_1000','cai_median','red_min','ndfi_median','gli_median','fns_dry',
    // 'ndsi_min', 'ndmi_max','evi2_amp','altitude','ndmir_median','ndbi_dry','soil_amp',
    // 'ndsi2_median', 'ndsi2_min', 'ndmi_median',
  
    //Cerrado
    /*
    'swir1_median', 'nir_median','red_median', 'shademask2',
    'ndmir_median','ndwi_gao_dry','savi_dry','gv_amp','ndbi_min','ndbi_max','wefi_wet',
    'gli_dry', 'mndwi_min','mndwi_median','swir2_dry','gv_stdDev','ndrb_wet','ndvi_dry',
    'nir_stdDev','ndfib_amp','gli_max','nir_wet','ndrb_min','ndvi_stdDev','snow_median',
    'wir1_dry','nir_min','ndwi_gao_median','nir_dry','evi2_median','red_wet','cai_median',
    'gli_median','ndfi_amp','ndmir_wet','ndfi_wet','ndsi2_max','swir1_wet','mndwi_stdDev',
    'swir2_min'
    */

  ],
  //cicle: 'ciclo-1',
  input_samples: 2, 
  out_clasific: 3,
  tileScale: 8,
  additionalSamples: {
    polygons: [ geometry_13, geometry_21 ],
    classes: [ 13, 21 ],
    points: [500, 200]
  },
  yearsPreview: [ 1995, 2005, 2018, 2021 ],
  canopy_height:{
    viewCanopy_height: true,
    canopy_height_thr: 9,  // threshold mask meters with Global Canopy Height 2020  clase 3 y 6
  },
  driveFolder: 'RF-PRELIMINAR-CLASSIFICATION',
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
var cicle = param.cicle;
var trees = param.trees;
var additionalSamples = param.additionalSamples;
var yearsPreview = param.yearsPreview;
var driveFolder = param.driveFolder;


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

var thresholds = [0, 1, 2, 5, 10];

// var version = {
//   'ciclo-1': { input_sample: 2, out_clas: 3, out_geo: 5 },
//   'ciclo-2': { input_sample: 3, out_clas: 10, out_geo:8 }
// };
// var version = version[cicle];
// var vSamples = version.input_sample;
// var vOutClas = version.out_clas;

var vSamples = param.input_samples;
var vOutClas = param.out_clasific;

// Outputs initialization
var variablesImportance = ee.FeatureCollection([]);
var classified = ee.Image(0);

var mosaicRegion = param.regionId.toString().slice(0, 3);
var joinedMosaics = ee.ImageCollection(paths.mosaics_c4)
                    .filter(ee.Filter.eq('region_code',  Number(mosaicRegion)));

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

  years.forEach(function(year) {
  
    var yearMosaic = joinedMosaics
      .filterMetadata('year', 'equals', year)
      .median()
      .addBands(altitude)
      .addBands(slope)
      // .addBands(longLat)
      .addBands(Hand_bands)
      .addBands(slppost)
      .addBands(shademask2)
      .updateMask(regionMask)
      ;

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
        yearMosaic.updateMask(regionMask),
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
  

  Export.image.toDrive({
    image: classified,
    description: filename + '-DRIVE',
    folder: driveFolder,
    scale: 30,
    maxPixels: 1e13,
    region: region.geometry().bounds()
  });

Map.addLayer(region,{},'region',false)
  
});


if(param.canopy_height.viewCanopy_height){
  // Canopy height forest
  var canopy_height = ee.Image('users/nlang/ETH_GlobalCanopyHeight_2020_10m_v1').updateMask(regionMask);
  var canopy_height_forest = canopy_height.gte(param.canopy_height.canopy_height_thr);

   Map.addLayer(canopy_height,{"min":1,"max":35,
                               "palette":["ff0000","ff9e0f","fcff0c","4fff13","05890f"]}, 'canopy_height', false
                               );
   Map.addLayer(canopy_height_forest.selfMask(),{
                               "palette":"green"}, 'canopy_height_thr', false
                               );
                               
  }
