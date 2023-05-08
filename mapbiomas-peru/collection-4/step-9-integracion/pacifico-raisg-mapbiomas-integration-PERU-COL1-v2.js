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
          [-67.87481642228884, 0.6132495370484361]]], null, false),
    reclass_24_a_25 = /* color: #ff1d1d */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-71.57764394346742, -16.309833843665047],
                  [-71.58541162077455, -16.307115396560764],
                  [-71.59124810759096, -16.312717003899305],
                  [-71.58777202066842, -16.313046588444955],
                  [-71.58536878473885, -16.314302802660368],
                  [-71.58571211328697, -16.316382758346457],
                  [-71.58418860116464, -16.31510594379319],
                  [-71.58309424468843, -16.316053223522022],
                  [-71.58099134031801, -16.31708285142312]]]),
            {
              "class_original": 24,
              "class_final": 25,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-71.5170897128665, -16.299753072457314],
                  [-71.51314150119657, -16.29299772609232],
                  [-71.51932131076688, -16.2869012380602],
                  [-71.5277327182376, -16.28970235069595],
                  [-71.5323461177432, -16.29789949450158],
                  [-71.52917038226958, -16.29792008990853],
                  [-71.52698727457728, -16.299668051761024],
                  [-71.52660657755837, -16.304175727160725],
                  [-71.52487401265583, -16.29961127910649],
                  [-71.52018029753238, -16.30171957917306]]]),
            {
              "class_original": 24,
              "class_final": 25,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-71.51161800647611, -16.33138476481487],
                  [-71.52020107532377, -16.33855060956092],
                  [-71.51848449845892, -16.343574723336044],
                  [-71.51826991493766, -16.345880874469906],
                  [-71.51651035571928, -16.34818702101145],
                  [-71.51256214404935, -16.352387359294934],
                  [-71.50784145618314, -16.349669503661993],
                  [-71.50869976306791, -16.33550309849345]]]),
            {
              "class_original": 24,
              "class_final": 25,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-70.89285596358634, -14.615932631361227],
                  [-70.89195474135734, -14.614894464847755],
                  [-70.89139684188224, -14.613108806970684],
                  [-70.891740165143, -14.60945439264637],
                  [-70.8924697254882, -14.612693535617336],
                  [-70.8939288471923, -14.61506057181955]]]),
            {
              "class_original": 24,
              "class_final": 25,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-70.1221046095891, -14.733242840811378],
                  [-70.12139650640917, -14.733284345110624],
                  [-70.1192936545415, -14.733222088658794],
                  [-70.1172766333623, -14.732392000934848],
                  [-70.11562439260912, -14.72971494648193],
                  [-70.11637541113329, -14.72927914380734],
                  [-70.11890741644335, -14.732018460427366],
                  [-70.12173982916308, -14.732246735258023],
                  [-70.12238355932665, -14.733014567024286]]]),
            {
              "class_original": 24,
              "class_final": 25,
              "system:index": "4"
            })]),
    ANDES = /* color: #f6ff09 */ee.Geometry.MultiPoint(
        [[-69.95564242976334, -17.771255432379885],
         [-71.58388613794799, -16.315046612178364],
         [-71.52002810572142, -16.29692340118541],
         [-71.5131616506433, -16.338604277920698],
         [-76.09588946679575, -11.591569616501493],
         [-70.89278443977993, -14.61449231917488],
         [-70.11673628748082, -14.730767269073683]]),
    Costa = /* color: #16f240 */ee.Geometry.MultiPoint(
        [[-71.35922474759623, -17.487664379124237],
         [-71.36437458890482, -17.522534985462617]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/


// Integracion join Peru col1
var pais = 'PERU'; 
var id_pais = 13;
var outputAsset = 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/integracion-pais';
var outputVersion = 4; 
var yearsVis = [1985,2000, 2010, 2021]

// assets to merge integrate
var assetList = [
  'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/integracion-pais/PERU-9',
  'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/integracion-region/Integracion-PERU-704-4',
  'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/integracion-region/Integracion-PERU-705-4'
  ]

// Asset o featurecollecion para remap
var assetsRemap = [
      // 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/AJUSTES3/PERU',
      // de_27_a_12,
      // 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/AJUSTES3/PERU',
    // de_27_a_12,
    reclass_24_a_25
  ];




// import modules
var Legend = require('users/joaovsiqueira1/packages:Legend.js');

var palette = [
    '#ffffff', // [00]      0. Ausência de dados
    '#129912', // [01]      1. Floresta
    '#1f4423', // [02]    1.1. Floresta Natural
    '#006400', // [03]  1.1.1. Formação Florestal
    '#32CD32', // [04]  1.1.2. Formação Savânica
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
    '#FFEFC3', // [21]    3.3. Mosaico de Agricultura ou Pastagem
    '#ea9999', // [22]      4. Área não Vegetada
    '#dd7e6b', // [23]    4.3. Praia e Duna
    '#aa0000', // [24]    4.1. Infraestrutura Urbana //'#aa0000'
    '#FF8585', // [25]    4.4. Outra Área não Vegetada  //'#ff0000',
    '#0000ff', // [26]      5. Corpo D'água
    '#d5d5e5', // [27]      6. Não Observado
    '#dd497f', // [28]-
    '#665A3A', // [29]    2.4. Afloramento Rochoso
    '#FF0000', // [30]    4.2. Mineração   //'#af2a2a'
    '#8a2be2', // [31]  5.2.3. Aquicultura
    '#968c46', // [32]    2.3. Apicum
    '#0000ff', // [33]    5.1. Corpo dágua Natura
    '#4fd3ff', // [34]    5.3. Glaciais
    '#BA6A27', // [35]-
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
var assetRegionMosaicRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-mosaicos-4';
var assetMosaic = "projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2";

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

// Map.addLayer(grid.geometry().bounds(),{},'GRID')
integrated = integrated.unmask(27)
                      // .clip(geometry)
                      .mask(gridMask);

var regionMosaicRaster  = ee.Image(assetRegionMosaicRaster).rename(['regions'])
var getMosaic = function(paths, regionRaster) {
  
      // Mosaic
      regionRaster = regionRaster.where(regionRaster.eq(211),210)
      regionRaster = regionRaster.where(regionRaster.eq(205),210)
      var Mosaic_coll = ee.ImageCollection(paths)
                        .filterMetadata('country', 'equals', pais)
                        .select(["swir1_median","nir_median","red_median"])
                        .map(
                            function (image) {
                                return image.updateMask(
                                    regionRaster.eq(ee.Number.parse(image.get('region_code')).toInt16()));
                            }
                        );
                        
                          

      // Aditional Bands
      var joinedMosaics = Mosaic_coll;
                  
      
      // Select variables
      return joinedMosaics;
      
  };

var mosaicsRAISG = getMosaic(assetMosaic, regionMosaicRaster);


// REMAP------------------------------------------------------------------------------------

  // load remap polygons
  var remapCollection = ee.FeatureCollection(
      assetsRemap.map(
          function (item) {
              return ee.FeatureCollection(item);
          }
      )
  ).flatten();
  
  // Get remap masks
  var integratedRemaped = remapCollection.iterate(
      function (feature, image) {
          image = ee.Image(image);
  
          var polygon = ee.FeatureCollection(feature);
          var original = ee.Image().paint(polygon, 'class_original')
              .clipToBoundsAndScale(polygon.geometry(), null, null, null, 30);
  
          var final = ee.Image().paint(polygon, 'class_final')
              .clipToBoundsAndScale(polygon.geometry(), null, null, null, 30);
  
          return image.where(image.eq(original), final);
      },
      integrated
  );
  
  
  integratedRemaped = ee.Image(integratedRemaped).mask(gridMask);



//------------------------------------------------------------------------------------


yearsVis.forEach(function(year){

var mosaicYear = mosaicsRAISG
                .filterMetadata('year', 'equals', year)
                .mosaic()
                .mask(gridMask);

Map.addLayer(mosaicYear,{
        "bands":["swir1_median","nir_median","red_median"],
        "min":407,"max":3381}, 'Mosaic' + year,false)
        
Map.addLayer(integrated,{
                'bands': 'classification_'+ year,
                'min': 0,
                'max': 45,
                'palette': palette,
                'format': 'png'
            }, 'integrated_'+year, false)
            
Map.addLayer(integratedRemaped,{
                'bands': 'classification_'+ year,
                'min': 0,
                'max': 45,
                'palette': palette,
                'format': 'png'
            }, 'integratedRemaped_'+year, false)
})

var regionesclas = ee.FeatureCollection(regionesclass).filter(ee.Filter.eq('pais', 'Perú'))
// Map.addLayer(regionesclas,{},'regionesclass',false)
Map.addLayer(regionesclas.style({fillColor:'00000001',color:'000000',width:1}),{},'clasificacion-regiones-4',false)

Export.image.toAsset({
  'image': integratedRemaped.byte(),
  'description': 'Integracion-'+pais + '-' + outputVersion,
  'assetId': outputAsset + '/' + 'Integracion-'+ pais + '-' + outputVersion,
  'pyramidingPolicy': {
      ".default": "mode"
  },
  'region': geometry,
  'scale': 30,
  'maxPixels': 1e13
});


