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

/** Clasificacion General
 *  by: EYTC 
 */
 
var param = {
    ID_pais: 8,
    pais: 'PERU',
    years: [2013, 2021],  // Lista de años Solo para visualizacion
    version_output:'4',
    source:'Instituto del Bien Común (IBC)',
    buffer : false  // true and false
     }; 
     
// CODIGO DE REGION Y VERSION A INTEGRAR
var codesAndVersions = [
  // PERÚ
    // Amazonia
      [70101,	10],
      [70102,	8],
      [70103,	7],
      [70104,	7],
      [70105,	9],
      [70106,	11],
      [70107,	8],
      [70108,	9],
      [70109,	7],
      [70110,	8],
      [70111,	11],
      [70112,	7],
      [70113,	6],
      [70114,	6],
      [70115,	7],
      [70201,	11],
      [70202,	8],
      [70203,	8],
      [70204,	6],
      [70205,	8],
      [70206,	10],
      [70207,	5],
      [70208,	7],
      [70209,	7],
      [70210,	8],
      [70211,	7],
      [70212,	6],
    //Andes
      [70301,	33],
      [70302,	33],
      [70303,	33],
      [70304,	34],
      [70305,	24],
      [70306,	9],
      [70307,	9],
      [70308,	10],
      [70309,	10],
      [70310,	21],
      [70311,	21],
      [70312,	21],
      [70313,	22],
      [70314,	5],
  
  ];
        
        
// Assets
//---------------------------------
var palettes = require('users/mapbiomas/modules:Palettes.js');
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
var palettes = require('users/mapbiomas/modules:Palettes.js');

var dirinputClass = 'projects/mapbiomas-raisg/COLECCION4/clasificacion'
var dirinputClassFil = 'projects/mapbiomas-raisg/COLECCION4/clasificacion-ft'

var dirout = 'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/clasificacion'
var assetCountries = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-4';
var assetCountriesRaster = "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/paises-4";
var regionesclassRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4'
var regionesMosaicRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-mosaicos-4'
var assetmosaicVectors= 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-mosaicos-4'
var assetregionVectors= 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4'
var assetregionVectorsBuff= 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-buffer-250m'

var assetMosaic = "projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2";
var assetMosaicP2 = "projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-pathrow-2";
var regionMosaicRaster  = ee.Image(regionesMosaicRaster).rename(['regions'])



/**
  * Get mosaics
  * Get mosaics from collection2 asset col4 mapbiomas Amaz. Then compute
  * wetlands indexes remaining.
  */
var getMosaic = function(paths, regionRaster, Listyears) {
  
      // Mosaic
      regionRaster = regionRaster.where(regionRaster.eq(211),210)
      regionRaster = regionRaster.where(regionRaster.eq(205),210)
      var Mosaic_coll = ee.ImageCollection(paths[0]).merge(ee.ImageCollection(paths[1]))
                                                    .filter(ee.Filter.inList('year',Listyears))
                        // .filterMetadata('country', 'equals', param.pais)
                        // .select(['swir1_median', 'nir_median', 'red_median'])
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

var mosaicsRAISG = getMosaic([assetMosaic,assetMosaicP2], regionMosaicRaster, param.years);


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

var regionsRaster,regionClas;
if(param.buffer){
    regionClas = ee.FeatureCollection(assetregionVectorsBuff);

    regionsRaster = ee.Image().uint32().paint({
                    featureCollection: regionClas,
                    color: 'id_regionC'
                    }).rename(['regions']);

} else {
    regionClas = ee.FeatureCollection(assetregionVectors);
    regionsRaster = ee.Image(regionesclassRaster);
}


// var regionsRaster = ee.Image().uint32().paint({
//                     featureCollection: regionClas,
//                     color: 'id_regionC'
//                     }).rename(['regions']);

// var regionMosaicRaster = ee.Image().uint32().paint({
//                     featureCollection: regionClas,
//                     color: 'id_region'
//                     }).rename(['regions']);

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
              // print(images)
            return images.mosaic().byte();
        }
    );

var allRegionsClassification = ee.ImageCollection.fromImages(ee.List(collectionsByRegion));
var integracion_v0 = allRegionsClassification.min()
// integracion_v0 = integracion_v0.where(remapNorte13.eq(1).and(integracion_v0.eq(21)), 13)

// Layer add

for (var yearI=0;yearI<param.years.length;yearI++) {
  var vis = {
      'bands': 'classification_'+param.years[yearI],
      'min': 0,
      'max': 34,
      'palette': palettes.get('classification2')
  };
  
  var mosaicYear = mosaicsRAISG
                    .filterMetadata('year', 'equals', param.years[yearI])
                    .mosaic();
  
  Map.addLayer(mosaicYear,{
          "bands":["swir1_median","nir_median","red_median"],
          // "min":407,"max":3381,
          'gain': [0.08, 0.06, 0.08],
          'gamma': 0.65
  }, 'Mosaic' + param.years[yearI],false);
  
  Map.addLayer(integracion_v0, vis, 'classification_'+param.years[yearI],false);

}

Map.addLayer(regionClas,{},'Region Clasificacion',false)

for(var year=1985; year<=2021;year++){
  var prefixo_out = param.pais + '-' + year + '-' + param.version_output
  var integracionyear = integracion_v0.select('classification_'+year)
                          .rename('classification')
                          .set('country', param.pais)
                          .set('theme', 'GENERAL')
                          .set('year', year)
                          .set('version', param.version_output)
                          .set('collection', '4.0')
                          .set('source', param.source);

      print(year, integracionyear);
    
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
}




  // var prefixo_out = param.pais + '-' + 'CLASES-GENERALES' + '-' + param.version_output
  // var integracionyear = integracion_v0
  //                         .set('country', param.pais)
  //                         .set('theme', 'GENERAL')
  //                         .set('version', param.version_output)
  //                         .set('collection', '4.0')
  //                         .set('source', param.source);

  //     print(integracionyear);
    
  //   Export.image.toAsset({
  //       'image':integracionyear,
  //       'description': prefixo_out,
  //       'assetId': dirout+'/' +prefixo_out,
  //       'pyramidingPolicy': {
  //           '.default': 'mode'
  //       },
  //       'region': country.geometry().bounds(),
  //       'scale': 30,
  //       'maxPixels': 1e13
  //   });


