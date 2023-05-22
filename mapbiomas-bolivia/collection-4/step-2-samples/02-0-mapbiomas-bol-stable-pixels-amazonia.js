/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var exclusion_30203_1 = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-68.42970717504, 3.2388939895940463],
                  [-68.38574332470961, 3.0797760772362697],
                  [-68.18242304551431, 3.074288576977067],
                  [-68.18242149211123, 3.1840282735559673]]]),
            {
              "original": "12,33",
              "new": "11,6",
              "system:index": "0"
            })]),
    exclusion_30203_2 = /* color: #b3d63a */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-67.63214821780117, 3.2801844400311544],
                  [-67.52777810061367, 3.351476016991634],
                  [-67.52228493655117, 3.4145373163835573],
                  [-67.62940163576992, 3.466628313286214],
                  [-67.69531960451992, 3.403570429199645]]]),
            {
              "original": 3,
              "new": 22,
              "system:index": "0"
            })]),
    natural85 = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-72.9492984498548, 1.3870262403744262],
                  [-72.85995709481223, 1.2871978852341732],
                  [-72.85448946112233, 1.4004904032670882],
                  [-72.90016089419018, 1.4810818055466632],
                  [-72.95488757913702, 1.4504102926008062]]]),
            {
              "original": "3,",
              "new": "27,",
              "system:index": "0"
            })]),
    natural86 = /* color: #d3d61e */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-72.6015930097592, 0.7628486134522041],
                  [-72.55506274602544, 0.710850720954746],
                  [-72.52495374712512, 0.7737962776458036],
                  [-72.56601137113799, 0.8422231864313645]]]),
            {
              "original": "3,22,6",
              "new": "27,27,34",
              "system:index": "0"
            })]),
    natural87 = /* color: #ce4fd6 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-72.77564096034547, 0.03563795132153733],
                  [-72.74353976885796, -0.03844642745395407],
                  [-72.68638393494506, -0.05673041522862724],
                  [-72.68051493177904, 0.022008125926914934],
                  [-72.68076980187752, 0.06278792537377105],
                  [-72.75616615539194, 0.09643344866762885]]]),
            {
              "original": "3,21,11,",
              "new": "27,27,27,",
              "system:index": "0"
            })]),
    geometry = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-72.70839599093749, 1.1066443437813365],
                  [-72.65158979339591, 1.177355946121187],
                  [-72.69323049257046, 1.2062343838539091],
                  [-72.72613946588147, 1.268702434866981],
                  [-72.76711725451588, 1.2136296102556714],
                  [-72.79187320751477, 1.1320713821241175]]]),
            {
              "original": "3,33,",
              "new": "27,27,",
              "system:index": "0"
            })]),
    Urbano = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-67.97933459334497, -16.538430995962344],
                  [-67.97887325339441, -16.53913037289702],
                  [-67.97758579306726, -16.53921265236973],
                  [-67.97708153777246, -16.538821824561865],
                  [-67.97747850470667, -16.53783446657368],
                  [-67.97888398223047, -16.538060736558887]]]),
            {
              "original": "24,",
              "new": "0,",
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-67.97689397947195, -16.540576613293613],
                  [-67.97590692655447, -16.54103943140184],
                  [-67.9747052969158, -16.540946867869014],
                  [-67.97427614347342, -16.540504619265874],
                  [-67.97532756940726, -16.53903387824769],
                  [-67.97635753766897, -16.539064733069512],
                  [-67.9770656408489, -16.5401240789587]]]),
            {
              "original": "24,",
              "new": "0,",
              "system:index": "1"
            })]),
    Exclusion = /* color: #98ff00 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-67.97655582480554, -16.53855441560561],
                  [-67.975558043052, -16.538821824561865],
                  [-67.97461390547876, -16.537906461597746],
                  [-67.97538638167505, -16.537608196323145],
                  [-67.97625541739588, -16.537885891593607]]]),
            {
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/


/** 
 * PASO 2: CÁLCULO DE PIXELES ESTABLES Y AREAS DE EXCLUSIÓN v3.2 
 * DICIEMBRE 2021
 * DOCUMENTACIÓN:
 * ----------------------------------------------------------------------------------------------
 */ 
/**
 * 

 
/** 
 * PARAMETROS DE USUARIO:
 * Ajuste los parámetros a continuacón para generar la imagen de pixeles estables correspondiente
 * CUIDADO: considere que el proceso de exclusión con polígonos o shapes ocurré LUEGO
 * del remap y puede afectar el resultado generado por este último si los polígonos de
 * exclusión y las clases remapeadas se solapan.
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
  regionId: 21101,
  yearsPreview: [ 1986,1990,2000, 2018 , 2020],
  remap: {
    from: [3, 4, 5, 6, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34],
    to:   [3, 4, 5, 6, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34]
  },
  exclusion : {
    years: [
      //1987, 1989 // Se puede utilizar un año en particular
    ],
    classes: [ ],
    polygons: [ 
     //natural85, natural86, natural87, geometry
     Urbano
    ],
    shape: '',
  },
  driveFolder: 'DRIVE-EXPORT',
  ciclo: 'ciclo-1'
};




/**
 * IMPLEMETACIÓN DE LA APLICACIÓN
 * Self invoked expresion que ejecuta el paso 2 de la metodología
 * ----------------------------------------------------------------------------------------------
 */
(function init(param) {
  
  // require modules
  var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-bolivia/collection-4/modules/directories.js').paths;

  var assets = {
    basePath: paths.muestrasestables,
    regions: paths.regionVector,
    regionsRaster:  paths.regionCRaster,
    //mosaics: paths.mosaics_c3_v2,
    mosaics: paths.mosaics_c4_v1,
    image: paths.collection3,
  };
  
  
  // Obtener la version de salida en base al ciclo
  var version = getVersion(param.ciclo);

  
  // Crear máscara con base en el vector de región
  var regionId = param.regionId;
  var region = getRegion(assets.regions, assets.regionsRaster, regionId);
  var regionMask = region.rasterMask;
    
    
  var country = region.vector.first().get('pais').getInfo().toUpperCase();
  country = country .replace('Ú', 'U').replace(' ', '_');
  var countryRegion = country + '-' + regionId;


  // Exclusión de áreas
  var shapePath = assets.basePath + country + '/';
  var shapeName = param.exclusion.shape;
  var fullRegion = excludeAreas(regionMask, shapePath, shapeName);
  
  
  // Extraer la classificación, ignorando años con inconsistencias.
  var image = ee.Image(assets.image).updateMask(fullRegion);
  image = selectBands(image, param.exclusion.years);
  print('Años usados', image.bandNames());

  
  // Remapeo de clases
  var originalClasses = param.remap.from;
  var newClasses = param.remap.to;
  image = remapBands(image, originalClasses, newClasses);
  

  // Generar pixeles estables
  var classes = ee.List.sequence(1, 34);
  classes = classes.removeAll(param.exclusion.classes).getInfo();
  var stablePixels = getStablePixels(image, classes);
  

  // Exclusión de clases en areas delimitadas con geometrías
  var polygons = param.exclusion.polygons;
  stablePixels = remapWithPolygons(stablePixels, polygons);
  
  
  // Importar mosaicos para visualización
  var assetsMosaics = [ assets.mosaics ];
  var variables = ['nir_median', 'swir1_median', 'red_median'];
  var mosaics = getMosaic(assetsMosaics, param.regionId, variables, '');
    

  // Mostrar imagenes en el mapa
  var assetData = {
    asset: assets.image,
    region: region,
    years: param.yearsPreview    
  };
  
  addLayersToMap(stablePixels, mosaics, assetData);


  // Exportar assets a GEE y Google Drive
  var imageName = 'ME-'+ countryRegion + '-' + version;
  var assetId = assets.basePath + 'muestras-estables/' + imageName;
  var driveFolder = param.driveFolder;
  var vector = region.vector;

  var props = {
    code_region: param.regionId,
    pais: country,
    version: version.toString(),
    paso: 'P02'
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
  var version = {
    'ciclo-1': 1,
    'ciclo-2': 2
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
  
  if (mosaicRegion ==='211' ){mosaicRegion='210'  }
  //if (mosaicRegion ==='211' ){mosaicRegion='210'  }
  var mosaics = paths.map( function(path) {
    
    var mosaic = ee.ImageCollection(path)
      .filterMetadata('region_code', 'equals', parseInt(mosaicRegion))
      .map(function(image) {
        var index = ee.String(image.get('system:index')).slice(0, -3);
        return image.set('index', index);
      });
    
    if(gridName && gridName !== '')
      mosaic = mosaic
        .filterMetadata('grid_name', 'equals', gridName);
    else
      mosaic = mosaic;
    
    if(mosaic.size().getInfo() !== 0) return mosaic;
    
  });
  
  
  mosaics = mosaics.filter( function(m) { return m !== undefined });
    
  var joinedMosaics = mosaics[0];

  if(mosaics.length === 2) {

    var join = ee.Join.inner(),
        joiner = ee.Filter.equals({
          leftField: 'index',
          rightField: 'index'
        });
        
    var joinedCollection = join.apply(mosaics[0], mosaics[1], joiner);
    
    joinedMosaics = ee.ImageCollection(
      joinedCollection.map( function(feature) {
        var primary = feature.get('primary'),
            secondary = feature.get('secondary');
            
        return ee.Image.cat(primary, secondary, altitude, slope);
      })
    );
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
    
  var image = ee.Image(originalImage.asset)
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
          gain: [0.08, 0.06, 0.2]
        },
        'MOSAICO ' + year.toString(), false
      );

      // Clasificaciones
      Map.addLayer(
        image,
        {
          bands: bandname,
          min: 0, max: 34,
          palette: palette
        },
        bandname.toUpperCase().replace('TION_', 'CION ')
      );
      
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