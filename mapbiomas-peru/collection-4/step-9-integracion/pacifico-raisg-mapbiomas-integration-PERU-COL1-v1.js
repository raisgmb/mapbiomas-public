/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-82.33282423478884, 0.6132495370484361],
          [-82.33282423478884, -19.063982805355074],
          [-67.87481642228884, -19.063982805355074],
          [-67.87481642228884, 0.6132495370484361]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Integracion join Peru col1
var pais = 'PERU'; 
var id_pais = 13;
var outputAsset = 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/integracion-pais';
var outputVersion = 3; 
var yearVis = 2021

// assets to merge integrate
var assetList = [
  'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/integracion-pais/PERU-9',
  'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/integracion-region/Integracion-PERU-704-2',
  'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/integracion-region/Integracion-PERU-705-3'
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
var assetGrids = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-limite-Peru-1';
var paisraster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/PERU/per-limite-Peru-1';
var regionesclass = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4'

var grid = ee.FeatureCollection(assetGrids);
var gridMask = ee.Image(paisraster).selfMask();

Map.addLayer(grid,{},'COUNTRY',false)
Map.addLayer(gridMask,{},'gridMask',false)

var integrated = ee.Image()//.select()
// print(integrated)

// Integrate
// assetList.forEach(function(id){
//   var imageIntegrate = ee.Image(id);
//   integrated = integrated.blend(imageIntegrate)
  
// })
var ImageList = assetList.map(function(asset){return ee.Image(asset).selfMask()})
var integrated = ee.ImageCollection(ImageList).min()
print(integrated)

print(integrated)
// Map.addLayer(grid.geometry().bounds(),{},'GRID')
integrated = integrated.unmask(27)
                      // .clip(geometry)
                      .mask(gridMask);


Map.addLayer(integrated,{
                'bands': 'classification_'+ yearVis,
                'min': 0,
                'max': 45,
                'palette': palette,
                'format': 'png'
            }, 'integrated_'+yearVis)

var regionesclas = ee.FeatureCollection(regionesclass).filter(ee.Filter.eq('pais', 'Perú'))
// Map.addLayer(regionesclas,{},'regionesclass',false)
Map.addLayer(regionesclas.style({fillColor:'00000001',color:'000000',width:1}),{},'clasificacion-regiones-4',false)

Export.image.toAsset({
  'image': integrated.byte(),
  'description': 'Integracion-'+pais + '-' + outputVersion,
  'assetId': outputAsset + '/' + 'Integracion-'+ pais + '-' + outputVersion,
  'pyramidingPolicy': {
      ".default": "mode"
  },
  'region': geometry,
  'scale': 30,
  'maxPixels': 1e13
});


