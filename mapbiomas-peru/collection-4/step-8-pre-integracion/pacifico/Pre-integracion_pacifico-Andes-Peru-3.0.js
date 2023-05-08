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
        [[[-82.42318642949738, 0.4661610944423419],
          [-82.42318642949738, -19.555323177636534],
          [-67.85531533574738, -19.555323177636534],
          [-67.85531533574738, 0.4661610944423419]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// INTEGRACION PACIFICO COLECCION 1.0
// GRUPO DE DESARROLLO
var param = {//region, version
    region: 704,
    versionGeneral: 3,
    pais: 'PERU',
    yearsVis: [2000],  // Solo visualizacion
    ReglasIntegracion:[// Orden de integracion de clases 
                      // LOS PRIMEROS TIENEN LA MAYOR PREVALENCIA  (T=TRANVERSAL, G=GENERAL)
            [9, "T"],
            [9, "G"],
            [30, "T"],
            [24, "T"],
            [18, "G"],
            [15, "G"],
            [21, "G"],
            [3, "G"],
            [11, "G"],
            [4, "G"],
            [13, "G"],
            [34, "T"],
            [12, "G"],
            [33, "G"],
            [25, "G"]
                      ], 
    versionTransversal:{  // Indicar version de los temas transversales
          Manglar5      :1,
          mosaictransv9 :4,
          fnnfinund11   :2,
          mosaictransv18:4,
          urbano24      :1,
          mining30      :2,
          Glaciar34     :1,
            },
    version_output: 3,
    source:'Instituto del Bien Común (IBC)'
   };
   
//Paleta
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
    
// Assets
//---------------------------------
var palettes = require('users/mapbiomas/modules:Palettes.js');
var dirinput = 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/clasificacion'
var dirout = 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/integracion-region'
var assetCountries = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-4';
var regionesclass = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4'
var regionesclassRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4'
var regionesMosaicRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-mosaicos-4';

var assetmosaics= 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2'
var regionMosaicRaster = ee.Image(regionesMosaicRaster);
var MosaicoCollection = ee.ImageCollection(assetmosaics)
    .filter(ee.Filter.inList('year',param.yearsVis))
    .filterMetadata('country', 'equals', param.pais)
    .select(['swir1_median', 'nir_median', 'red_median'])
    // .map(
    //     function (image) {
    //         return image.updateMask(
    //             regionMosaicRaster.eq(ee.Number.parse(image.get('region_code')).toInt16()));
    //     }
    // );
    
var years = [ 1985, 1986, 1987, 1988, 1989,1990, 
              1991, 1992, 1993, 1994, 1995, 1996, 
              1997, 1998, 1999, 2000, 2001, 2002, 
              2003, 2004, 2005, 2006, 2007, 2008, 
              2009, 2010, 2011, 2012, 2013, 2014, 
              2015, 2016, 2017, 2018, 2019, 2020, 
              2021
              ];
              
var regionIntegrate = regionMosaicRaster.eq(param.region).selfMask();

//---------GENERAL-------------
var ClassGeneralColl = ee.ImageCollection(dirinput)
                         .filterMetadata('version', 'equals', param.versionGeneral.toString());
print(ClassGeneralColl)

var integratedRaisg = ee.Image('projects/mapbiomas-raisg/COLECCION4/INTEGRACION/integracion-pais/PERU-9');

//-----------------------------

    
// -------TRANSVERSALES--------
var Manglar5 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/MANGLAR/INTEGRACION/manglar4')
  .filterMetadata('country', 'equals', param.pais)
  .filterMetadata('version', 'equals', param.versionTransversal.Manglar5)
  .filter(ee.Filter.stringContains('system:index', 'PACIFIC'))
  .map(function(image){return image.updateMask(image.eq(5))})
  // .mosaic()
  // .eq(5).multiply(5)
  // .selfMask();
  
var mosaictransv9 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/AGRICULTURA/INTEGRACION/agricultura4')
  .filterMetadata('country', 'equals', param.pais)
  .filterMetadata('version', 'equals', param.versionTransversal.mosaictransv9.toString())
  .filter(ee.Filter.stringContains('system:index', 'PACIFIC'))
  .map(function(image){return image.updateMask(image.eq(9))})
  .map(function(image){return image.rename('classification')})
  // .mosaic()
  // .eq(9).multiply(9)
  // .selfMask();
  
var fnnfinund11 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/INUNDABLE/INTEGRACION/inundable114')
  .filterMetadata('country', 'equals', param.pais)
  .filterMetadata('version', 'equals', param.versionTransversal.fnnfinund11)
  .filter(ee.Filter.stringContains('system:index', 'PACIFIC'))
  .map(function(image){return image.updateMask(image.eq(11))})
  // .mosaic()
  // .eq(11).multiply(11)
  // .selfMask();

var mosaictransv18 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/AGRICULTURA/INTEGRACION/agricultura4')
  .filterMetadata('country', 'equals', param.pais)
  .filterMetadata('version', 'equals', param.versionTransversal.mosaictransv18.toString())
  .filter(ee.Filter.stringContains('system:index', 'PACIFIC'))
  .map(function(image){return image.updateMask(image.eq(18))})
  .map(function(image){return image.rename('classification')})
  // .mosaic()
  // .eq(18).multiply(18)
  // .selfMask();
  
var urbano24 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/URBANA/INTEGRACION/urbana4')
  .filterMetadata('country', 'equals', param.pais)
  .filterMetadata('version', 'equals', (param.versionTransversal.urbano24).toString())
  .filter(ee.Filter.stringContains('system:index', 'PACIFIC'))
  .map(function(image){return image.updateMask(image.eq(24))})
  // .mosaic()
  // .eq(24).multiply(24)
  // .selfMask();
  
var mining30 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/MINERIA/INTEGRACION/mineria4')  //
  .filterMetadata('country', 'equals', param.pais)
  .filterMetadata('version', 'equals', param.versionTransversal.mining30)
  .filter(ee.Filter.stringContains('system:index', 'PACIFIC'))
  .map(function(image){return image.updateMask(image.eq(30))})
  // .max()
  // .eq(30).multiply(30)
  // .selfMask()

var Glaciar34 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/GLACIAR/INTEGRACION/glaciar4')
  .filterMetadata('country', 'equals', param.pais)
  .filterMetadata('version', 'equals', param.versionTransversal.Glaciar34.toString())
  .map(function(image){return image.updateMask(image.eq(34))})
  // .mosaic()
  // .eq(34).multiply(34)
  // .selfMask();

//-----------------------------

//print(Manglar5, mosaictransv9, fnnfinund11,mosaictransv18,urbano24,mining30,Glaciar34)

var integracion_v1 = ee.Image().select([]);
years.forEach(function(year){
  
  var ClassGeneral = ClassGeneralColl.filter(ee.Filter.eq('year', year)).min();
  
  var assetsClasificaciones = {
        '5-T': Manglar5.filter(ee.Filter.eq('year', year)).min(),
        // '6-T': bosqinund6,
        '9-T': mosaictransv9.filter(ee.Filter.eq('year', year)).min(),
        '11-T': fnnfinund11.filter(ee.Filter.eq('year', year)).min(),
        // '15-T': pastos15,
        '18-T': mosaictransv18.filter(ee.Filter.eq('year', year)).min(),
        // '21-T': mosaictransv21,
        '24-T': urbano24.filter(ee.Filter.eq('year', year)).min(),
        '30-T': mining30.filter(ee.Filter.eq('year', year)).min(),
        // '33-T': agua33,
        '34-T': Glaciar34.filter(ee.Filter.eq('year', year)).min(),
        '3-G': ClassGeneral.eq(3).multiply(3).selfMask(),
        '4-G': ClassGeneral.eq(4).multiply(4).selfMask(),
        '5-G': ClassGeneral.eq(5).multiply(5).selfMask(),
        '6-G': ClassGeneral.eq(6).multiply(6).selfMask(),
        '11-G': ClassGeneral.eq(11).multiply(11).selfMask(),
        '12-G': ClassGeneral.eq(12).multiply(12).selfMask(),
        '13-G': ClassGeneral.eq(13).multiply(13).selfMask(),
        '15-G': ClassGeneral.eq(15).multiply(15).selfMask(),
        '18-G': ClassGeneral.eq(18).multiply(18).selfMask(),
        '21-G': ClassGeneral.eq(21).multiply(21).selfMask(),
        '25-G': ClassGeneral.eq(25).multiply(25).selfMask(),
        '29-G': ClassGeneral.eq(29).multiply(29).selfMask(),
        '33-G': ClassGeneral.eq(33).multiply(33).selfMask(),
        '34-G': ClassGeneral.eq(34).multiply(34).selfMask(),
        }
        
  var list_integrate = ee.List(param.ReglasIntegracion).reverse().getInfo()
    
  var integracion_year = ClassGeneral.multiply(0).add(27);
  
  list_integrate.forEach(function(clase) {
            integracion_year = integracion_year.blend(ee.Image(assetsClasificaciones[clase[0]+'-'+clase[1]]))
    });

  integracion_v1 = integracion_v1.addBands(integracion_year.rename('classification_'+year))

})

// print(integracion_v1)

integracion_v1 = integracion_v1.updateMask(ClassGeneralColl.first())
                              // .set('code_region', region[0])
                              .set('pais', param.pais)
                              .set('version', param.version_output)
                              .set('descripcion', 'integracion')
                              .set('region',param.region)
                              .updateMask(regionIntegrate);
var prefixo_out = 'Integracion-'+ param.pais+ '-' + param.region+ '-' + param.version_output;
print(integracion_v1)

Export.image.toAsset({
    'image': integracion_v1.toUint8(),
    'description': prefixo_out,
    'assetId': dirout+'/'+ prefixo_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 30,
    'maxPixels': 1e13
});


// var regionsRasterList = ee.List(param.code_regions).map( function(regionOne){
//   var regionR = ee.Image(regionesclassRaster).eq(ee.Number.parse(regionOne)).selfMask(); //ee.Number.parse(
//   return regionR;
// });

// print(regionsRasterList)
// regionsRasterList = ee.ImageCollection(regionsRasterList).mosaic()


for (var yearI = 0; yearI < param.yearsVis.length; yearI++) {
    var vis = {
        'bands': 'classification',
        'min': 0,
        'max': 45,
        'palette': palette//palettes.get('classification2')
    };
    var vis2 = {
        'bands': 'classification_'+param.yearsVis[yearI],
        'min': 0,
        'max': 45,
        'palette': palette //palettes.get('classification2')
    }; 
    Map.addLayer(
      MosaicoCollection.filterMetadata('year', 'equals', param.yearsVis[yearI])
                      .mosaic(),//.updateMask(regionsRasterList),
      {
        "bands": ["swir1_median","nir_median","red_median"],
        "min":407,"max":3381
      },
      'Mosaic' + '-' + param.yearsVis[yearI],
      false
    );
  var clasificacionYear = ClassGeneralColl.filter(ee.Filter.eq('year', param.yearsVis[yearI])).min()
  Map.addLayer(clasificacionYear,
      vis, 'classifGeneral' + '-' + param.yearsVis[yearI],false
    );

  var yearManglar = Manglar5.filter(ee.Filter.eq('year', param.yearsVis[yearI])).min()
  var yearMosaictransv9 = mosaictransv9.filter(ee.Filter.eq('year', param.yearsVis[yearI])).min()
  var yearFnnfinund = fnnfinund11.filter(ee.Filter.eq('year', param.yearsVis[yearI])).min()
  var yearMosaictransv18 = mosaictransv18.filter(ee.Filter.eq('year', param.yearsVis[yearI])).min();
  var yearUrbano = urbano24.filter(ee.Filter.eq('year', param.yearsVis[yearI])).min();
  var yearMining = mining30.filter(ee.Filter.eq('year', param.yearsVis[yearI])).min();
  var yearGlaciar = Glaciar34.filter(ee.Filter.eq('year', param.yearsVis[yearI])).min(); 

  var listTrans = [ [yearManglar,'Manglar'], 
                    [yearMosaictransv9,'Clase9'],
                    [yearFnnfinund,'Fnnfinund'], 
                    [yearMosaictransv18,'Clase18'],
                    [yearUrbano,'Urbano'], 
                    [yearMining,'Mineria'], 
                    [yearGlaciar,'Glaciar']
                  ];
  
  listTrans.forEach(function(transv){
    Map.addLayer(transv[0], vis, transv[1] + '-' + param.yearsVis[yearI],false
  );
  })

  Map.addLayer(
    integracion_v1,
    vis2, 'integracion' + '-' + param.yearsVis[yearI]
  );
  
  Map.addLayer(integratedRaisg, {
        bands: ['classification_' + param.yearsVis[yearI]],
        min: 0,
        max: 45,
        palette: palette,
        format: 'png'
     },'Pan-Amazon-raisg-col4' + param.yearsVis[yearI],
                false
            );
}

Map.addLayer(ee.FeatureCollection(regionesclass),{},'regionesclass',false)