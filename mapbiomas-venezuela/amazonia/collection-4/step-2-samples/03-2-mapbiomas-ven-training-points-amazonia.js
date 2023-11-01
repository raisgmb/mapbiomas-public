/** 
 * STEP 03-2: GENERACION DE MUESTRAS DE ENTRENAMIENTO Y SELECCION DE VARIABLES
 * SEPTIEMBRE 2020
 * DOCUMENTACIÓN: https://docs.google.com/document/d/1V1_kj6idnTzLslsXFC11EbU-qGcwhsHBWQTgRLR9QEw/edit?userstoinvite=sig2%40provitaonline.org&ts=5f7333f7&actionButton=1#heading=h.vae2491gsdj6
 * ----------------------------------------------------------------------------------------------
 */

 
 
/** 
 * ----------------------------------------------------------------------------------------------
 * PARAMETROS DE USUARIO:
 * Ajuste los parámetros a continuacón para generar sus muestras de entrenamiento 
 * No se recomienda modificar el script en ninguna otra sección.
 * ----------------------------------------------------------------------------------------------
 */
var param = {
  country: 'VENEZUELA',
  regionId: 90222,
  sampleSize: 50000,
  minSamples: 10000,
  yearsPreview: [2000, 2018],
  variables: [
    // bandas espectrales:
    
    // bandas derivadas del SMA:
    
    // indices:
  ],
  years: [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
    1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 
    2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
    2018, 2019, 2020, 2021
  ],
  ciclo: 'ciclo-1'
};






/**
 * ----------------------------------------------------------------------------------------------
 * INICIALIZACIÓN DE LA APLICACIÓN
 * Self invoked expresion que ejecuta el paso 3 de la metodología
 * ----------------------------------------------------------------------------------------------
 */

(function init(param) {

  // Import Modules CollectionDirectories
  var paths = require('users/Mosaico_Clasification/global-modules:mapbiomas/directories').paths;

  
  var assets = {
    outputs: paths.trainingSamples
  };
  
  
  var years = param.years;
  var regionId = param.regionId;
  var yearsPreview = param.yearsPreview;
  
  
  // Obtiene la version de salida en base al ciclo
  var version = getVersion(param.ciclo);
  var vMuestras = version.version_input_muestras;
  var vAreas = version.version_input_areas;
  
  
  // Crear máscara con base en el vector de región y carta
  var region = getRegion(paths.regionVector, regionId);
  var vector = region.vector;
  
  
  // Importar assets con base en la región
  var mosaicPath = paths.mosaics;
  var rgb = ['swir1_median', 'nir_median', 'red_median'];
  var assetsMosaics = mosaicPath + 'mosaics-2';
  var mosaic = getMosaic(assetsMosaics, regionId, param.variables);


  var country = param.country;
  var countryRegion = country + '-' + regionId;

  var stableNames = 'ME-' + countryRegion + '-' + vMuestras;
  var stablePixels = ee.Image(paths.stablePixelsPath + stableNames)
    .updateMask(region.rasterMask)
    .rename('reference');


  var classAreas = ee.FeatureCollection(paths.trainingAreas + 'ac-' + countryRegion + '-' + vAreas);
  
  
  var classAreasDictionary = classAreas.first().toDictionary();
  

  var classNames = classAreasDictionary.keys()
    .filter(ee.Filter.stringContains('item', 'ID'));
  

  // Generar muestras de entrenamiento con base en el área de cada clase de cobertura
  var classIds = classNames.map(
    function(name) {
      var classId = ee.String(name).split('D').get(1);
      return ee.Number.parse(classId);
    }
  );
  

  // Calcular áreas de cada clase y total 
  var areas = classNames.map( function(name) {
    return classAreasDictionary.get(name);
  });
  
  var totalArea = areas.reduce(ee.Reducer.sum());


  // Calcular numero ponderado de muestras y generar puntos de entrenamiento
  var pointsPerClass = areas.map(
    function(area) {
      return getPointsByArea(
        area, totalArea, param.sampleSize, param.minSamples);
    });
  
  var training = getSamples(stablePixels, years, mosaic, classIds, pointsPerClass);
  var points = training.points;
  

  // Enviar imagenes al mapa
  var rgbMosaic = getMosaic(assetsMosaics, regionId, rgb);
  addLayersToMap(points, stablePixels, rgbMosaic, yearsPreview, vector);
  
  
  // Exportar assets y estadísticas a GEE y Drive
  var outputs = assets.outputs;
  var data = training.data;
  exportSamples(data, outputs, country, regionId, version.version_out);
    

  // Mostrar información en consola
  var zipped = classNames.zip(areas).zip(pointsPerClass);

  zipped = zipped.map(function(item){
    item = ee.List(item);
    var item0 = ee.List(item.get(0));
    var id = ee.String(item0.get(0)).replace('ID', 'Clase '); 
    var area = ee.String(item0.get(1));
    var points = ee.String(item.get(1));
    
    return ee.String(id)
      .cat(', Area: ').cat(area)
      .cat(', Muestras: ').cat(points);
  });
  
  zipped = zipped.filter(ee.Filter.stringContains('item', ': 0.0,').not());
  
  
  var samples = zipped.map(function(item){
    var points = ee.String(item).split('Muestras: ');
    points = ee.List(points).get(1);
    return ee.Number.parse(points);
  });
  
  var global = ee.Dictionary.fromLists(
    ['Area total', 'Muestras totales: '],
    [totalArea, samples.reduce(ee.Reducer.sum())]
  );
  
  print('Pixeles estables', stablePixels);
  print('Mosaicos', mosaic);
  print('Áreas', classAreas.first());
  print('Estadísticas generales', global);
  print('Estadísticas por clase', zipped);
      
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
      version_input_areas: 1,
      version_input_muestras: 1,
      version_out:1
    },
    'ciclo-2': {
      // Ciclo II
      version_input_areas: 2,
      version_input_muestras: 2,
      version_out:2
    }
  };
  
  return version[cicle];
}



/**
 * Función para generar region de interés (ROI) con base en
 * las región de clasificación o una grilla millonésima contenida en ella
 */
function getRegion(regionPath, regionId){
  
  var region = ee.FeatureCollection(regionPath)
        .filterMetadata("id_regionC", "equals", regionId);
  
  // Generar el raster
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
 * Función para filtrar mosaicos
 * Permite filtrar los mosaicos por codigo de región y grilla 250.000,
 * También gestiona la selección de índices que serán utilizados para generar los
 * puntos de entrenamiento.
 */
function getMosaic(path, regionId, variables) {
  
  var mosaicRegion = regionId.toString().slice(0, 3);
  
  var mosaics = ee.ImageCollection(path)
    .filter(
      ee.Filter.eq('region_code', mosaicRegion)
    );

  return variables.length > 0 ? mosaics.select(variables) : mosaics;
  
}
 


/**
 * Función para calcular numero de muestras de entrenamiento con base en el área
 * que ocupa cada clase
 */
function getPointsByArea(singleArea, totalArea, sampleSize, minSamples) {
  return ee.Number(singleArea)
    .divide(totalArea)
    .multiply(sampleSize)
    .round()
    .int16()
    .max(minSamples);
}



/**
 * Función para implementar la colecta de puntos todos los años de la lista param.year
 * definida en los parámetros de usuario.
 */
function getSamples(stablePixels, years, mosaic, classIds, pointsPerClass) {
  
  years = ee.List(years);
  
  var keys = years.map( function(year) {
    var numericYear = ee.Number(year);
    var stringYear  = ee.String(numericYear.toInt16());
    return ee.String('samples-').cat(stringYear);
  });
  
  var points = stablePixels
    .addBands(ee.Image.pixelLonLat())
    .stratifiedSample({
        numPoints: 0,
        classBand: 'reference',
        region: stablePixels.geometry(),
        scale: 30,
        seed: 1,
        geometries: true,
        dropNulls: true,
        classValues: classIds, 
        classPoints: pointsPerClass
    });

  var yearMosaic;
  
  var trainingSamples = years.map( function(year) {
    yearMosaic = mosaic
      .filterMetadata('year', 'equals', year)
      .mosaic();
    
    var refferenceImage = stablePixels.addBands(yearMosaic);

    var training = points.map(function(feature) {
      return feature
        .set(
          refferenceImage.reduceRegion({
            reducer: 'mean',
            geometry: feature.geometry(),
          })
        )
        .set('year', year);
    });

    return training;
    
  });
  
  return {
    data: ee.Dictionary.fromLists(keys, trainingSamples),
    points: points
  };

}


/**
 * Función para enviar visualización al mapa
 * 
 */
function addLayersToMap(training, stablePixels, mosaic, years, region) {
  
  // var trainingYear = ee.FeatureCollection(training.get('SAMPLES-' + year));
  var PALETTE = [
    'ffffff', '129912', '1f4423', '006400', '00ff00', '687537', '76a5af',
    '29eee4', '77a605', '935132', 'bbfcac', '45c2a5', 'b8af4f', 'f1c232', 
    'ffffb2', 'ffd966', 'f6b26b', 'f99f40', 'e974ed', 'd5a6bd', 'c27ba0',
    'fff3bf', 'ea9999', 'dd7e6b', 'aa0000', 'ff99ff', '0000ff', 'd5d5e5',
    'dd497f', 'b2ae7c', 'af2a2a', '8a2be2', '968c46', '0000ff', '4fd3ff'
  ];

  years.forEach(function(year) {
    var filtered = mosaic.filterMetadata('year', 'equals', year)
      .mosaic()
      .clip(region);
      
    Map.addLayer(
      filtered,
      {
        bands: ['swir1_median', 'nir_median', 'red_median'],
        gain: [0.08, 0.06, 0.2]
      },
      'MOSAICO ' + year.toString(), false
    );
  });


  var styledPoints = ee.FeatureCollection(training).map(
    function(point) {
      var classId = point.get('reference'),
          color = ee.List(PALETTE).get(classId);
      
      return point.set({ style: { color: color } });
    }
  );
  
  Map.addLayer(stablePixels, {
    min: 0,
    max: 34,
    palette: PALETTE
  }, 'PIXELES ESTABLES');


  Map.addLayer(
    region.style({
      fillColor: '00000066'
    }), {}, 'REGION');
  
  Map.addLayer(
    styledPoints.style({
      styleProperty: "style",
      width: 1.5,
    }), {}, 'MUESTRAS DE ENTRENAMIENTO'
  );


}


/**
 * Función para exportar las muestras de entrenamiento como assets de GEE
 */
function exportSamples(samples, outputDir, country, regionId, version) {
  
  var years = ee.List(
    [
      1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
      1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 
      2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
      2018, 2019, 2020, 2021
    ]
  );
  
  years.getInfo().forEach( function(year) {
  
    var sampleYear = samples.get('samples-' + year),
        yearInt = parseInt(year, 10);
    
    var collection = ee.FeatureCollection(sampleYear)
      .map( function(feature) {
        return feature.set('year', yearInt);
      });
      
    if(year === 2000) print(collection.size());

    // Exportar muestras
    var filename = 'samples-' + country + '-' + regionId + '-' + 
      year + '-'+ 'p03'+'-'+version;
    
    Export.table.toAsset(
      collection,
      filename,
      outputDir + filename
    );
      
  });
}
