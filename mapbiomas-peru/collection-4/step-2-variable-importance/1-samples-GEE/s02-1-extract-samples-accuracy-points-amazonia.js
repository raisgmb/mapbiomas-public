/**
 * s02-0-extract-samples, using Accuracy Col2 Mapbiomas
 * by: EYTC
*/


//Muestras Export para CSV
var param = {
  pais:'PERU', 
  mosaicRegion:'702', //Region de Mosaico
  version: '1', 
}

var years = [
    1985, 
    1986, 1987, 1988,
    1989, 
    1990, 
    1991, 1992,
    1993, 1994, 1995, 1996,
    1997, 1998, 1999, 
    2000,
    2001, 2002, 2003, 2004,
    2005, 2006, 2007, 2008,
    2009, 
    2010, 
    2011, 2012,
    2013, 2014, 
    2015, 
    2016,
    2017, 
    2018
    ];
    
var assetMosaic = "projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1";
var assetValidationPoint = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/mapbiomas_amazonia_50K_RAISG_plus_Brasil_v6'
var assetRegionVector= 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-3';

var regionVector = ee.FeatureCollection(assetRegionVector)
                     .filterMetadata("id_region", "equals", ee.Number.parse(param.mosaicRegion))
                     .map(function(fea){
                       return fea.simplify(30)
                     })
Map.addLayer(regionVector.style({ color: 'cyan', fillColor: 'ffffff00', width: 1 }),
    {},
    'regionVector',
    false)

var PuntoValida = ee.FeatureCollection(assetValidationPoint)
                         .filterMetadata('COUNTRY', 'equals', 'Peru')
                         .filterBounds(regionVector);
          
print('# Puntos Validacion',PuntoValida.size())
Map.addLayer(PuntoValida,{},'Points',false)

var originclas = [
 "Bosque Inundable",
 "Error",
 "Formación Campestre",
 "Formación Forestal", 
 "Formación Natural No Forestal Inundable", 
 "Glaciar", 
 "Mosaico de Agricultura y/o Pasto",
 "No Observado",
 "Otra Formación no Forestal", 
 "Río, Lago u Océano", 
 "Sin consolidar", 
 "Área sin Vegetación"]
 
var newclas = [
               6,
               0,
              12,
               3,
              11,
              34,
              21,
              27,
              13,
              33,
               0,
              25
             ]

// Nombre de bandas para seleccionar
var bandNames = years.map(
        function (year) {
            return 'CLASS_' + String(year);
        }
    )

//print(bandNames)
bandNames.forEach(function(band){
          PuntoValida = PuntoValida.remap(originclas, 
                                          newclas, band)
})

print(PuntoValida.limit(10))

var Mosaic_coll = ee.ImageCollection(assetMosaic)
               .filterMetadata('region_code', 'equals', param.mosaicRegion);
               

var addset = function(feature,year){ 
                return feature.set('reference', feature.get('CLASS_' + String(year)))
                              .set('year', year);
                              };


var hand30_100 = ee.ImageCollection("users/gena/global-hand/hand-100"),
    hand30_1000 = ee.Image("users/gena/GlobalHAND/30m/hand-1000"),
    hand90_1000 = ee.Image("users/gena/GlobalHAND/90m-global/hand-1000"),
    hand30_5000 = ee.Image("users/gena/GlobalHAND/30m/hand-5000"),
    swbd = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24"),
    altitude = ee.Image("JAXA/ALOS/AW3D30_V1_1"),
    // slppost = ee.Image("projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v1"),
    // shademask2_v1 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v1"),
    region = ee.FeatureCollection("projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-3"),
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
  
/**
* Get sample points
*/
var getSamples = function(mosaic, points,prop,year) {
    points =points.map(function(feature){ 
                return feature.set('reference', feature.get(prop));
                              })
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

var addyear =  function(featureColl,year) { 
               featureColl = featureColl.map(function(feature){
                        return feature.set('year', year)});
                      return featureColl
                 }
var  listSamples = []
for (var ii=0; ii< years.length; ii++){
      var year = years[ii]
      var mosaic = Mosaic_coll
                  .filterMetadata('year', 'equals', year)
                  .mosaic()
                  .addBands([altitude, slope,hands]);

      var pts = PuntoValida.filterMetadata('CLASS_'+year, 'not_equals', 0)

      var Samples = getSamples(mosaic,pts,'CLASS_' + String(year),year)
      Samples = addyear(Samples,year)

      listSamples.push(Samples)
    }

var featureCollection = ee.FeatureCollection(listSamples).flatten()
print(listSamples)
print(featureCollection.size())

Export.table.toDrive({
  collection:featureCollection, 
  description:'samples-accuracy-'+ param.mosaicRegion + '-' + param.pais+ '-' +param.version, 
  folder: 'Samples_col4_'+ param.pais, 
  fileNamePrefix:'samples-accuracy-'+  param.mosaicRegion + '-' +param.pais+ '-' +param.version,
  fileFormat:"CSV"
})

