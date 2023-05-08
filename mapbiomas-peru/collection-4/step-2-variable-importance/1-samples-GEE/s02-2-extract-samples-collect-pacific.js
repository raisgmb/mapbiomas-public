/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var P1_and = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P1-andes-pacifico"),
    P1_cost = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P1-costa-pacifico"),
    P2_and = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P2-andes-pacifico"),
    P2_cost = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P2-costa-pacifico"),
    P3_and = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P3-andes-pacifico"),
    P3_cost = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P3-costa-pacifico"),
    P4_and = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P4-andes-pacifico"),
    P4_cost = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P4-costa-pacifico"),
    P5_and = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P5-andes-pacifico"),
    P5_cost = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras-P5-costa-pacifico"),
    muestras_norte = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras_norte"),
    muestras_sur = ee.FeatureCollection("projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS/muestras_sur");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Muestras Export para CSV drive
var param = { 
  pais:'PERU', 
  mosaicRegion:'705', //Region de Mosaico 705=Costa  704=Andes
  regionName: 'Pacifico-Costa', //Pacifico-Andes, Pacifico-Costa
  puntos: [muestras_sur], //Puntos Colectados Anualmente //[P1_and,P2_and, P3_and, P4_and, P5_and]
  year: 2021,  // Año de los puntos colectados 
  version: '1', 
}
var assetMosaic = "projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2";

var mosaic = ee.ImageCollection(assetMosaic)
                  .filterMetadata('region_code', 'equals', Number(param.mosaicRegion))
                  .filterMetadata('year', 'equals', param.year)
                  .mosaic()
// print(mosaic)                  
Map.addLayer(mosaic, {
      'bands': ['swir1_median', 'nir_median', 'red_median'],
      'min':200,
      'max':5000
      //'gain': [0.08, 0.06, 0.08],
      //'gamma': 0.65
  },'Mosaico_'+ param.year,true);


var pts = param.puntos[0];
for (var i_sample = 1; i_sample < param.puntos.length; i_sample++) {
    pts = pts.merge(param.puntos[i_sample]);
}
var pts = pts.map(function(feature) { 
                return feature.set('reference', feature.get("class"))
                              .set('year', param.year)
})  

var list_pts = pts.reduceColumns(ee.Reducer.toList(), ['class']).get('list');
var freqClass = ee.List(list_pts).reduce(ee.Reducer.frequencyHistogram())

print(pts.size())
print(pts.limit(2))
print('freqClass',freqClass)

Map.addLayer(pts,{},'pts',false)

var palette = require('users/mapbiomas/modules:Palettes.js').get('classification2')
// Layers
    var eeColors = ee.List(palette);
    
    var trainingPointsColor = pts.map(
        function (feature) {
    
            var c = feature.get("reference");
    
            return feature.set({
                "style": {
                    "color": eeColors.get(c),
                    "pointSize": 4
                }
            });
        }
    );
    
Map.addLayer(trainingPointsColor.style({
        "styleProperty": "style"
    }), {}, 'pts_color',true);


var hand30_100 = ee.ImageCollection("users/gena/global-hand/hand-100"),
    hand30_1000 = ee.Image("users/gena/GlobalHAND/30m/hand-1000"),
    hand90_1000 = ee.Image("users/gena/GlobalHAND/90m-global/hand-1000"),
    hand30_5000 = ee.Image("users/gena/GlobalHAND/30m/hand-5000"),
    swbd = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24"),
    altitude = ee.Image("JAXA/ALOS/AW3D30_V1_1"),
    // slppost = ee.Image("projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v1"),
    // shademask2_v1 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v1"),
    region = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-noraisg-mosaic-regiones-1'),
    srtm = ee.Image("USGS/SRTMGL1_003");

// Imports
altitude = altitude.select('AVE').rename('altitude');
// slppost = slppost.updateMask(regionMask).rename('slppost');
var slope = ee.Terrain.slope(altitude).int8().rename('slope');

// potential water (valleys)
var thresholds = [0, 1, 2, 5, 10];
/**
 * Compute hands and shade mask 2 layers
 */
// smoothen HAND a bit, scale varies a little in the tiles
hand30_100 = hand30_100.mosaic().focal_mean(0.1);
swbd = swbd.select('water_mask');
var swbdMask = swbd.unmask().not().focal_median(1);


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
  .addBands(hand90_1000).addBands(HAND_water);
  
 mosaic = mosaic.addBands([altitude, slope,hands])

// print(mosaic)
/**
 * Get sample points
 */
var getSamples = function(mosaic, points) {
  
    var training = mosaic
                        .sampleRegions({
                            collection: points,
                            properties: ['reference'],
                            scale: 30,
                            geometries: true,
                            tileScale: 4
                      });
    
    return training 
};

var Samples = getSamples(mosaic,pts)
var Samples = Samples.map(function(feature) { 
                return feature.set('year', param.year)
})  
print(Samples.limit(10))

Export.table.toDrive({
  collection:Samples, 
  description:'samples-'+  param.mosaicRegion + '-' + param.pais + '-' + param.regionName + '-' +param.version, 
  folder: 'Samples_'+ param.pais, 
  fileNamePrefix:'samples-' +   param.mosaicRegion + '-' + param.pais + '-' + param.regionName + '-' +param.version,
  fileFormat:"CSV"
})




