/** 
 * CALCULO DE ESTADÍSTICAS, CLASIFICACIONES COLECCION 3 
 * ENERO 2021
 * DOCUMENTACIÓN:
 * ----------------------------------------------------------------------------------------------
 */

 
 
/** 
 * PARAMETROS DE USUARIO:
 * - regionId
 * - asset: imagen de entrada a la que se le calcularán las estadísticas. Recibe las opciones 
 *      'CLASIFICACION', 'GAPFILL', 'FILTRO_ESPACIAL', 'FILTRO_TEMPORAL' o 'FILTRO_FRECUENCIAS'.
 * - driveFolder: nombre de la carpeta de drive donde se almacenarán los archivos de salida.
 * - years: años de la serie que serán considerados. 
 *      Si no hay dato en alguno, la consola enviará un mensaje en rojo notificando dicha ausencia.
 *      Esos mensajes están relacionados con la visualización. Las estadísticas no son afectadas. 
 * ----------------------------------------------------------------------------------------------
 */
var param = {
  regionId: 70102,
  version: '7',
  paso :  'filtros',   //clasificacion, filtros
  driveFolder: 'RAISG-EXPORT',
  years: [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
    1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 
    2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
    2018, 2019, 2020, 2021
  ]
};



/**
 * ----------------------------------------------------------------------------------------------
 * INICIALIZACIÓN DE LA APLICACIÓN
 * ----------------------------------------------------------------------------------------------
 */
 
var assets = {
  regions: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
  mosaics: 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2',
  mapbiomas: 'projects/mapbiomas-raisg/public/collection3/mapbiomas_raisg_panamazonia_collection3_integration_v2',
  classification: 'projects/mapbiomas-raisg/COLECCION4/clasificacion/',
  classification_ft: 'projects/mapbiomas-raisg/COLECCION4/clasificacion-ft/'
};



//params
var regionId = param.regionId;
var driveFolder = param.driveFolder;
var years = param.years;
var assetName = 'Area_por_regionC';


// Crear máscara con base en el vector de región y carta
var region = getRegion(assets.regions, regionId);
var country = region.vector.first().get('pais').getInfo().toUpperCase()
country = country.replace('Ú', 'U').replace(' ', '_');
var fullRegion = country + '-' + regionId;
Map.addLayer(region.vector,{},'region')


// Detectar etapa del procesamiento
var imageC;
if (param.paso == 'clasificacion' ){
  imageC = assets.classification + fullRegion + '-'+param.version;
} else if (param.paso == 'filtros' ){
  imageC = assets.classification_ft + fullRegion + '-'+param.version;
}

// Importar y filtrar mosaicos 
var mosaicRegion = regionId.toString().slice(0, 3);
var mosaics = ee.ImageCollection(assets.mosaics)
    .filterMetadata('region_code', 'equals', Number(mosaicRegion));


// Importar clasificación preliminar y coleccion 2
var collection4 = ee.Image(imageC);
print('El asset es: ',collection4.get('descripcion'))
var collection3 = ee.Image(assets.mapbiomas).updateMask(region.rasterMask);



// Generar estadísticas de cobertura
getAreas(collection4, collection3, region.vector, regionId + '-ESTADISTICAS');



// Mostrar datos en el mapa
var palette = require('users/mapbiomas/modules:Palettes.js');
palette = palette.get('classification2');

years.forEach(function(year) {
  var filtered = mosaics.filterMetadata('year', 'equals', year)
    .mosaic()
    .updateMask(region.rasterMask);

  var yearImage = collection4.select('classification_' + year);

  
  Map.addLayer(filtered,
    {
      bands: ['swir1_median', 'nir_median', 'red_median'],
      gain: [0.08, 0.06, 0.2]
    },
    'MOSAICO ' + year, false
  );


  if(year < 2021) {
    var yearReferenceImage = collection3.select('classification_' + year);

    Map.addLayer(yearReferenceImage,
      {
        min: 0,
        max: 34,
        palette: palette
      },
      'CLASIFICACION C3 ' + year, false
    );      
  }
  
  
  Map.addLayer(yearImage,
    {
      min: 0,
      max: 34,
      palette: palette
    },
    'CLASIFICACION C4 ' + year.toString(), false
  );
});




/**
 * ----------------------------------------------------------------------------------------------
 * FUNCIONALIDADES
 * A continuación se definen las funcionalidades que se usan en la aplicación.
 * ----------------------------------------------------------------------------------------------
 */




// Función para asignar una versión arbitraria
function setVersion(item) { return item.set('version', 1) }



// Función para generar region de interés (ROI) con base en
function getRegion(regionPath, regionId){
  
  var region = ee.FeatureCollection(regionPath)
        .filterMetadata("id_regionC", "equals", regionId);
  
  var regionMask = region
    .map(setVersion)
    .reduceToImage(['version'], ee.Reducer.first());
    
  return {
    vector: region,
    rasterMask: regionMask
  };

}



// Función para generar las estadísticas de cobertura por año y clase
function getAreas(image, reference, region, description) {

  var pixelArea = ee.Image.pixelArea();
  
  var reducer = {
    reducer: ee.Reducer.sum(),
    geometry: region.geometry(),
    scale: 30,
    maxPixels: 1e13
  };
  
  
  var classIds = ee.List.sequence(0, 34);
  
  var bandNames = image.bandNames();
  
  
  bandNames.evaluate( function(bands, error) {
    
    if(error) print(error.message);
    
    var yearsAreas = [], referenceAreas = [];
    
  
    bands.forEach(function(band) {
    
      var year = ee.String(band).split('_').get(1);
      var yearImage = image.select([band]);
      var coverReference;
      
      if(reference) {
        if(band !== 'classification_2021') {
          var referenceImage = reference.select([band]);
        }
      }
  
      
      // Calcular áreas para cada clase cobertura
      var covers = classIds.map(function(classId) {
  
        classId = ee.Number(classId).int8();
        var yearCoverImage = yearImage.eq(classId);
        var coverArea = yearCoverImage.multiply(pixelArea).divide(1e6);
      
        return coverArea.reduceRegion(reducer).get(band);
  
      }).add(year);
      
      
      // Calcular áreas para cara clase en la imagen de referencia
      if(reference) {
        if( band !== 'classification_2021') {
          coverReference = classIds.map(function(classId) {
            
            classId = ee.Number(classId).int8();
            var yearCoverReference = referenceImage.where(yearImage.eq(27), 27);
            yearCoverReference = yearCoverReference.eq(classId);
  
            var coverReferenceArea = yearCoverReference
              .multiply(pixelArea).divide(1e6);
              
            return coverReferenceArea.reduceRegion(reducer).get(band);
            
          }).add(year);
        }
      }
      
  
    
      // Generar la lista de keys para el diccionario
      var keys = classIds.map(function(item) {
  
        item = ee.Number(item).int8();
        
        var stringItem = ee.String(item);
        
        stringItem = ee.Algorithms.If(
          item.lt(10),
          ee.String('ID0').cat(stringItem),
          ee.String('ID').cat(stringItem)
        );
        
        return ee.String(stringItem);
        
      }).add('year');
  
      
      // Crear la lista de features para cada año, sin geometrías
      var dict = ee.Dictionary.fromLists(keys, covers);
      yearsAreas.push( ee.Feature(null, dict) );


      if(reference) {
        if(band !== 'classification_2021') {
          var referenceDict = ee.Dictionary.fromLists(keys, coverReference);
          referenceAreas.push( ee.Feature(null, referenceDict) );
        }
      }
      
    });
    
    
    yearsAreas = ee.FeatureCollection(yearsAreas);
    referenceAreas = ee.FeatureCollection(referenceAreas);
  
    
    Export.table.toDrive({
      collection: yearsAreas,
      description: "C4-" + assetName + '-' + description,
      fileFormat: 'CSV',
      folder: driveFolder
    });

    if(reference) {
      Export.table.toDrive({
        collection: referenceAreas,
        description: "C3-" + assetName + '-' + description,
        fileFormat: 'CSV',
        folder: driveFolder
      });
    }
      
  });
  
}
