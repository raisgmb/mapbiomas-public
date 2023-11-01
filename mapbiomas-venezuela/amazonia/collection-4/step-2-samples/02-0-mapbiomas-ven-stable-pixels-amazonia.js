/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var exclude3 = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-76.45494482049676, -1.3788132436566531],
                  [-76.16925249252314, -1.4886620097169703],
                  [-76.0813557942927, -1.1481225407474842],
                  [-76.41098793602163, -1.1371385160972836]]]),
            {
              "original": "3,",
              "new": "27,",
              "system:index": "0"
            })]),
    exclude14 = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-76.05938908364705, -1.027313605742831],
                  [-75.82869025964274, -1.1261661763973725],
                  [-75.6089752335862, -0.93944216676776],
                  [-76.03741991069093, -0.7636878545587116]]]),
            {
              "system:index": "0"
            })]),
    exclude25 = /* color: #98ff00 */ee.FeatureCollection([]),
    exclude33 = /* color: #0b4a8b */ee.FeatureCollection([]),
    remap33a25 = /* color: #98ff00 */ee.FeatureCollection([]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/** 
 * STEP 02-0 : CÁLCULO DE PIXELES ESTABLES Y AREAS DE EXCLUSIÓN v3.2 
 * DICIEMBRE 2021
 * DOCUMENTACIÓN:
 * ----------------------------------------------------------------------------------------------
 */

/** 
 * PARAMETROS DE USUARIO:
 * Ajuste los parámetros a continuacón para generar la imagen de pixeles estables correspondiente
 * ----------------------------------------------------------------------------------------------
 */
var param = {
  country: 'VENEZUELA',
  regionId: 90222, //401,
  yearsPreview: [2020 ], //1986, 1987, 1988, 1989, 1990, 1997, 1998, 1999,  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,   2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020
  remap: {
    from: [3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34],
    to:   [3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 24, 31, 32, 33, 34]
  },
  exclusion : {
    years: [
      1989, 1991, 1992, 1993, 1994, 1995, 2004, 2007, 2010, 2014
    ],
    classes: [ 6 ],
    ignoreClasses: [14, 25], // estas clases se mantienen, pese a estar en el área que cubre la máscara
    polygons: [ exclude3 ],
    shape: 'bosque-mal-clasificado', //'TIERRA_AGROPECUARIA_2018_40202',
  },
  driveFolder: 'DRIVE-EXPORT',
  processingCicle: 1
};




/**
 * Stable pixels generator for collection 4
 * ----------------------------------------------------------------------------------------------
 */
var StablePixels = function(param) {
  
  
  var init = function(param) {
  
    // setting up assets
    var paths = _this.modules.paths;
    var functions = _this.modules.functions;
    
    var assets = {
      basePath: paths.stablePixelsPath,
      regions: paths.regionVector,
      regionsRaster: paths.regionCRaster,
      mosaics: paths.mosaics_c3_v2,
      image: paths.collection3,
    };
    
    
    // Assign assets version bassed on the processing cicle
    var version = param.processingCicle;
  
    
    // Define region and country
    var regionId = param.regionId;
    var country = param.country;
    
    
    // Define region mask
    var region = functions.getRegion(assets.regions, regionId);
    var regionMask = region.rasterMask;
      
    
    // Setting up exclusion areas
    //var shapePath = assets.basePath + country + '/';
    var shapePath = 'users/Mosaico_Clasification/AFF/GENERAL/VECTORS/';
    var shapeName = param.exclusion.shape;
    var fullRegion = functions.excludeAreas(regionMask, shapePath, shapeName);
    
    
    // Extraer la classificación, ignorando años con inconsistencias.
    var image = ee.Image(assets.image);
    image = functions.selectByYear(image, param.exclusion.years);
    print('Años usados', image.bandNames());
  
    
    // Remap of classes
    var originalClasses = param.remap.from;
    var newClasses = param.remap.to;
    image = functions.remapBands(image, originalClasses, newClasses);
    
  
    // Get stable pixels
    var classes = ee.List.sequence(1, 34);
    classes = classes.removeAll(param.exclusion.classes).getInfo();
    var stablePixels = functions.getStablePixels(image, classes);
    
  
    // Exclusión de clases en areas delimitadas con geometrías
    var polygons = param.exclusion.polygons;
    var ignoreClasses = param.exclusion.ignoreClasses;
    
    if(ignoreClasses.length > 0) {
      var permanentClasses = stablePixels
        .remap(ignoreClasses, ee.List.repeat(1, ignoreClasses.length), 0) ;
      
      fullRegion = fullRegion.where(permanentClasses.gt(0), 1);
    }
    else fullRegion = fullRegion;
  
    fullRegion = fullRegion.updateMask(fullRegion.gt(0));
    
    stablePixels = stablePixels.updateMask(fullRegion);
    stablePixels = functions.remapWithPolygons(stablePixels, polygons);
    
    
    // Importar mosaicos para visualización
    var assetsMosaics = assets.mosaics;
    var variables = ['nir_median', 'swir1_median', 'red_median'];
    var mosaics = functions.getMosaic(assetsMosaics, param.regionId, variables);
      
  
    // Mostrar imagenes en el mapa
    var assetData = {
      asset: assets.image,
      region: region,
      years: param.yearsPreview    
    };
    
    _this.addLayersToMap(stablePixels, mosaics, assetData);
  
  
    // Exportar assets a GEE y Google Drive
    var imageName = 'ME-'+ country + '-' + regionId + '-' + version;
    var assetId = assets.basePath + imageName;
    var driveFolder = param.driveFolder;
    var vector = region.vector;
  
    var props = {
      code_region: param.regionId,
      pais: country,
      version: version.toString(),
      paso: 'P02'
    };
  
    stablePixels = stablePixels.set(props);
    _this.exportImage(stablePixels, imageName, assetId, vector, driveFolder);    
  };


  var _this = this;
  
  
  
  /**
   * Loading parameters and modules
   */
  _this.param = param;
  _this.modules = {
    paths: require('users/raisgmb01/projects-mapbiomas:mapbiomas-venezuela/collection-4/modules/directories').paths,
    functions: require('users/raisgmb01/projects-mapbiomas:mapbiomas-venezuela/collection-4/modules/api').functions
  };

  
  
  /**
   * addLayersToMap method
   * add results of processing to the map for visualization
   */
  _this.addLayersToMap = function(stablePixels, mosaics, originalImage) {
    
    Map.setOptions({ mapTypeId: 'SATELLITE' });
    
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
            gain: [0.085, 0.053, 0.29]
          },
          'MOSAICO ' + year.toString(),
          false
        );
  
        // Clasificaciones
        Map.addLayer(
          image,
          {
            bands: bandname,
            min: 0, max: 34,
            palette: palette
          },
          bandname.toUpperCase().replace('TION_', 'CION '),
          false
        );
        
      });
      
      
      // Región
      Map.addLayer(
        region.vector.style({
          fillColor: '00000066', color: 'FCBA03'
        }),
        {},
        'REGION ' + param.regionId
      );
      
      
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
  _this.exportImage = function(image, imageName, imageId, region, driveFolder) {
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
  

  
  
  return init(_this.param);
};


new StablePixels(param);