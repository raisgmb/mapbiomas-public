/** 
 * STEP 03-2: GENERACION DE MUESTRAS DE ENTRENAMIENTO Y SELECCION DE VARIABLES
 * Enero 2022
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
  gridName: '',
  sampleSize: 2000, //5000
  minSamples: 1000, //1000
  yearsPreview: [2000, 2021],
  variables: [
    // bandas espectrales:
    
    // bandas derivadas del SMA:
    
    // indices:
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

  // Import the directories module 
  var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-bolivia/collection-4/modules/directories.js').paths;

  var assets = {
    grids: paths.grids,
    regions: paths.regionVector,
    //mosaics: paths.mosaics_c3_v2,
    mosaics: paths.mosaics_c4_v1,
    stablePixels:paths.stablePixelsImages,
    classAreas: paths.trainingAreas,
    outputs: paths.trainingSamples
  };
  
  var rgb = ['swir1_median', 'nir_median', 'red_median'];
  var years = param.yearsPreview;
  var grid = param.gridName;
  var regionId = param.regionId;
  
  
  // Obtiene la version de salida en base al ciclo
  var version = getVersion(param.ciclo);
  var vMuestras = version.version_input_muestras;
  var vAreas = version.version_input_areas;
  
  
  // Crear máscara con base en el vector de región y carta
  var region = getRegion(assets.regions, assets.grids, regionId, grid);
  var vector = region.vector;
  
  
  // Importar assets con base en la región
  var mosaicPath = assets.mosaics;
  var mosaic = getMosaic(mosaicPath, regionId, param.variables, grid, vector);


  var country = region.vector.first().get('pais').getInfo().toUpperCase();
  country = country .replace('Ú', 'U').replace(' ', '_');
  var countryRegion = country + '-' + regionId;

  
  var stablePixels = ee.Image(
    assets.stablePixels + 'ME-' + countryRegion + '-' + vMuestras)
    .updateMask(region.rasterMask).rename('reference');


  var classAreas = ee.FeatureCollection(
    assets.classAreas + 'ac-' +countryRegion + '-' + vAreas);
  
  
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
  
  var training = getSamples(stablePixels, mosaic, classIds, pointsPerClass);
  var points = training.points;
  

  // Enviar imagenes al mapa
  var rgbMosaic = getMosaic(mosaicPath, regionId, rgb, grid, vector);
  addLayersToMap(points, stablePixels, rgbMosaic, years, vector);
  
  
  // Exportar assets y estadísticas a GEE y Drive
  if(grid && grid !== '') regionId = regionId + '-' + grid;
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
 * Constantes globales
 */
function ALL_YEARS() {
  return [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
    1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 
    2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
    2018, 2019, 2020, 2021
  ];
}




/**
 * Función para generar region de interés (ROI) con base en
 * las región de clasificación o una grilla millonésima contenida en ella
 */
function getRegion(regionPath, gridPath, regionId, gridName){
  
  var region = ee.FeatureCollection(regionPath)
        .filterMetadata("id_regionC", "equals", regionId);
  
  if(gridName && gridName !== '') {
    var grid = ee.FeatureCollection(gridPath)
      .filterMetadata("name", "equals", gridName)
      .first();
      
    grid = grid.set('pais', region.first().get('pais'));
    
    region = ee.FeatureCollection(ee.Feature(grid));
  }
  
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
function getMosaic(paths, regionId, variables, gridName,regionVector) {
  
  // Importar datos de altitud
  var altitude = ee.Image('JAXA/ALOS/AW3D30_V1_1')
    .select('AVE')
    .rename('altitude');
      
  var slope = ee.Terrain.slope(altitude).int8()
    .rename('slope');
    

  // hand
  var hand30_100 = ee.ImageCollection('users/gena/global-hand/hand-100');
  var srtm = ee.Image("USGS/SRTMGL1_003");
  var hand30_1000 =  ee.Image("users/gena/GlobalHAND/30m/hand-1000");
  var hand90_1000 = ee.Image("users/gena/GlobalHAND/90m-global/hand-1000");
  var hand30_5000 = ee.Image("users/gena/GlobalHAND/30m/hand-5000");
  var fa = ee.Image("users/gena/GlobalHAND/90m-global/fa");
  var jrc = ee.Image("JRC/GSW1_0/GlobalSurfaceWater");
  var HS_fa = ee.Image("WWF/HydroSHEDS/15ACC");
  var HS_fa30 = ee.Image("WWF/HydroSHEDS/30ACC");
  var demUk = ee.Image("users/gena/HAND/test_uk_DSM");
    
  // smoothen HAND a bit, scale varies a little in the tiles
  hand30_100 = hand30_100.mosaic().focal_mean(0.1);
    
  // potential water (valleys)
  var thresholds = [0,1,2,5,10];
  var HANDm = ee.List([]);
  thresholds.map(function(th) {
    var water = hand30_100.lte(th)
      .focal_max(1)
      .focal_mode(2, 'circle', 'pixels', 5).mask(swbdMask);
      
    HANDm = HANDm.add(water.mask(water).set('hand', 'water_HAND_<_' + th + 'm'));
  });
  
  // exclude SWBD water
  var swbd = ee.Image('MODIS/MOD44W/MOD44W_005_2000_02_24').select('water_mask');
  Map.addLayer(swbd, {}, 'swbd mask', false);
  var swbdMask = swbd.unmask().not().focal_median(1);
  
  // water_hand	water (HAND < 5m)
  var HAND_water = ee.ImageCollection(HANDm);
  
  // exports.
  hand30_100  = hand30_100.rename('hand30_100');
  hand30_1000 = hand30_1000.rename('hand30_1000');
  hand30_5000 = hand30_5000.rename('hand30_5000');
  hand90_1000 = hand90_1000.rename('hand90_1000');
  HAND_water  = HAND_water.toBands()
    .rename(['water_HAND_0m', 'water_HAND_1m', 'water_HAND_2m', 'water_HAND_5m', 'water_HAND_10m']);
          
  var Hand_bands =  hand30_100
    .addBands(hand30_1000)
    .addBands(hand30_5000)
    .addBands(hand90_1000)
    .addBands(HAND_water);
                                

  // shademask2
  var shademask2 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v1")
    .rename('shademask2');
  

  // slppost
  var slppost = ee.Image("projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v1")
    .rename('slppost');
  

  
  // Gestionar mosaicos Landsat
  var mosaicRegion = regionId.toString().slice(0, 3);
  if (mosaicRegion ==='211' ){mosaicRegion='210'  }
  var workspace_c3_v2 = ee.ImageCollection(paths);
  
  var joinedMosaics = workspace_c3_v2
    .map(function(image){
      return ee.Image
        .cat(image, altitude, slope, Hand_bands, slppost,shademask2)
        .int();
    });
    
  joinedMosaics = joinedMosaics.filterMetadata('region_code', 'equals', parseInt(mosaicRegion));
  
  // seleccionar variables
  if(variables.length > 0) return joinedMosaics.select(variables);
  
  else return joinedMosaics;

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
function getSamples(stablePixels, mosaic, classIds, pointsPerClass) {
  
  var years = ee.List(ALL_YEARS());
  
  var keys = years.map( function(year) {
    var stringYear = ee.String(year);
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
    
    var training = stablePixels
      .addBands(yearMosaic)
      .sampleRegions({
        collection: points,
        properties: ['reference'],
        scale: 30,
        geometries: true
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
  
  var years = ALL_YEARS();
  
  years.forEach( function(year) {
  
    var sampleYear = samples.get('samples-' + year),
        yearInt = parseInt(year, 10);
    
    var collection = ee.FeatureCollection(sampleYear)
      .map( function(feature) {
        return feature.set('year', yearInt);
      });

    // Exportar muestras
    var filename = 'samples-' + country + '-' + regionId + '-' + 
      year + '-'+ 'p032'+'-'+version;
    
    Export.table.toAsset(
      collection,
      filename,
      outputDir + filename
    );
      
  });
}
