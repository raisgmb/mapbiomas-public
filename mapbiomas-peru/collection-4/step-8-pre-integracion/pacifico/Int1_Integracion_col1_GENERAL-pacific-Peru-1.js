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
    source:'Instituto del Bien Común (IBC)'
     }; 
     
// CODIGO DE REGION Y VERSION A INTEGRAR
var codesAndVersions = [
  // PERÚ
         //Andes
          // [70401,	2],
          // [70402,	2],
          // [70403,	2],
          // [70404,	2],
          // [70405,	2],
          // [70406,	2],
          // [70407,	2],
          // [70408,	2],

         //Costa
          [70501,	10],
          [70502,	10],
          [70503,	10],
          [70504,	10],
          [70505,	10],
          [70506,	10],
          [70507,	10],
          [70508,	10],

];
        
        
// Assets
//---------------------------------
var palettes = require('users/mapbiomas/modules:Palettes.js');
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
var dirinputClass = paths.classification
var dirinputClassFil = paths.clasificacionFiltros

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
var country = ee.FeatureCollection(assetCountries)
                  .filterMetadata('name', 'equals', NamecountryCase(param.pais));
                  
Map.addLayer(country, {}, 'country', false)   

var countryraster = ee.Image(assetCountriesRaster).eq(param.ID_pais).selfMask()

var regionsRaster = ee.Image(regionesclassRaster)
var regionMosaicRaster = ee.Image(regionesMosaicRaster)
//
// Integrate
//
var collection
var collectionsByRegion = codesAndVersions
    .map(
        function (codeAndVersion) {
             if(codeAndVersion[1] === 1 || codeAndVersion[1]=== 3 || codeAndVersion[1]=== 4) {
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

Map.addLayer(MosaicoCollection.filterMetadata('year', 'equals', param.years[yearI]),{
  "bands":["swir1_median","nir_median","red_median"],
  "min":407,"max":3381}, 'Mosaic' + param.years[yearI],false)
Map.addLayer(integracion_v0, vis, 'classification_'+param.years[yearI],false);

}

Map.addLayer(regionClas,{},'Region Clasificacion',false)

var prefixo_out = param.pais + '-' + 'CLASES-GENERALES' + '-' + param.version_output
var integracion_v0 = integracion_v0
                        .set('country', param.pais)
                        .set('theme', 'GENERAL')
                        .set('version', param.version_output)
                        .set('collection', '4.0')
                        .set('source', param.source);

print(integracion_v0);


var prefixo_out = 'Integracion-pacifico-beta-' + param.pais  + '-' + param.version_output

Export.image.toAsset({
    'image':integracion_v0,
    'description': prefixo_out,
    'assetId': dirout+'/' +prefixo_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': country.geometry().bounds(),
    'scale': 30,
    'maxPixels': 1e13
});



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


