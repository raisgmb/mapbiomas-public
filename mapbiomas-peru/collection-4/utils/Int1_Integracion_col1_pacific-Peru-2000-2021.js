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
    years: [2000,2021],  // Lista de años Solo para visualizacion
    version_output:'1',
    source:'Instituto del Bien Común (IBC)'
     }; 
     
// CODIGO DE REGION Y VERSION A INTEGRAR
var codesAndVersions = [
      // PERÚ
            //Andes reg, v, y0,  y1
                  [70401,3],
                  [70402,3],
                  [70403,3],
                  [70404,3],
                  [70405,2],
                  [70406,3],
                  [70407,3],
                  [70408,3],
            //Costa
                  [70501,3],
                  [70502,3],
                  [70503,3],
                  [70504,3],
                  [70505,2],
                  [70506,2],
                  [70507,2],
                  [70508,2],
                  ]


        
// Assets
//---------------------------------
var palettes = require('users/mapbiomas/modules:Palettes.js');
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
var dirinputClass = paths.classification
var dirinputClassFil = paths.clasificacionFiltros

var dirout = 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION'
var assetCountries = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-4';
var assetCountriesRaster = "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/paises-4";
var regionesclass = paths.regionVector
var regionesclassRaster = paths.regionCRaster
var regionesMosaicRaster = paths.regionMosRaster
var assetmosaics= paths.mosaics_c4
var assetregionVectors= paths.regionVector

// var assetRemapNorte13= "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per-remap-norte-13"
//---------------------------------
print()

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

function addyearmask(image){
        var years = [
            // 1985, 1986, 1987, 1988, 
            // 1989, 1990, 1991, 1992, 
            // 1993, 1994, 1995, 1996, 
            // 1997, 1998, 1999, 
            2000, 
            2001, 2002, 2003, 2004, 
            2005, 2006, 2007, 2008, 
            2009, 2010, 2011, 2012, 
            2013, 2014, 2015, 2016, 
            2017, 2018, 2019, 2020,
            2021
            ];
        // get band names list 
        var bandNames = ee.List(
            years.map(
                function (year) {
                    return 'classification_' + String(year);
                }
            )
        );
        //add mask bands
        // generate a histogram dictionary of [bandNames, image.bandNames()]
            var bandsOccurrence = ee.Dictionary(
                bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
            );
            
            // print(bandsOccurrence);
             
            // insert a masked band 
            var bandsDictionary = bandsOccurrence.map(
                function (key, value) {
                    return ee.Image(
                        ee.Algorithms.If(
                            ee.Number(value).eq(2),
                            image.select([key]).byte(),
                            ee.Image().rename([key]).byte().updateMask(image.select(0))
                        )
                    );
                }
            );
            
            // convert dictionary to image
            var imageAllBands = ee.Image(
                bandNames.iterate(
                    function (band, image) {
                        return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
                    },
                    ee.Image().select()
                )
            );
             
            return imageAllBands
}
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
                .map(addyearmask)
                .map(
                    function (image) {
                        return image.mask(regionsRaster.eq(codeAndVersion[0]));
                    }
                );
              var image = images.mosaic().byte()
              


                
            //print(codeAndVersion[0], codeAndVersion[1])
            return image;
        }
    );
print(collectionsByRegion)
var allRegionsClassification = ee.ImageCollection.fromImages(ee.List(collectionsByRegion));
var integracion_v0 = allRegionsClassification.mosaic().selfMask()
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

Map.addLayer(regionClas,{},'Region Clasificacion',false);


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


