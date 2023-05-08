/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Eliminar_muestra = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-75.10107699154614, -11.875584855907116],
                  [-75.10223570584057, -11.87825164073717],
                  [-75.10026160000561, -11.876802760879121],
                  [-75.1000255656123, -11.875374871741009]]]),
            {
              "original": "11,",
              "new": "0,",
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/**
 * s02-1-extract-samples, using stable-pixel Col3 Mapbiomas
*/

var param = { 
    regionId: 701, //Region Mosaico
    country: "PERU",
    yearsPreview: [2019, 2020],
    samples: 200,  // En cada clases por año
    exclusion : {
      polygons: [Eliminar_muestra],
      shape: '',
    },
    version_out: '1'
  };
   
  
  // featureSpace
  // var featureSpace = [
  //         "blue_median",
  //         "green_dry",
  //         "green_median",
  //         "green_min",
  //         "red_dry",
  //         "red_median",
  //         "red_min",
  //         "red_wet",
  //         "nir_dry",
  //         "nir_median",
  //         "nir_min",
  //         "nir_stdDev",
  //         "nir_wet",
  //         "swir1_dry",
  //         "swir1_median",
  //         "swir1_min",
  //         "swir1_wet",
  //         "swir2_dry",
  //         "swir2_median",
  //         "swir2_min",
  //         "swir2_wet",
  //         "ndfi_amp",
  //         "ndfi_dry",
  //         "ndfi_median",
  //         "ndfi_stdDev",
  //         "ndfi_wet",
  //         "ndfib_amp",
  //         "ndfib_median",
  //         "gv_amp",
  //         "gv_median",
  //         "gv_stdDev",
  //         "gvs_dry",
  //         "gvs_median",
  //         "gvs_stdDev",
  //         "gvs_wet",
  //         "npv_median",
  //         "npv_stdDev",
  //         "shade_median",
  //         "snow_median",
  //         "snow_min",
  //         "soil_amp",
  //         "soil_median",
  //         "soil_stdDev",
  //         "fns_dry",
  //         "fns_stdDev",
  //         "gcvi_dry",
  //         "gcvi_median",
  //         "gcvi_wet",
  //         "pri_dry",
  //         "pri_median",
  //         "evi2_amp",
  //         "evi2_dry",
  //         "evi2_median",
  //         "evi2_stdDev",
  //         "evi2_wet",
  //         "ndvi_amp",
  //         "ndvi_dry",
  //         "ndvi_median",
  //         "ndvi_stdDev",
  //         "ndvi_wet",
  //         "ndsi_median",
  //         "ndsi_min",
  //         "ndwi_gao_amp",
  //         "ndwi_gao_dry",
  //         "ndwi_gao_median",
  //         "ndwi_gao_wet",
  //         "ndwi_mcfeeters_amp",
  //         "ndwi_mcfeeters_median",
  //         "savi_dry",
  //         "savi_median",
  //         "savi_stdDev",
  //         "savi_wet",
  //         "sefi_dry",
  //         "sefi_median",
  //         "sefi_stdDev",
  //         "wefi_amp",
  //         "wefi_stdDev",
  //         "wefi_wet",
  //         "nuaci_median",
  //         "hallcover_median",
  //         "textG_median",
  //         "cai_max",
  //         "cai_median",
  //         "cai_min",
  //         "gli_dry",
  //         "gli_max",
  //         "gli_median",
  //         "gli_min",
  //         "mndwi_dry",
  //         "mndwi_max",
  //         "mndwi_median",
  //         "mndwi_wet",
  //         "ndbi_dry",
  //         "ndbi_max",
  //         "ndbi_median",
  //         "ndbi_min",
  //         "ndgb_dry",
  //         "ndgb_max",
  //         "ndgb_median",
  //         "ndgb_stdDev",
  //         "ndgb_wet",
  //         "ndmi_dry",
  //         "ndmi_max",
  //         "ndmi_median",
  //         "ndmir_max",
  //         "ndmir_median",
  //         "ndmir_min",
  //         "ndmir_stdDev",
  //         "ndmir_wet",
  //         "ndrb_min",
  //         "ndrb_stdDev",
  //         "ndrb_wet",
  //         "ndsi2_dry",
  //         "ndsi2_median",
  //         "ndsi2_max",
  //         "ndsi2_min",
  //         "ndsi2_wet",
  //         "cloud_median",
  //         "cai_wet_min",
  //         "green_dry_qmo",
  //         "green_wet_min",
  //         "green_wet_qmo",
  //         "ndwi_gao_dry_min",
  //         "ndwi_gao_wet_max",
  //         "ndwi_gao_wet_min",
  //         "ndwi_gao_wet_qmo",
  //         "nir_dry_qmo",
  //         "nir_wet_qmo",
  //         "red_dry_max",
  //         "red_dry_min",
  //         "red_dry_qmo",
  //         "red_wet_max",
  //         "swir1_dry_max",
  //         "swir1_dry_qmo",
  //         "swir1_wet_max",
  //         "swir1_wet_min",
  //         "swir1_wet_qmo",
  //         "swir2_dry_min",
  //         "swir2_dry_qmo",
  //         "swir2_wet_max",
  //         "swir2_wet_qmo",
  //         "nddi_amp",
  //         "nddi_dry",
  //         "nddi_median",
  //         "nddi_wet",
  //         "idb_amp",
  //         "idb_dry",
  //         "idb_median",
  //         "idb_wet",
  //         "brightness_amp",
  //         "brightness_dry",
  //         "brightness_median",
  //         "brightness_wet",
  //         "greeness_amp",
  //         "greeness_dry",
  //         "greeness_median",
  //         "greeness_wet",
  //         "wetness_amp",
  //         "wetness_dry",
  //         "wetness_median",
  //         "wetness_wet",
          
  //         //Adicional
  //         'slppost_k10',
  //         'slppost_k20',
  //         'slppost_k30',
  //         'slppost_k5',
  //         'shade_mask2',
  //         'slope',
  //         'elevation',
  // ];
  
  /**
   * Import Modules CollectionDirectories
   */
  var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
  
  var SampleGet = function(param) {
  
  /**
   * Input data
   * Assets paths, years and another necessary input data
   */
  this.inputs = {
    mosaics: paths.mosaics_c4,
    _regions: paths.regionVector,
    references: 'projects/mapbiomas-raisg/public/collection3/mapbiomas_raisg_panamazonia_collection3_integration_v2',
    palette: require('users/mapbiomas/modules:Palettes.js').get('classification2')
  };
  
  /**
   * Initialize the app
   */
  this.init = function(param) {
    var _this = this;
    var assetMosaics = _this.inputs.mosaics;
    var assetMapbiomas = _this.inputs.references;
    var regionAsset = _this.inputs._regions;
    // var samplesAsset = _this.inputs._samples;
    var palette = _this.inputs.palette;
    
      // Create mask based on region vector
    var regionId = param.regionId;
    var yearsPreview = param.yearsPreview;
    var nSamples = param.samples;
    var country = param.country.split(' ').join('-').toUpperCase();
    var version_out = param.version_out
    
    var region = _this._getRegion(regionAsset, regionId);
    var regionMask = region.rasterMask;
    var regionLayer = region.vector;

    // Get mosaics
    var mosaics = _this.getMosaic(assetMosaics, regionId);
    print('Get mosaics',mosaics.size());

    // Get stable pixels from collection 2
    var collection3 = ee.Image(assetMapbiomas).updateMask(regionMask);
   // Map.addLayer(collection2,{},'collection2',false)
    var classes = ee.List.sequence(1, 34).getInfo();
    var stablePixels = _this.getStablePixels(collection3, classes);
    
  
  
    // wetland sampling points
    var colorId, stableReference;    
    stableReference = stablePixels
                        .updateMask(regionMask)
                        .rename("reference");
    print(stableReference);
      // Exclusión de clases en areas delimitadas con geometrías
    var polygons = param.exclusion.polygons;
    stableReference = remapWithPolygons(stableReference, polygons);
  
     stableReference= stableReference.updateMask(regionMask)
                                     .rename("reference");

    var points = stableReference
      .addBands(ee.Image.pixelLonLat())
      .stratifiedSample({
          numPoints: nSamples,
          classBand: 'reference',
          region: regionLayer.geometry().bounds(),
          scale: 30,
          geometries: true,
          dropNulls: true,
    });
    
    print('points',points.limit(1));
    
    //iterate by years
    Map.setOptions('SATELLITE');
    
    var years = ee.List.sequence(1985, 2020, 1).getInfo();
 
    //add workspace 
        var hand30_100 = ee.ImageCollection("users/gena/global-hand/hand-100"),
            hand30_1000 = ee.Image("users/gena/GlobalHAND/30m/hand-1000"),
            hand90_1000 = ee.Image("users/gena/GlobalHAND/90m-global/hand-1000"),
            hand30_5000 = ee.Image("users/gena/GlobalHAND/30m/hand-5000"),
            swbd = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24"),
            altitude = ee.Image("JAXA/ALOS/AW3D30_V1_1"),
            // slppost = ee.Image("projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v1"),
            // shademask2_v1 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v1"),
            srtm = ee.Image("USGS/SRTMGL1_003");

        // Imports
        altitude = altitude.select('AVE').rename('altitude');
        // slppost = slppost.updateMask(regionMask).rename('slppost');
        var slope = ee.Terrain.slope(altitude).int8().rename('slope');

        // potential water (valleys)
        var thresholds = [0, 1, 2, 5, 10];
        /**
        * Compute hands and shade mask 2 layers
        */
        // smoothen HAND a bit, scale varies a little in the tiles
        hand30_100 = hand30_100.mosaic().focal_mean(0.1);
        swbd = swbd.select('water_mask');
        var swbdMask = swbd.unmask().not().focal_median(1);


        var HANDm = ee.List([]);
        thresholds.map(function(th) {
        var water = hand30_100.lte(th)
            .focal_max(1)
            .focal_mode(2, 'circle', 'pixels', 5).mask(swbdMask);
            
        HANDm = HANDm.add(water.mask(water)
            .set('hand', 'water_HAND_<_' + th + 'm'));
        });

        // water_hand	water (HAND < 5m)
        var HAND_water = ee.ImageCollection(HANDm);

        // exports hands
        hand30_100  = hand30_100.rename('hand30_100');
        hand30_1000 = hand30_1000.rename('hand30_1000');
        hand30_5000 = hand30_5000.rename('hand30_5000');
        hand90_1000 = hand90_1000.rename('hand90_1000');
        HAND_water  = HAND_water.toBands()
        .rename([
            'water_HAND_0m', 'water_HAND_1m', 'water_HAND_2m', 
            'water_HAND_5m', 'water_HAND_10m'
        ]);

        HAND_water = ee.ImageCollection([ee.Image(0),ee.Image(0),ee.Image(0),ee.Image(0),ee.Image(0)]).toBands().rename([
            'water_HAND_0m', 'water_HAND_1m', 'water_HAND_2m', 
            'water_HAND_5m', 'water_HAND_10m'
        ]).where(HAND_water.gte(0), HAND_water)
        
        var hands = hand30_100
        .addBands(hand30_1000).addBands(hand30_5000)
        .addBands(hand90_1000).addBands(HAND_water);
      


    var SamplesList = ee.List([]);
    
    years.forEach(function(year){
          
        var mosaic = mosaics
            .filterMetadata('year', 'equals', year)
            .median()
            .addBands(slope)
            .addBands(altitude)
            .addBands(hands)
            // .select(featureSpace)
            .updateMask(regionMask);

        mosaic = mosaic.updateMask(mosaic.select('blue_median'));
        
        var trainingSamples = _this.getSamples(stableReference, mosaic, points);
        var training = trainingSamples.training;
        
        SamplesList = SamplesList.add(training.map(function(feature){
                    return feature.set('year', year);
                  }));
                                    
        // Export samples to asset
        // var fileName = 'wetland' + '-' + regionId + '-' + country + '-' + year + '-' + version_out;
        // var assetId = samplesAsset + fileName;
        
        // Export.table.toAsset(training, fileName, assetId);
  
        if(yearsPreview.indexOf(year) > -1) {
          
            Map.addLayer(
              mosaic, 
              {
                bands: ['swir1_median', 'nir_median', 'red_median'],
                gain: [0.08, 0.06, 0.08]
              }, 
              'MOSAICO ' + year,
              false
            );
            
        }  
  
    });
    
    SamplesList = ee.FeatureCollection(SamplesList).flatten()
    // print(SamplesList.limit(2))
    // print('SamplesList',SamplesList.size())
    
    // Export samples to asset
    var fileName = 'samples-stable-pixel' + '-' + regionId + '-' + country  + '-' + version_out;

    Export.table.toDrive({
        collection:SamplesList, 
        description:fileName, 
        folder: 'Samples_col4_'+ country, 
        fileNamePrefix:fileName,
        fileFormat:"CSV"
      })

    Map.addLayer(stableReference,
         {
          min: 0,
          max: 34,
          palette: _this.inputs.palette
         },'stableReference',false
        );
  
  
    var pts = ee.FeatureCollection(points);
  
    // Layers
      var eeColors = ee.List(_this.inputs.palette);
      
      var trainingPointsColor = pts.map(
          function (feature) {
      
              var c = feature.get("reference");
      
              return feature.set({
                  "style": {
                      "color": eeColors.get(c),
                      "pointSize": 4
                  }
              });
          }
      );
      
      Map.addLayer(trainingPointsColor.style({
          "styleProperty": "style"
      }), {}, 'points',false);
  
  };
  
  
  
  /**
   * Get mosaics
   * Get mosaics from collection3 asset. Then compute
   * wetlands indexes remaining.
   */
  this.getMosaic = function(paths, regionId) {
  
      var Mosaic_coll = ee.ImageCollection(paths)
                     .filterMetadata('region_code', 'equals', regionId);
  
      return Mosaic_coll;
      
  };
  
  
  /**
   * Get stable pixels
   * Get stable pixels from mapbiomas collection 2
   * Then cross over reference datasets 
   */
  this.getStablePixels = function (image, classes) {
    
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
  };
  
  
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
   * Función para generar region de interés (ROI) con base en
   * las región de clasificación o una grilla millonésima contenida en ella
   */
  this._getRegion = function(regionPath, regionIds){
    
      var setVersion = function(item) { return item.set('version', 1) };
      
      var region = ee.FeatureCollection(regionPath)
        .filter(ee.Filter.eq('id_region', regionIds));
      
      var regionMask = region
        .map(setVersion)
        .reduceToImage(['version'], ee.Reducer.first());
        
      return {
        vector: region,
        rasterMask: regionMask
      };
    
  };
  
  
  /**
   * Get sample points
   */
  this.getSamples = function(reference, mosaic, points) {
    
      var training = reference
        .addBands(mosaic)
        .sampleRegions({
            collection: points,
            properties: ['reference'],
            scale: 30,
            geometries: true,
            tileScale: 4
      });
      
      return {
        points: points, 
        training: training 
      };
      
  };
  
  return this.init(param);
  
  };
  
  
  var Samples = new SampleGet(param);