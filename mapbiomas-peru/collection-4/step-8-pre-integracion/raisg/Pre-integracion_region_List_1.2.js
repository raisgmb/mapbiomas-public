// INTEGRACION POR REGIONES MAPBIOMAS AMAZONIA COLECCION 4
// GRUPO DE DESARROLLO
var param = {//region, version
    code_regions: [[70210,7],
                   [70209,7]],  
    pais: 'PERU',
    years: [2020],  // Solo visualizacion
    // versionGeneral : 7,
    ReglasIntegracion:[   // Orden de integracion de clases 
                          // LOS PRIMEROS TIENEN LA MAYOR PREVALENCIA  (T=TRANVERSAL, G=GENERAL)
                      // [30,'T'],
                      // [33,'T'],
                      // [33,'G'],
                      // [34,'T'],
                      [34,'G'],
                      [24,'T'],
                      // [18,'T'],
                      // [11,'T'],
                      [11,'G'],
                      // [15,'T'],
                      // [21,'T'],
                      [21,'G'],
                      [25,'G'],
                      [12,'G'],
                      [13,'G'],
                      // [6,'T'],
                      [6,'G'],
                      [3,'G'],
                      ], 
    versionTransversal:{  // Indicar version de los temas transversales
          bosqinund6 :5,
          fnnfinund11:5,
          Pastos15      :5,
          mosaictransv18:7,
          mosaictransv21:7,
          urbano24      :7,
          mining30      :3,
          agua33        :5,
          Glaciar34     :2,
            },
    version_output: 1,
    source:'Instituto del Bien Común (IBC)'
   };
   
   
    
// Assets
//---------------------------------
var palettes = require('users/mapbiomas/modules:Palettes.js');
var dirinput = 'projects/mapbiomas-raisg/COLECCION4/clasificacion-ft'
var dirout = 'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/integracion-region'
var assetCountries = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-2';
var regionesclass = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-buffer-250m'
var regionesclassRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4'
var regionesMosaicRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/mosaico-regiones-4'
var assetmosaics= 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2'
var regionMosaicRaster = ee.Image(regionesMosaicRaster)
var MosaicoCollection = ee.ImageCollection(assetmosaics)
    .filter(ee.Filter.inList('year',param.years))
    .filterMetadata('country', 'equals', param.pais)
    .select(['swir1_median', 'nir_median', 'red_median'])
    .map(
        function (image) {
            return image.updateMask(
                regionMosaicRaster.eq(ee.Number.parse(image.get('region_code')).toInt16()));
        }
    );
// ----TRANSVERSALES----

var mining30 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/MINERIA/clasificacion-ft')  //
  .filterMetadata('pais', 'equals', param.pais)
  .filterMetadata('version', 'equals', param.versionTransversal.mining30)
  // .map(function(image){
  //   return image.eq(30).or(image.eq(1)).multiply(30)
  // })
  .max()
  .selfMask()

var fnnfinund11 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/INUNDABLE/clasificacion')
  .filterMetadata('cover', 'equals', 'wetlands')
  .filterMetadata('version', 'equals', param.versionTransversal.fnnfinund11)
  .filterMetadata('pais', 'equals', param.pais)
  .mosaic()
  // .eq(1).multiply(11)
  .selfMask();

var bosqinund6 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/INUNDABLE/clasificacion')
  .filterMetadata('cover', 'equals', 'flooded')
  .filterMetadata('version', 'equals', param.versionTransversal.bosqinund6)
  .filterMetadata('pais', 'equals', param.pais)
  .mosaic()
  // .eq(1).multiply(6)
  .selfMask();

var mosaictransv21 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/AGRICULTURA/clasificacion-ft')
  .filterMetadata('version', 'equals', param.versionTransversal.mosaictransv21)
  .filterMetadata('pais', 'equals', param.pais)
  .mosaic()
  // .eq(1).multiply(21)  //revisar paso ( mosaico=1)
  .selfMask();
  
var mosaictransv18 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/AGRICULTURA/clasificacion-ft')
  .filterMetadata('version', 'equals', param.versionTransversal.mosaictransv18)
  .filterMetadata('pais', 'equals', param.pais)
  // .map(function(image){
  //     return image.gte(1).and(image.lte(5)).multiply(18)
  // })
  .mosaic()
  .selfMask();
  
var pastos15 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/PASTURE/clasificacion-ft')
  .filterMetadata('version', 'equals', param.versionTransversal.Pastos15)
  .filterMetadata('pais', 'equals', param.pais)
  .mosaic()
  // .eq(1).multiply(15)  // (pastos=1)
  .selfMask();
  
var agua33 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/AGUA/clasificacion-ft')
  .filterMetadata('pais', 'equals', param.pais)
  .filterMetadata('version', 'equals',(param.versionTransversal.agua33).toString())
  .mosaic()
  .eq(33).multiply(33)
  .selfMask();

var urbano24 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/URBANA/clasificacion-ft')
  .filterMetadata('pais', 'equals', param.pais)
  .filterMetadata('version', 'equals', (param.versionTransversal.urbano24).toString())
  .mosaic()
  .eq(24).multiply(24)
  .selfMask();
  
var Glaciar34 = ee.ImageCollection('projects/mapbiomas-raisg/TRANSVERSALES/' + param.pais + '/COLECCION4/GLACIAR/clasificacion-ft')
  .filterMetadata('pais', 'equals', param.pais)
  .filterMetadata('version', 'equals', param.versionTransversal.Glaciar34)
  .mosaic()
  .eq(34).multiply(34)
  .selfMask();

//----------------------
var ClassGeneralList = ee.ImageCollection(dirinput)
                      // .filter(ee.Filter.inList('code_region',param.code_regions))
                      // .filterMetadata('version', 'equals', param.versionGeneral);

var integracion_coll = ee.List([])
var integracion_gener = ee.List([])
param.code_regions.forEach(function(region){
  
  var regionsRaster = ee.Image(regionesclassRaster).eq(region[0]).selfMask();
  
  var regioV = ee.FeatureCollection(regionesclass)
                    .filterMetadata("id_regionC","equals", region[0]);
                    
  
      
  var ClassGeneral = ClassGeneralList
                      .filterMetadata('code_region', 'equals', region[0])
                      .filterMetadata('version', 'equals',region[1])
                      .first();
                      
  integracion_gener = integracion_gener.add(ClassGeneral)
  
  var assetsClasificaciones = {
      '6-T': bosqinund6,
      '11-T': fnnfinund11,
      '15-T': pastos15,
      '18-T': mosaictransv18,
      '21-T': mosaictransv21,
      '24-T': urbano24,
      '30-T': mining30,
      '33-T': agua33,
      '34-T': Glaciar34,
      '3-G': ClassGeneral.eq(3).multiply(3).selfMask(),
      '6-G': ClassGeneral.eq(6).multiply(6).selfMask(),
      '11-G': ClassGeneral.eq(11).multiply(11).selfMask(),
      '12-G': ClassGeneral.eq(12).multiply(12).selfMask(),
      '13-G': ClassGeneral.eq(13).multiply(13).selfMask(),
      '21-G': ClassGeneral.eq(21).multiply(21).selfMask(),
      '25-G': ClassGeneral.eq(25).multiply(25).selfMask(),
      '29-G': ClassGeneral.eq(29).multiply(29).selfMask(),
      '33-G': ClassGeneral.eq(33).multiply(33).selfMask(),
      '34-G': ClassGeneral.eq(34).multiply(34).selfMask(),
      }
      
  var list_integrate = ee.List(param.ReglasIntegracion).reverse().getInfo()
  
  var integracion_v1 = ClassGeneral.multiply(0).add(27);


  list_integrate.forEach(function(clase) {
          integracion_v1 = integracion_v1.blend(ee.Image(assetsClasificaciones[clase[0]+'-'+clase[1]]))
  });
  integracion_v1 = integracion_v1.updateMask(regionsRaster);


//   for (var yearI = 0; yearI < param.years.length; yearI++) {
//     var vis = {
//         'bands': 'classification_'+param.years[yearI],
//         'min': 0,
//         'max': 34,
//         'palette': palettes.get('classification2')
//     };
      
//     Map.addLayer(
//       MosaicoCollection.filterMetadata('year', 'equals', param.years[yearI]).mosaic().updateMask(regionsRaster),
//       {
//         "bands": ["swir1_median","nir_median","red_median"],
//         "min":407,"max":3381
//       },
//       'Mosaic-' + region + '-' + param.years[yearI],
//       false
//     );
    
//   Map.addLayer(
//       ClassGeneral.updateMask(regionsRaster),
//       vis, 'classifGeneral_'+ region + '-' + param.years[yearI]
//     );
    
//   var yearMining = mining30.select('classification_' + param.years[yearI]);
//   var yearFnnfinund = fnnfinund11.select('classification_' + param.years[yearI]);
//   var yearBosqinund = bosqinund6.select('classification_' + param.years[yearI]);
//   var yearMosaictransv = mosaictransv21.select('classification_' + param.years[yearI]);
//   var yearAgua = agua33.select('classification_' + param.years[yearI]);
//   var yearUrbano = urbano24.select('classification_' + param.years[yearI]);
//   var yearGlaciar = Glaciar34.select('classification_' + param.years[yearI]); 
  
//   var listTrans = [[yearMining,'Mineria'], 
//                   [yearFnnfinund,'Fnnfinund'], 
//                   [yearBosqinund,'Bosqinund'],
//                   [yearMosaictransv,'MosaicCultivo'],
//                   [yearAgua,'Agua'], 
//                   [yearUrbano,'Urbano'], 
//                   [yearGlaciar,'Glaciar']];
  
//   listTrans.forEach(function(transv){
//     Map.addLayer(transv[0].updateMask(regionsRaster), vis, transv[1]+  '-' + region + '-' + param.years[yearI],false
//   )
//   });

//   Map.addLayer(
//     integracion_v1,
//     vis, 'integracion' + '-' + region + '-' + param.years[yearI]
//   );

// }

integracion_v1 = integracion_v1.updateMask(regionsRaster)
                              .set('code_region', region[0])
                              .set('pais', param.pais)
                              .set('version', param.version_output)
                              .set('descripcion', 'integracion');
var prefixo_out = param.pais+ '-' + region[0] + '-' + param.version_output;
// print(integracion_v1)

Export.image.toAsset({
    'image': integracion_v1,
    'description': prefixo_out,
    'assetId': dirout+'/'+ prefixo_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': regioV.geometry().bounds(),
    'scale': 30,
    'maxPixels': 1e13
});

integracion_coll = integracion_coll.add(integracion_v1)

})

var integracion_list = ee.ImageCollection(integracion_coll).mosaic()

var listReg = ee.List([]);
var regionsCList = param.code_regions.forEach(function(region) { 
  
  listReg=listReg.add(region[0])
});
print(listReg)

var regionsRasterList = ee.List(listReg).map( function(regionOne){
  var regionR = ee.Image(regionesclassRaster).eq(ee.Number.parse(regionOne)).selfMask(); //ee.Number.parse(
  return regionR;
});

print(regionsRasterList)
regionsRasterList = ee.ImageCollection(regionsRasterList).mosaic()

var integra = ee.ImageCollection(integracion_gener).mosaic();
// var integra = ee.ImageCollection.fromImages(ee.List(integracion_gener)).mosaic();
print(integra, regionsRasterList)

for (var yearI = 0; yearI < param.years.length; yearI++) {
    var vis = {
        'bands': 'classification_'+param.years[yearI],
        'min': 0,
        'max': 34,
        'palette': palettes.get('classification2')
    };
      
    Map.addLayer(
      MosaicoCollection.filterMetadata('year', 'equals', param.years[yearI])
                      .mosaic().updateMask(regionsRasterList),
      {
        "bands": ["swir1_median","nir_median","red_median"],
        "min":407,"max":3381
      },
      'Mosaic' + '-' + param.years[yearI],
      false
    );
  Map.addLayer(
      integra.updateMask(regionsRasterList),
      vis, 'classifGeneral' + '-' + param.years[yearI]
    );
    
  var yearMining = mining30.select('classification_' + param.years[yearI]);
  var yearFnnfinund = fnnfinund11.select('classification_' + param.years[yearI]);
  var yearBosqinund = bosqinund6.select('classification_' + param.years[yearI]);
  var yearMosaictransv = mosaictransv21.select('classification_' + param.years[yearI]);
  var yearMosaictransv18 = mosaictransv18.select('classification_' + param.years[yearI]);
  var yearPastos15 = pastos15.select('classification_' + param.years[yearI]);
  var yearAgua = agua33.select('classification_' + param.years[yearI]);
  var yearUrbano = urbano24.select('classification_' + param.years[yearI]);
  var yearGlaciar = Glaciar34.select('classification_' + param.years[yearI]); 
  
  var listTrans = [[yearMining,'Mineria'], 
                  [yearFnnfinund,'Fnnfinund'], 
                  [yearBosqinund,'Bosqinund'],
                  [yearMosaictransv,'MosaicCultivo21'],
                  [yearMosaictransv18,'Mosaictransv18'],
                  [yearPastos15,'Pastos15'],
                  [yearAgua,'Agua'], 
                  [yearUrbano,'Urbano'], 
                  [yearGlaciar,'Glaciar']];
  
  listTrans.forEach(function(transv){
    Map.addLayer(transv[0].updateMask(regionsRasterList), vis, transv[1] + '-' + param.years[yearI],false
  )
  });

  Map.addLayer(
    integracion_list,
    vis, 'integracion' + '-' + param.years[yearI]
  );

}

