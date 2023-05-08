// Integracion join

var outputAsset = 'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/integracion-pais';
var outputVersion = 8; 

// assets
var assetList = [
  'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/integracion-region/PERU-8-ANDES',
  'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/integracion-region/PERU-7-AMAZ'
  ]

// import modules
var Legend = require('users/joaovsiqueira1/packages:Legend.js');

var palette = [
    '#ffffff', // [00]      0. Ausência de dados
    '#129912', // [01]      1. Floresta
    '#1f4423', // [02]    1.1. Floresta Natural
    '#006400', // [03]  1.1.1. Formação Florestal
    '#00ff00', // [04]  1.1.2. Formação Savânica
    '#687537', // [05]  1.1.3. Mangue
    '#76a5af', // [06]-
    '#29eee4', // [07]-
    '#77a605', // [08]-
    '#935132', // [09]    1.2. Floresta Plantada
    '#bbfcac', // [10]      2. Formação Natural não Florestal
    '#45c2a5', // [11]    2.1. Área Úmida Natural não Florestal
    '#b8af4f', // [12]    2.2. Formação Campestre
    '#f1c232', // [13]    2.5. Outra Formação não Florestal
    '#ffffb2', // [14]      3. Agropecuária
    '#ffd966', // [15]    3.1. Pastagem
    '#f6b26b', // [16]-
    '#f99f40', // [17]-
    '#e974ed', // [18]    3.2. Agricultura
    '#d5a6bd', // [19]  3.2.1. Lavoura Temporária
    '#c27ba0', // [20]3.2.1.2. Cana
    '#fff3bf', // [21]    3.3. Mosaico de Agricultura ou Pastagem
    '#ea9999', // [22]      4. Área não Vegetada
    '#dd7e6b', // [23]    4.3. Praia e Duna
    '#aa0000', // [24]    4.1. Infraestrutura Urbana //'#aa0000'
    '#ff99ff', // [25]    4.4. Outra Área não Vegetada  //'#ff0000',
    '#0000ff', // [26]      5. Corpo D'água
    '#d5d5e5', // [27]      6. Não Observado
    '#dd497f', // [28]-
    '#b2ae7c', // [29]    2.4. Afloramento Rochoso
    '#580000', // [30]    4.2. Mineração   //'#af2a2a'
    '#8a2be2', // [31]  5.2.3. Aquicultura
    '#968c46', // [32]    2.3. Apicum
    '#0000ff', // [33]    5.1. Corpo dágua Natura
    '#4fd3ff', // [34]    5.3. Glaciais
    '#645617', // [35]-
    '#f3b4f1', // [36]  3.2.3. Lavoura Perene
    '#02106f', // [37]    5.2. Corpo dágua Artificial
    '#02106f', // [38]  5.2.1. Reservatórios
    '#c59ff4', // [39]3.2.1.1. Soja
    '#ba87f8', // [40]3.2.1.3. Arroz
    '#e787f8', // [41]3.2.1.4. Outros
    '#cca0d4', // [42]3.2.2.1. Café
    '#d082de', // [43]3.2.2.1. Citrus
    '#cd49e4', // [44]3.2.2.1. Caju
    '#e04cfa', // [45]3.2.2.1. Outros
];


/**
 * Export to asset
 */
var assetGrids = "projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/country";
var lim_raisg = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/limite-raisg-4';
var regMosaic = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-mosaicos-4'

var grids = ee.FeatureCollection(assetGrids);
var lim_raisg = ee.Image(lim_raisg);
// var regMosaicRaster = ee.Image(regMosaic).eq(703).selfMask();

// var grid = grids.filter(ee.Filter.stringContains('name', 'Perú'));
var grid = grids.filter(ee.Filter.eq('feature_id', 13));

var gridMask = grid.reduceToImage(['cod_iddivp'], ee.Reducer.first());
Map.addLayer(grid,{},'COUNTRY')

var integrated = ee.Image()//.select()
// print(integrated)

assetList.forEach(function(id){
  
  var imageIntegrate = ee.Image(id);
  integrated = integrated.blend(imageIntegrate)
  
})

print(integrated)
// Map.addLayer(grid.geometry().bounds(),{},'GRID')


Map.addLayer(integrated,{
                'bands': 'classification_2021',
                'min': 0,
                'max': 45,
                'palette': palette,
                'format': 'png'
            }, 'integrated')

Export.image.toAsset({
  'image': integrated,
  'description': 'PERU' + '-' + outputVersion,
  'assetId': outputAsset + '/' + 'PERU' + '-' + outputVersion,
  'pyramidingPolicy': {
      ".default": "mode"
  },
  'region': grid.geometry().bounds(),
  'scale': 30,
  'maxPixels': 1e13
});


