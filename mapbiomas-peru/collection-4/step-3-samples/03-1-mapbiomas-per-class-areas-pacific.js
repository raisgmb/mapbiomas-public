/** 
 * STEP 03-1: CÁLCULO DE AREAS PARA SORTEAR MUESTRAS DE NTRENAMIENTO 
 * by: Ajust 14/10/2021 EYTC
 *           08/03/2022 EYTC: Ajuste a periodo 2000-2021
 * DOCUMENTACIÓN: 
 * ----------------------------------------------------------------------------------------------
 */

 
 
/** 
 * PARAMETROS DE USUARIO:
 * Ajuste los parámetros a continuacón para generar la imagen de pixeles estables correspondiente
 * ----------------------------------------------------------------------------------------------
 */
var param = {
  pais : 'PERU',
  regionId: 70501,
  referenceLayer: 'MINAM_AJUST',   // Indicar la capa de referencia 'MINAM', 'MINAM_AJUST', 'DEMER', 'COL3_RAISG'
  referenceYear: 2018, // se considera solo para referenceLayer: 'DEMER' y 'COL3_RAISG'
  remap: { // indicar el mismo remap del paso 02
    from: [3, 4, 5, 6, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34],
    to:   [3, 4, 5, 3, 9, 11, 12, 13, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 33, 29, 22, 33, 32, 33, 34]
  },
  driveFolder: 'PACIFICO-EXPORT',
  ciclo: 'ciclo-1'
};



/**
 * ----------------------------------------------------------------------------------------------
 * INICIALIZACIÓN DE LA APLICACIÓN
 * Self invoked expresion que ejecuta el paso 3 de la metodología
 * ----------------------------------------------------------------------------------------------
 */
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;

(function init(param) {
  
  var assets = {
    basePath: 'projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/',
    regions: paths.regionVectorBuffer,
    // regionsRaster: paths.regionCRaster,
    Class_DEMERN:  paths.classification_DEMERN,
    Class_MINAM:   paths.CobVeg_MINAM,
    stablePixels:  paths.muestrasestablesRaster,
    midagri2020: paths.midagri2020,
    bosqueseco2018_SERFOR: paths.bosqueseco2018_SERFOR,
    cofopri2015:paths.cofopri2015,
    collection3:{
      clasificacion:  paths.collection3,
      regions_RAISG:  paths.regionVector_RAISG,
      regionsRaster_RAISG:paths.regionCRaster_RAISG,
    }
  };
  
  var regionId= param.regionId
  var version = getVersion(param.ciclo);
  
  // var regionMask   = ee.Image(assets.regionsRaster).eq(regionId).selfMask()
  // var regionVector = ee.FeatureCollection(assets.regions)
  //                     .filterMetadata("id_regionC", "equals", regionId);
  var regionG = getRegion(assets.regions, '', regionId);
  var regionMask = regionG.rasterMask;
  var regionVector = regionG.vector;
  
  //--- Si se ejecuta en una region RAISG                      
  if(param.referenceLayer === 'COL3_RAISG'){
      regionMask   = ee.Image(assets.collection3.regionsRaster_RAISG).eq(regionId).selfMask()
      regionVector = ee.FeatureCollection(assets.collection3.regions_RAISG)
                      .filterMetadata("id_regionC", "equals", regionId);
  }
    
  var region = {
      vector: regionVector,
      rasterMask: regionMask
      }
  var rasterMask = region.rasterMask
  
  var country = param.pais;
  var baseName = country + '-' + param.regionId + '-' + 
        version.inputVPixelesEstables.toString();
  
  var classes = ee.List.sequence(1, 34).getInfo();
  
  var reference, updtReference;
    // Remapeo de clases
  var originalClasses = param.remap.from;
  var newClasses = param.remap.to;
  
  if(param.referenceLayer === 'MINAM'){
    // Seleccion de año para balanceo 
    reference = ee.Image(assets.Class_MINAM)
                 .updateMask(rasterMask).toUint8()
                 .rename('classification_2013');
    print('reference MINAM',reference)
    updtReference = remapBands(reference, originalClasses, newClasses);
    
  } else if (param.referenceLayer === 'DEMER') {
    // Seleccion de año para balanceo 
    reference = ee.Image(assets.Class_DEMERN)
                  .select('classification_' + param.referenceYear.toString())
                  .updateMask(rasterMask);
    print('reference DEMER',reference)            
    updtReference = remapBands(reference, originalClasses, newClasses);
  } else if (param.referenceLayer === 'MINAM_AJUST') {
    
        //Clasificacion MINAM
        var CobV_MINAM = ee.Image(assets.Class_MINAM).updateMask(rasterMask);
            CobV_MINAM = CobV_MINAM.remap(originalClasses, newClasses)
        
        //Clasificacion midagri2020
        var Midagri2020 = ee.Image(assets.midagri2020).updateMask(rasterMask);
            Midagri2020 = Midagri2020.eq(1).multiply(21).selfMask()
            
        //Clasificacion bosqueseco2018_SERFOR
        var bosqueseco2018_SERFOR = ee.Image(assets.bosqueseco2018_SERFOR).updateMask(rasterMask);
            bosqueseco2018_SERFOR = bosqueseco2018_SERFOR.remap([1,2,3,4,5], [0,4,21,25,3]).selfMask()
       
        // cofopri2015
        var cofopri2015 = ee.Image(assets.cofopri2015).multiply(25).updateMask(rasterMask)
        
        var CobV_MINAMidagriSerfor = CobV_MINAM.where(Midagri2020.eq(21),21)
                                               .where(bosqueseco2018_SERFOR.eq(4),4)
                                               .where(bosqueseco2018_SERFOR.eq(3),3)
                                               .where(cofopri2015.eq(25),22)
                                               .rename('classification_2013');
        // Seleccion de año para balanceo 
        print('CobV_MINAMidagriSerfor',CobV_MINAMidagriSerfor)    
        updtReference = remapBands(CobV_MINAMidagriSerfor, originalClasses, newClasses);

    
  } else if (param.referenceLayer === 'COL3_RAISG') {
    // Seleccion de año para balanceo 
    reference = ee.Image(assets.collection3.clasificacion)
                  .select('classification_' + param.referenceYear.toString())
                  .updateMask(rasterMask);
    print('reference DEMER',reference)            
    updtReference = remapBands(reference, originalClasses, newClasses);
  }
  else{
    updtReference = ee.Image(assets.stablePixels + 'ME-' + baseName);
  }
  
  updtReference = updtReference.updateMask(updtReference.neq(27))
  
  var areas = getAreas(updtReference, classes, region.vector);
  
  print('Capa de áreas por clase', areas);


  // Mortrar capa de referencia en el mapa
  Map.addLayer(updtReference, {
    min: 0,
    max: 34,
    palette: [
      'ffffff', '129912', '1f4423', '006400', '00ff00', '687537', '76a5af',
      '29eee4', '77a605', '935132', 'bbfcac', '45c2a5', 'b8af4f', 'f1c232', 
      'ffffb2', 'ffd966', 'f6b26b', 'f99f40', 'e974ed', 'd5a6bd', 'c27ba0',
      'fff3bf', 'ea9999', 'dd7e6b', 'aa0000', 'ff99ff', '0000ff', 'd5d5e5',
      'dd497f', 'b2ae7c', 'af2a2a', '8a2be2', '968c46', '0000ff', '4fd3ff'
    ]
  },'Layer Reference');
  
  

  // Exportar estadísticas a Google Drive
  var tableName = 'ac-'+ country + '-' + param.regionId + '-' + 
    version.outputVCalcArea.toString();
    
  var outputPath = assets.basePath + 'AREAS_CLASE_REGION/';

  print('Ubicación de salida', outputPath);
  
  print('Archivo salida', tableName);
  
  exportFeatures(
    areas, 
    tableName, 
    outputPath + tableName,
    param.driveFolder
  );

})(param);





/**
 * FUNCIONALIDADES
 * A continuación se definen las funcionalidades que se usan en la aplicación.
 * Estas features se inyectan en la función init() que las ejecuta y genera los
 * resultados.
 * ----------------------------------------------------------------------------------------------
 */
 
/**
 * Funcion para asignar una versión por ciclo
 * 
 */
function getVersion(cicle) { 
  var version = {
    'ciclo-1': {
      // Ciclo I
      inputVPixelesEstables: 1,
      outputVCalcArea: 1,
    },
    'ciclo-2': {
      // Ciclo II
      inputVPixelesEstables: 2,
      outputVCalcArea: 2
    }
  };
  
  return version[cicle];
}


/**
 * Función para remapear (reclasificar) cabdas clasifiacadas
 * En el orden de ejecución, esta función corre antes del remapeo con polígonos
 */
function remapBands(image, originalClasses, newClasses) {
  var bandNames = image.bandNames().getInfo();
  var collectionList = ee.List([]);
  
  bandNames.forEach(
    function( bandName ) {
      var remapped = image.select(bandName)
        .remap(originalClasses, newClasses);
    
      collectionList = collectionList.add(remapped.int8().rename(bandName));
    }
  );
  var collectionRemap = ee.ImageCollection(collectionList);
  image = collectionRemap.toBands();
  

  
  var actualBandNames = image.bandNames();
  var singleClass = actualBandNames.slice(1)
    .iterate(
      function( bandName, previousBand ) {
        bandName = ee.String(bandName);
                
        previousBand = ee.Image(previousBand);

        return previousBand.addBands(image
          .select(bandName)
          .rename(ee.String('classification_')
          .cat(bandName.split('_').get(2))));
      },
      ee.Image(image.select([actualBandNames.get(0)])
          .rename(ee.String('classification_')
          .cat(ee.String(actualBandNames.get(0)).split('_').get(2))))
    );
  return ee.Image(singleClass);
}



/**
 * Función para calcular áreas (en Km2) por clase, con base en la imágen
 * de pixeles estables.
 */
function getAreas(image, classes, region){
  
  var reducer = {
      reducer: ee.Reducer.sum(),
      geometry: region.geometry(), 
      scale: 30,
      maxPixels: 1e13
  };
  
  var propFilter = ee.Filter.neq('item', 'OBJECTID');
  
  classes.forEach( function( classId, i ) {
      var imageArea = ee.Image.pixelArea()
        .divide(1e6) // para km2
        .mask(image.eq(classId))
        .reduceRegion(reducer);
      
      var area = ee.Number(imageArea.get('area')).round();
          
      region = region.map(function(item){
        var props = item.propertyNames();
        var selectProperties = props.filter(propFilter);
        
        return item
          .select(selectProperties)
          .set('ID' + classId.toString(), area);
      });
      
      return region;
  });
  
  return region;
  
}




/**
 * Función para generar region de interés (ROI) con base en
 * las región de clasificación o una grilla millonésima contenida en ella
 */
function getRegion(regionPath, regionImagePath, regionId){
  
  var region = ee.FeatureCollection(regionPath)
    .filterMetadata("id_regionC", "equals", regionId);
  
  // var regionMask = ee.Image(regionImagePath).eq(regionId).selfMask();
  var setVersion = function(item) { return item.set('version', 1) };
  var regionMask = region
    .map(setVersion)
    .reduceToImage(['version'], ee.Reducer.first());
    
  return {
    vector: region,
    rasterMask: regionMask
  };

}



/**
 * Función para exportar las áreas calculadas como assets de GEE
 */
function exportFeatures(features, tableName, tableId, driveFolder) {
  
  Export.table.toAsset({
    collection: features, 
    description: tableName,
    assetId: tableId,
  });
  
  var featuresTable = ee.FeatureCollection([
    ee.Feature(null, features.first().toDictionary())
  ]);
  
  if(driveFolder !== '' && driveFolder) {
    Export.table.toDrive({
      collection: featuresTable, 
      description: tableName + '-DRIVE',
      folder: driveFolder,
      fileFormat: 'CSV',
    });
  }
}
