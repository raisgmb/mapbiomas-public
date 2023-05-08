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
    // ID_pais:  [8,7],
    pais: ['PERU','BOLIVIA'],
    years: [2013, 2021],  // Lista de años Solo para visualizacion
    version_output:'1',
    source:'IBC-FAN',
    buffer : false  // true and false
  }; 
     
// CODIGO DE REGION Y VERSION A INTEGRAR
var codesAndVersions = [
  // PERÚ
        [70115,4],
        [70211,4],

  // BOLIVIA
         [20202,4],
         [20101,4],
  
  
  // ECUADOR
  
                   [40101,],
                   [40102,],
                   [40103,],
                   [40104,],
                   [40105,],
                   [40201,],
                   [40202,],
                   [40203,],
                   [40204,],
                   [40205,],
                   [40601,],
                   [40602,]
]  
  
  
  

// Assets
//---------------------------------
// Assets
//---------------------------------
var palettes = require('users/mapbiomas/modules:Palettes.js');

var dirinputClass = 'projects/mapbiomas-raisg/COLECCION4/clasificacion'
var dirinputClassFil = 'projects/mapbiomas-raisg/COLECCION4/clasificacion-ft'

var dirout = 'projects/mapbiomas-raisg/COLECCION4/INTEGRACION'
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

var listcountry = param.pais.map(function(paisn){return NamecountryCase(paisn)})
print(listcountry)

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


var country = ee.FeatureCollection(assetCountries)
                  .filter(ee.Filter.inList('name', listcountry))

// var countryraster = ee.Image(assetCountriesRaster).selfMask();
// var listcountryRaster = ee.Image(0).rename('country');
// param.ID_pais.forEach(function(idp){
//   listcountryRaster = listcountryRaster.where(countryraster.eq(idp),1)
// })
// Map.addLayer(listcountryRaster.selfMask(),{palette:'red'},'listcountryRaster',false)


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

Map.addLayer(regionClas,{},'Region-clas',false)
// Map.addLayer(country, {}, 'country', false);
Map.addLayer(
    country.style({ fillColor: '#ff000000', color: 'red'}),
    {}, 'country ', true
);


var prefixo_out = 'COUNTRY' + '-' + 'CLASES-GENERALES' + '-' + param.version_output
var integracionyear = integracion_v0
                          .set('country', param.pais)
                          .set('theme', 'GENERAL')
                          .set('version', param.version_output)
                          .set('collection', '4.0')
                          .set('source', param.source);

// print(integracionyear);
    
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


