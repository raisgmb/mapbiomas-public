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
        [[[-82.42318642949738, 12.323167215605771],
          [-82.42318642949738, -22.99448787353485],
          [-44.30062783574738, -22.99448787353485],
          [-44.30062783574738, 12.323167215605771]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/** 
 *  by: EYTC
 */
 
var param = {
    ID_pais: 8,
    pais: 'PERU',
    years: [2013, 2021],  // Lista de años Solo para visualizacion
    version_output:'1',
    source:'Instituto del Bien Común (IBC)',
    mosaicV: 'Amazon' ///'Amazon', 'Andes' // Visualizacion de mosaicos para andes o Amazonia, solo con fines de visualizacion
     }; 
     
// CODIGO DE REGION Y VERSION A INTEGRAR
var codesAndVersions = [
  // PERÚ
        // [70101,1],
        // [70102,1],
        // [70103,1],
        // [70104,1],
        // [70105,1],
        // [70106,1],
        // [70107,1],
        // [70108,1],
        // [70109,1],
        // [70110,1],
        // [70111,1],
        // [70112,1],
        // [70113,1],
        // [70114,1],
        // [70115,1],
        // [70201,1],
        // [70202,1],
        // [70203,1],
        // [70204,1],
        // [70205,1],
        // [70206,1],
        // [70207,1],
        // [70208,1],
        // [70209,1],
        // [70210,1],
        // [70211,1],
        // [70212,1],
        // [70301,1],
        // [70302,1],
        // [70303,1],
         [70304,1],
        // [70305,1],
        // [70306,1],
        // [70307,1],
        // [70308,1],
         [70309,1],
        // [70310,1],
        // [70311,1],
        // [70312,1],
        // [70313,1],

];
        
        
// Assets
//---------------------------------
var palettes = require('users/mapbiomas/modules:Palettes.js');
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
var dirinputClass = paths.classificationRaisg
var dirinputClassFil = paths.clasificacionFiltrosRaisg

var dirout = 'projects/mapbiomas-raisg/COLECCION4/INTEGRACION'
var assetCountries = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-4';
var assetCountriesRaster = "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/paises-4";
var regionesclass = paths.regionVector
var regionesclassRaster = paths.regionCRaster
var regionesMosaicRaster = paths.regionMosRaster
var assetmosaics= paths.mosaics_c4
var assetregionVectors= paths.regionVector

// var assetRemapNorte13= "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per-remap-norte-13"
//---------------------------------

// var collection = ee.ImageCollection(dirinputClass);
// var remapNorte13 = ee.Image(assetRemapNorte13)
//
// convert vector to raster
//

function NamecountryCase (name){
          var paisLowerCase =''
          switch (name) {
            case "PERU":
                paisLowerCase = 'Perú';
                break;
            case "GUIANA_FRANCESA":
                paisLowerCase = 'Guiana Francesa';
                break;
            case "VENEZUELA":
                paisLowerCase = 'Venezuela';
                break;
            case "GUYANA":
                paisLowerCase = 'Guyana';
                break;
            case "COLOMBIA":
                paisLowerCase = 'Colombia';
                break;
            case "BRASIL":
                paisLowerCase = 'Brasil';
                break;
            case "ECUADOR":
                paisLowerCase = 'Ecuador';
                break;
            case "SURINAME":
                paisLowerCase = 'Suriname';
                break;
            case "BOLIVIA":
                paisLowerCase = 'Bolivia'
            }
  return paisLowerCase
}
var regionClas = ee.FeatureCollection(assetregionVectors);

var regionsRaster = ee.Image().uint32().paint({
                    featureCollection: regionClas,
                    color: 'id_regionC'
                    }).rename(['regions']);

var regionMosaicRaster = ee.Image().uint32().paint({
                    featureCollection: regionClas,
                    color: 'id_region'
                    }).rename(['regions']);

var country = ee.FeatureCollection(assetCountries)
                  .filterMetadata('name', 'equals', NamecountryCase(param.pais));
                  
Map.addLayer(country, {}, 'country', false)   

var countryraster = ee.Image(assetCountriesRaster).eq(param.ID_pais).selfMask()

// var regionsRaster = ee.Image(regionesclassRaster)
// var regionMosaicRaster = ee.Image(regionesMosaicRaster)
//
// Integrate
//
var collection
var collectionsByRegion = codesAndVersions
    .map(
        function (codeAndVersion) {
             if(codeAndVersion[1] === 1 || codeAndVersion[1]=== 3) {
               collection = ee.ImageCollection(dirinputClass)

             } else {
               collection = ee.ImageCollection(dirinputClassFil)
             }
             
            var images = collection
                .filterMetadata('code_region', 'equals', codeAndVersion[0])
                .filterMetadata('version', 'equals', codeAndVersion[1])
                .map(
                    function (image) {
                        return image.mask(regionsRaster.eq(codeAndVersion[0]));
                    }
                );
                            //print(codeAndVersion[0], codeAndVersion[1])
              print(images)
            return images.mosaic().byte();
        }
    );

var allRegionsClassification = ee.ImageCollection.fromImages(ee.List(collectionsByRegion));
var integracion_v0 = allRegionsClassification.min()
// integracion_v0 = integracion_v0.where(remapNorte13.eq(1).and(integracion_v0.eq(21)), 13)

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

// Layer add

for (var yearI=0;yearI<param.years.length;yearI++) {
var vis = {
    'bands': 'classification_'+param.years[yearI],
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};


if(param.mosaicV == 'Amazon'){
  Map.addLayer(MosaicoCollection.filterMetadata('year', 'equals', param.years[yearI]),{
  "bands":["swir1_median","nir_median","red_median"],
  'gain': [0.08, 0.06, 0.08],
  'gamma': 0.65}, 'Mosaic' + param.years[yearI],false)
} else {
  Map.addLayer(MosaicoCollection.filterMetadata('year', 'equals', param.years[yearI]),{
  "bands":["swir1_median","nir_median","red_median"],
  "min":407,"max":3381}, 'Mosaic' + param.years[yearI],false)
}
Map.addLayer(integracion_v0, vis, 'classification_'+param.years[yearI],false);

}

Map.addLayer(regionClas,{},'Region Clasificacion',false)

// for(var year=2013; year<=2020;year++){
//   var prefixo_out = param.pais + '-' + year + '-' + param.version_output
//   var integracionyear = integracion_v0.select('classification_'+year)
//                           .rename('classification')
//                           .set('country', param.pais)
//                           .set('theme', 'GENERAL')
//                           .set('year', year)
//                           .set('version', param.version_output)
//                           .set('collection', '3.0')
//                           .set('source', param.source);

//       print(year, integracionyear);
    
//     Export.image.toAsset({
//         'image':integracionyear,
//         'description': prefixo_out,
//         'assetId': dirout+'/' +prefixo_out,
//         'pyramidingPolicy': {
//             '.default': 'mode'
//         },
//         'region': country.geometry().bounds(),
//         'scale': 30,
//         'maxPixels': 1e13
//     });
// }




  var prefixo_out = param.pais + '-' + 'CLASES-GENERALES' + '-' + param.version_output
  var integracionyear = integracion_v0
                          .set('country', param.pais)
                          .set('theme', 'GENERAL')
                          .set('version', param.version_output)
                          .set('collection', '4.0')
                          .set('source', param.source);

      print(integracionyear);
    
    Export.image.toAsset({
        'image':integracionyear,
        'description': prefixo_out,
        'assetId': dirout+'/' +prefixo_out,
        'pyramidingPolicy': {
            '.default': 'mode'
        },
        'region': country.geometry().bounds(),
        'scale': 30,
        'maxPixels': 1e13
    });


