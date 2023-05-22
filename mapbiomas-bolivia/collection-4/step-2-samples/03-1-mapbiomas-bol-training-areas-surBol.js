/** 
 * PASO 3: CÁLCULO DE AREAS PARA SORTEAR MUESTRAS DE NTRENAMIENTO 
 * SEPTIEMBRE 2020
 * DOCUMENTACIÓN: 
 * ----------------------------------------------------------------------------------------------
 */

 
 
/** 
 * PARAMETROS DE USUARIO:
 * Ajuste los parámetros a continuacón para generar la imagen de pixeles estables correspondiente
 * ----------------------------------------------------------------------------------------------
 */
/*--------------------------------
--- regiones de clasificación
Amazonia alta1	20101
Amazonia alta2	20102
Amazonia alta3	20103
Amazonia baja Norte	20201
Amazonia baja Oeste1	20202
Amazonia baja Oeste2	20203
Amazonia baja Oeste3	20204
Amazonia baja Este1	20205
Amazonia baja Este2	20207
Amazonia baja Llano1	20208
Amazonia baja Llano2	20209
Amazonia baja Llano3	20210
Andes1	20601
Andes2	20602
Andes3	20603
Chiquitano1	21001
Chiquitano2	21002
Chiquitano3	21003
Chaco1	21004
Chaco2	21005
Tucumano-Boliviano	21201
*/ 
var param = {
  regionId: 20602,
  referenceYear: '',   // year or ''  
  remap: {
    from: [3, 4, 5, 6, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34],
    to:   [3, 4, 5, 6, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34]
  },
  driveFolder: 'RAISG-EXPORT',
  ciclo: 'ciclo-1'
};



/**
 * ----------------------------------------------------------------------------------------------
 * INICIALIZACIÓN DE LA APLICACIÓN
 * Self invoked expresion que ejecuta el paso 3 de la metodología
 * ----------------------------------------------------------------------------------------------
 */
(function init(param) {
  

  // require modules
  var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-bolivia/collection-4/modules/directories.js').paths;
  
  var assets = {
    trainingAreas: paths.trainingAreas,
    regions: paths.regionVector,
    referenceImage: paths.collection3,
    stablePixels: paths.stablePixelsImages
  };

  
  var version = getVersion(param.ciclo);
  
  var region = getRegion(assets.regions, assets.regionsRaster, param.regionId);
  var rasterMask = region.rasterMask;

  var country = region.vector.first().get('pais').getInfo().toUpperCase()
      .replace('Ú', 'U')
      .replace(' ', '_');
      
  var baseName = country + '-' + param.regionId + '-' + 
        version.inputVPixelesEstables.toString();
  
  var classes = ee.List.sequence(1, 34).getInfo();
  
  var reference, updtReference;
  
  if(param.referenceYear){
    // Seleccion de año para balanceo 
    reference = ee.Image(assets.referenceImage)
      .select('classification_' + param.referenceYear.toString())
      .updateMask(rasterMask);

    // Remapeo de clases
    var originalClasses = param.remap.from;
    var newClasses = param.remap.to;
    updtReference = remapBands(reference, originalClasses, newClasses);
  }
  else{
    updtReference = ee.Image(assets.stablePixels + 'ME-' + baseName);
  }
  
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
  });
  
  

  // Exportar estadísticas a Google Drive
  var tableName = 'ac-'+ country + '-' + param.regionId + '-' + 
    version.outputVCalcArea.toString();

  print('Ubicación de salida', assets.trainingAreas);
  
  print('Archivo salida', tableName);
  
  exportFeatures(
    areas, 
    tableName, 
    assets.trainingAreas + tableName,
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
        .divide(1e6)
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
