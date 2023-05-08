/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var EJEMPLO1 = 
    /* color: #d63000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-74.64943331013512, -11.47930434061534],
                  [-74.52583711872887, -11.447002798997197],
                  [-74.59999483357262, -11.4173898125842],
                  [-74.65217989216637, -11.39585115315023]]]),
            {
              "original": "3,",
              "new": "27,",
              "system:index": "0"
            })]),
    EJEMPLO2 = 
    /* color: #c50bd6 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-74.21944379273087, -4.824889198982332],
                  [-74.14253949585587, -4.813941713623335],
                  [-74.18373822632462, -4.745515954670814]]]),
            {
              "original": "3,22,6,",
              "new": "27,27,34,",
              "system:index": "0"
            })]),
    Remap_to_27 = 
    /* color: #d60000 */
    /* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-81.00182912792283, -4.051924877138448],
                  [-80.99732301677781, -4.050169744198993],
                  [-80.9920444294365, -4.045974532970865],
                  [-80.99791152868349, -4.047001933648801],
                  [-80.99786861333925, -4.046488233472747],
                  [-80.99632366094667, -4.045375215306946],
                  [-80.98988635931093, -4.043534451138764],
                  [-80.98847015295107, -4.042721088895421],
                  [-80.99370582494814, -4.041308405164891],
                  [-80.99812610540468, -4.04267828033369],
                  [-81.00173099432071, -4.045632065788624],
                  [-81.00542171392519, -4.048328990928611],
                  [-81.00649459753114, -4.051796452906144]]]),
            {
              "original": "4,13,",
              "new": "13,27,",
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

/** 
 * STEP 05-0: CÁLCULO DE PIXELES ESTABLES Y AREAS DE EXCLUSIÓN v3.2 
 * SEPTIEMBRE 2020 
 * MARZO 2021
 * DOCUMENTACIÓN:
 * ----------------------------------------------------------------------------------------------
 */ 

 
 
/** 
 * PARAMETROS DE USUARIO:
 * Ajuste los parámetros a continuacón para generar la imagen de pixeles estables correspondiente
 * CUIDADO: considere que el proceso de exclusión con polígonos o shapes ocurré LUEGO
 * del remap y puede afectar el resultado generado por este último si los polígonos de
 * exclusión y las clases remapeadas se solapan.
 * ----------------------------------------------------------------------------------------------
 */
var param = {
  regionId: 70501,
  yearsPreview: [2000, 2005, 2010, 2015, 2021 ],
  remap: {
    from: [3, 4, 5, 6, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34],
    to:   [3, 4, 5, 6, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34]
  },
  exclusion : {
    years: [
      //1987, 1989
    ],
    classes: [],
    polygons: [ EJEMPLO1, EJEMPLO2, Remap_to_27],
    shape: '',
  },
  canopy_height:{ // Para Limpiar muestras estables basado en canopy_height
    useCanopy_height: false,
    canopy_height_thrClass3: 10,  // threshold mask meters with Global Canopy Height 2020  clase 3 
      },
  driveFolder: 'DRIVE-EXPORT',
  ciclo: 'ciclo-2',
};




/**
 * IMPLEMETACIÓN DE LA APLICACIÓN
 * Self invoked expresion que ejecuta el paso 2 de la metodología
 * ----------------------------------------------------------------------------------------------
 */
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;

(function init(param) {
  
  var assets = {
    basePath: paths.muestrasestables,
    regions: paths.regionVectorBuffer,
    // regionsRaster:  paths.regionCRaster,
    mosaicsc4: paths.mosaics_c4,
    // mosaics_per: paths.mosaics_per,
    clasificacionBase: 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/INTEGRACION/Integracion-pacifico-beta-PERU-1',
    canopy_height :'users/nlang/ETH_GlobalCanopyHeight_2020_10m_v1'
  };
  
  
  // Obtener la version de salida en base al ciclo
  // var versionInput = getVersion(param.ciclo)[0];
  var versionOuput = getVersion(param.ciclo)[1];
  
  // Crear máscara con base en el vector de región
  var regionId = param.regionId;
  var region = getRegion(assets.regions, '', regionId);
  
  var regionMask = region.rasterMask;
    
    
  var country = region.vector.first().get('pais').getInfo().toUpperCase();
  country = country .replace('Ú', 'U').replace(' ', '_');
  var countryRegion = country + '-' + regionId;


  // Exclusión de áreas
  var shapePath = assets.basePath + country + '/';
  var shapeName = param.exclusion.shape;
  var fullRegion = excludeAreas(regionMask, shapePath, shapeName);
  
  
  // Extraer la classificación, ignorando años con inconsistencias.
  var image = ee.Image(assets.clasificacionBase)
                .updateMask(fullRegion);
              
  // var palette = require('users/mapbiomas/modules:Palettes.js')
  //                     .get('classification2');
  // Map.addLayer(image,
  //         {
  //           bands: 'classification_2020',
  //           min: 0, max: 34,
  //           palette: palette
  //         },
  //         'classification_2020_nnn'
  //       )
  
  image = selectBands(image, param.exclusion.years);
  print('Años usados', image.bandNames());

  
  // Remapeo de clases
  var originalClasses = param.remap.from;
  var newClasses = param.remap.to;
  image = remapBands(image, originalClasses, newClasses);
  
  image = applyGapFill(image)
  // Generar pixeles estables
  var classes = ee.List.sequence(1, 34);
  classes = classes.removeAll(param.exclusion.classes).getInfo();
  var stablePixels = getStablePixels(image, classes);
  
  if(param.canopy_height.useCanopy_height){
  // Canopy height forest
  var canopy_height = ee.Image(assets.canopy_height);
  var canopy_height_forest3 = canopy_height.lte(param.canopy_height.canopy_height_thrClass3);

  stablePixels = stablePixels.where(stablePixels.eq(3).and(canopy_height_forest3.eq(1)), 0).selfMask()
  }

  // Exclusión de clases en areas delimitadas con geometrías
  var polygons = param.exclusion.polygons;
  stablePixels = remapWithPolygons(stablePixels, polygons);
  

  // Importar mosaicos para visualización
  var assetsMosaics = assets.mosaicsc4;
  var variables = ['nir_median', 'swir1_median', 'red_median'];
  var mosaics = getMosaic(assetsMosaics, param.regionId, variables, '');
    

  // Mostrar imagenes en el mapa
  var assetData = {
    clasific: image,
    region: region,
    years: param.yearsPreview    
  };
  
  addLayersToMap(stablePixels, mosaics, assetData);

  if(param.canopy_height.useCanopy_height){
    Map.addLayer(canopy_height.updateMask(regionMask),{"min":1,"max":35,
                               "palette":["ff0000","ff9e0f","fcff0c","4fff13","08cc16"]}, 'canopy_height', true
                               )
  }
  // Exportar assets a GEE y Google Drive
  var imageName = 'ME-'+ countryRegion + '-' + versionOuput;
  var assetId = assets.basePath + 'muestras-estables/' + imageName;
  var driveFolder = param.driveFolder;
  var vector = region.vector;

  var props = {
    code_region: param.regionId,
    pais: country,
    version: versionOuput.toString(),
    paso: 'P05'
  };

  stablePixels = stablePixels.set(props);
  exportImage(stablePixels, imageName, assetId, vector, driveFolder);
  
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
  var version_input = {
    'ciclo-1': 2,
    'ciclo-2': 9
  };
  var version_ouput = {
    'ciclo-1': 2,
    'ciclo-2': 3
  };
  return [version_input[cicle],version_ouput[cicle]];
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
 * Función para delimitar áreas de excusión en las que no se tomarán 
 * muestra de entrenamiento. 
 * Estas áreas pueden incluirse como polígonos desde las herramientas de 
 * dibujo o como una colección de tipo ee.FeatureCollection() ubicada en la ruta
 * establecida en el parámetro exclusion.shape.
 */
function excludeAreas(image, shapePath, shapeName) {
  var exclusionRegions;
  
  var shapes = shapePath !== '' && shapeName !== '';
    
  if(shapes)
    exclusionRegions = ee.FeatureCollection(shapePath + shapeName);
  
  else exclusionRegions = null;

  
  // Excluir todas las areas definidas
  if(exclusionRegions !== null) {
    var setVersion = function(item) { return item.set('version', 1) };
  
    exclusionRegions = exclusionRegions
      .map(setVersion)
      .reduceToImage(['version'], ee.Reducer.first())
      .eq(1);
    
    return image.where(exclusionRegions.eq(1), 0)
      .selfMask();
  } 
  else return image;
}
    



/**
 * Función para remapear, de manera interactiva, zonas delimitadas por polígonos
 * Estos polígonos se dibujan con las herramientas de dibujo de GEE
 * y se definen como ee.FeatureCollection()
 */
function remapWithPolygons(stablePixels, polygons) {
  
  if(polygons.length > 0) {
    polygons.forEach(function( polygon ) {
      
      var excluded = polygon.map(function( layer ){
        
        var area = stablePixels.clip( layer );
        var from = ee.String(layer.get('original')).split(',');
        var to = ee.String(layer.get('new')).split(',');
        
        from = from.map( function( item ){
          return ee.Number.parse( item );
        });
        to = to.map(function(item){
          return ee.Number.parse( item );
        });
        
        return area.remap(from, to);
      });
        
      excluded = ee.ImageCollection( excluded ).mosaic();
      stablePixels = excluded.unmask( stablePixels ).rename('reference');
      stablePixels = stablePixels.mask( stablePixels.neq(27) );
    });
  } else stablePixels = stablePixels;
  
  return stablePixels;
  
}




/**
 * Función para seleccionar las bandas con base en los años definidos en
 * los parámetros
 */
function selectBands(image, years) {
  var bandNames = [];
  
  years.forEach(function(year) {
    bandNames.push('classification_' + year);
  });
  
  return ee.Image(
    ee.Algorithms.If(
      years.length === 0, 
      image, 
      image.select(image.bandNames().removeAll(bandNames))
    )  
  );
}




/**
 * Función para generar region de interés (ROI) con base en
 * las región de clasificación o una grilla millonésima contenida en ella
 */
function getRegion(regionPath, regionImagePath, regionId){
  
  var region = ee.FeatureCollection(regionPath)
    .filterMetadata("id_regionC", "equals", regionId);
  
  //var regionMask = ee.Image(regionImagePath).eq(regionId).selfMask();
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
function getMosaic(paths, regionId, variables, gridName) {
  
  // Importar datos de altitud
  var altitude = ee.Image('JAXA/ALOS/AW3D30_V1_1')
    .select('AVE')
    .rename('altitude');
      
  var slope = ee.Terrain.slope(altitude).int8()
    .rename('slope');
  
  // Gestionar mosaicos Landsat
  var mosaicRegion = regionId.toString().slice(0, 3);
  
  var workspace_c4 = ee.ImageCollection(paths)
                       .filter(ee.Filter.eq('region_code', Number(mosaicRegion)));
  // var workspace_per = ee.ImageCollection(paths[1])
  var joinedMosaics = workspace_c4//.merge(workspace_per);
  
  if(gridName && gridName !== ''){
      joinedMosaics = joinedMosaics
        .filterMetadata('grid_name', 'equals', gridName);
  } else {
      joinedMosaics = joinedMosaics;
  }

  // seleccionar variables
  if(variables.length > 0) return joinedMosaics.select(variables);
  
  else return joinedMosaics;


}




/**
 * Función para extracción de pixeles estables
 * Esta función toma dos parámetros. La imagen de la clasificación y las clases que
 * se quieren obtener como salida
 */
function getStablePixels(image, classes) {
  
  var bandNames = image.bandNames(),
      images = [];

  classes.forEach(function(classId){
      var previousBand = image
        .select([bandNames.get(0)]).eq(classId);
          
      var singleClass = ee.Image(
        bandNames.slice(1)
          .iterate(
            function( bandName, previousBand ) {
              bandName = ee.String( bandName );
              return image
                .select(bandName).eq(classId)
                .multiply(previousBand);
            },
            previousBand
          )
      );
      
      singleClass = singleClass
        .updateMask(singleClass.eq(1))
        .multiply(classId);
      
      images.push(singleClass);
  });
  
  
  // blend all images
  var allStable = ee.Image();
  
  for(var i = 0; i < classes.length; i++) 
    allStable = allStable.blend(images[i]);

  return allStable;
} 




/**
 * Función para graficar resultados en el mapa
 */
function addLayersToMap(stablePixels, mosaics, originalImage) {
  
  var palette = require('users/mapbiomas/modules:Palettes.js')
    .get('classification2');
    
  var region = originalImage.region;
    
  var image = ee.Image(originalImage.clasific)
                 .updateMask(region.rasterMask);
    
  var bands;
  
  if(originalImage.years.length === 0) {
    bands = image.bandNames();
  } 
  else {
    bands = ee.List([]);
    originalImage.years.forEach(function(year){
      bands = bands.add('classification_' + year.toString());
    });
  }
  
  bands.evaluate(function(bandnames){

    bandnames.forEach(function(bandname){
     
      // Mosaicos
      var year = parseInt(bandname.split('_')[1], 10);
      
      var mosaic = mosaics.filterMetadata('year', 'equals', year)
        .mosaic()
        .updateMask(region.rasterMask);
        
      Map.addLayer(
        mosaic,
        {
          bands: ['swir1_median', 'nir_median', 'red_median'],
          // min:100,
          // max:4000
          gain: [0.08, 0.06, 0.2]
        },
        'MOSAICO ' + year.toString(), false
      );
      if(Number(year) > 2013){
        // Clasificaciones
        Map.addLayer(
          image,
          {
            bands: bandname,
            min: 0, max: 34,
            palette: palette
          },
          bandname.toUpperCase().replace('TION_', 'CION ')
        )
       }
      
    });
    
    
    // Región
    Map.addLayer(region.vector.style({
      fillColor: '00000066', color: 'FCBA03'
    }), {}, 'REGION ' + param.regionId);
    
    
    // Pixeles estables
    Map.addLayer(
      stablePixels,
      {
        min: 0,
        max: 34,
        palette: palette
      },
      'PIXELES ESTABLES'
    );

  });
}




/**
 * Funciones para exportar resultados a GEE y Drive
 */
function exportImage(image, imageName, imageId, region, driveFolder) {
  print(image)
  Export.image.toAsset({
    image: image.toInt8(),
    description: imageName,
    assetId: imageId,
    scale: 30,
    pyramidingPolicy: {
      '.default': 'mode'
    },
    maxPixels: 1e13,
    region: region.geometry().bounds()
  });
  
  if(driveFolder !== '' && driveFolder !== undefined) {
    Export.image.toDrive({
      image: image.toInt8(),
      description: imageName + '-DRIVE',
      folder: driveFolder,
      scale: 30,
      maxPixels: 1e13,
      region: region.geometry().bounds()
    });
  }
}


/**
 * User defined functions  applyGapFill
 */
function applyGapFill(image) {
    var bandNames = image.bandNames();
    // apply the gap fill form t0 until tn
    var imageFilledt0tn = bandNames.slice(1)
        .iterate(
            function (bandName, previousImage) {

                var currentImage = image.select(ee.String(bandName));

                previousImage = ee.Image(previousImage);

                currentImage = currentImage.unmask(
                    previousImage.select([0]));

                return currentImage.addBands(previousImage);

            }, ee.Image(image.select([bandNames.get(0)]))
        );

    imageFilledt0tn = ee.Image(imageFilledt0tn);

    // apply the gap fill form tn until t0
    var bandNamesReversed = bandNames.reverse();

    var imageFilledtnt0 = bandNamesReversed.slice(1)
        .iterate(
            function (bandName, previousImage) {

                var currentImage = imageFilledt0tn.select(ee.String(bandName));

                previousImage = ee.Image(previousImage);

                currentImage = currentImage.unmask(
                    previousImage.select(previousImage.bandNames().length().subtract(1)));

                return previousImage.addBands(currentImage);

            }, ee.Image(imageFilledt0tn.select([bandNamesReversed.get(0)]))
        );


    imageFilledtnt0 = ee.Image(imageFilledtnt0).select(bandNames);

    return imageFilledtnt0;
}