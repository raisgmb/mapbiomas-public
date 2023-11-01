/** 
 * 
 */    

var param = {
    grid_name: 'NB-20-Z-A',
    t0: '2020-01-01',
    t1: '2020-06-30',
    satellite: 'l8',
    cloud_cover: 90,
    mosaic_region: 902,
    blacklist: [
      'LC08_001056_20200101',
      'LC08_001056_20200117',
      'LC08_001056_20200202',
      'LC08_001056_20200218',
      'LC08_001056_20200305',
      'LC08_001056_20200321',
      'LC08_001056_20200406',
      'LC08_001056_20200422',
      'LC08_001056_20200508',
      'LC08_001056_20200524',
      'LC08_001056_20200625',
      'LC08_001056_20200727',
      'LC08_001056_20200828',
      'LC08_001056_20200913',
      'LC08_001056_20200929'
    ]
};


/**
 * Importa geometria: carta y region
 */
var layers = {
  regions: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-3',
  grids : 'users/Mapbiomas_Peru_C1/DATOS_AUXILIARES/VECTORES/grid_world'
};


var blackList = param.blacklist;


var region = ee.FeatureCollection(layers.regions)
  .filterMetadata('id_region', 'equals', param.mosaic_region);

var grid =  ee.FeatureCollection(layers.grids)
  .filterMetadata('name', 'equals', param.grid_name);






/**  
 * @name
 *    reescale
 * @description
 *    Aplica o reescalonamento em uma imagem
 * @argument
 *    @attribute image {ee.Image}
 *    @attribute min {Integer}
 *    @attribute max {Integer}
 * @returns
 *    ee.Image
 */
var rescale = function (obj) {

  var image = obj
    .image
    .subtract(obj.min)
    .divide(ee.Number(obj.max)
    .subtract(obj.min));

  return image;
    
};





/**
 * 
 */
var scaleFactors = function(image) {
  var optical = [
    'blue',  'green', 'red', 'nir', 'swir1', 'swir2'
  ];
  
  var opticalBands = image
    .select(optical).multiply(0.0000275).add(-0.2).multiply(10000);
  
  var thermalBand = image
    .select('temp*').multiply(0.00341802).add(149.0);
  
  return image
    .addBands(opticalBands, null, true)
    .addBands(thermalBand, null, true);
};





/**
 * @name
 *      cloudBQAMaskSr
 * @returns
 *      ee.Image
 */
var cloudBQAMaskSr = function (image) {

    var qaBand = image.select(['pixel_qa']);
   
    var cloudMask = qaBand.bitwiseAnd(Math.pow(2, 3))
                          .or(qaBand.bitwiseAnd(Math.pow(2, 2)))
                          .or(qaBand.bitwiseAnd(Math.pow(2, 1)))
                          .neq(0)
                          .rename('cloudBQAMask');

    return ee.Image(cloudMask);
};





/**
 * @name
 *      cloudBQAMask
 * @returns
 *      ee.Image
 */
var cloudBQAMask = function (image) {

    var cloudMask = cloudBQAMaskSr(image);

    return image.addBands(ee.Image(cloudMask));
};





/**
 * @name
 *      shadowBQASrLX
 * @returns
 *      ee.Image
 */
var shadowBQAMaskSrLX = function (image) {

    var qaBand = image.select(['pixel_qa']);

    var cloudShadowMask = qaBand.bitwiseAnd(Math.pow(2, 4))
                                .neq(0)
                                .rename('shadowBQAMask');

    return ee.Image(cloudShadowMask);
};





/**
 * @name
 *      cloudBQAMask 
 * @returns
 *      ee.Image
 */
var shadowBQAMask = function (image) {

    var cloudShadowMask = ee.Algorithms.If(
        ee.String(image.get('satellite_name')).slice(0, 10).compareTo('Sentinel-2').not(),
        // true
        ee.Image(0).mask(image.select(0)).rename('shadowBQAMask'),
        // false
        shadowBQAMaskSrLX(image)
    );

    return image.addBands(ee.Image(cloudShadowMask));
    
};





/**
 * @name
 *      getMasks
 * @returns
 *      ee.ImageCollection
 */
var getMasks = function (obj) {
     
    // Cloud mask
    var collection = obj.collection.map(cloudBQAMask);
    collection = ee.ImageCollection(collection);

    // Cloud shadow Mask
    collection = collection.map(shadowBQAMask);
    return ee.ImageCollection(collection);

};

//*****
var bns = require('users/raisgmb01/MapBiomas_C4:P01_MOSAICOS/modules/BandNames.js');
var col = require('users/raisgmb01/MapBiomas_C4:P01_MOSAICOS/modules/Collection.js');


var getImages = function (param, blackList, grid) {
    var options = {

        dates: {
            t0: param.t0,
            t1: param.t1
        },

        collection: null,

        regionMosaic: param.mosaic_region,
        gridName: param.grid_name,
        cloudCover: param.cloud_cover,
        shadowSum: param.shadowSum || 3500,
        cloudThresh: param.cloudThresh || 50,
        
        blackList: blackList,

        imageList: [],

        collectionid: param.satellite,

        collectionIds: {
            'l4': [
                'LANDSAT/LT04/C02/T1_L2'
            ],
            'l5': [
                'LANDSAT/LT05/C02/T1_L2'
            ],
            'l7': [
                'LANDSAT/LE07/C02/T1_L2'
            ],
            'l8': [
                'LANDSAT/LC08/C02/T1_L2'
            ],
            'lx': [
                'LANDSAT/LT05/C02/T1_L2',
                'LANDSAT/LE07/C02/T1_L2'
            ],
        },


        bqaValue: {
            'l4': ['QA_PIXEL', Math.pow(2, 5)],
            'l5': ['QA_PIXEL', Math.pow(2, 5)],
            'l7': ['QA_PIXEL', Math.pow(2, 5)],
            'l8': ['QA_PIXEL', Math.pow(2, 5)],
            'lx': ['QA_PIXEL', Math.pow(2, 5)],
        },
        bandIds: {
            'LANDSAT/LT04/C02/T1_L2': 'l4_sr2',
            'LANDSAT/LT05/C02/T1_L2': 'l5_sr2',
            'LANDSAT/LE07/C02/T1_L2': 'l7_sr2',
            'LANDSAT/LC08/C02/T1_L2': 'l8_sr2',
        },
        visParams: {
            bands: 'swir1,nir,red',
            gain: '0.008,0.006,0.02',
            gamma: 0.75
        }
    }
    
    var applyCloudAndSahdowMask = function (collection) {

        var collectionWithMasks = getMasks({
            'collection': collection,
            'cloudBQA': true,    // cloud mask using pixel QA
            'shadowBQA': true,   // cloud shadow mask using pixel QA
            'zScoreThresh': -1,
            'shadowSumThresh': options.shadowSum,
            'cloudThresh':options.cloudThresh,
            'dilatePixels': 2,
            'cloudHeights': ee.List.sequence(2000, 10000, 500),
            'cloudBand': 'cloudScoreMask' //'cloudScoreMask' or 'cloudBQAMask'
        });

        // get collection without clouds
        var collectionWithoutClouds = collectionWithMasks.map(
            function (image) {
                return image.mask(
                    image.select([
                        'cloudBQAMask',
                        'shadowBQAMask',
                    ]).reduce(ee.Reducer.anyNonZero()).eq(0)
                );
            }
        );

        return collectionWithoutClouds;
    };

    var applySingleCloudMask = function (image) {

        return image.mask(
            image.select(options.bqaValue[options.collectionid][0])
                .bitwiseAnd(options.bqaValue[options.collectionid][1]).not());
                
    };

    var processCollection =  function (collectionid) {

        var spectralBands = ['blue', 'red', 'green', 'nir', 'swir1', 'swir2'];

        var objLandsat = {
            'collectionid': collectionid,
            'geometry':     grid.geometry(),
            'dateStart':    options.dates.t0.slice(0, 4)+'-01-01',
            'dateEnd':      options.dates.t1.slice(0, 4)+'-12-31',
            'cloudCover':   options.cloudCover,
        };

        var bands = bns.get(options.bandIds[collectionid]);
        

        var collection = col.getCollection(objLandsat)
            .select(bands.bandNames, bands.newNames)
            .filter(ee.Filter.inList('system:index', options.blackList).not());
            
        collection = collection.map(scaleFactors);
        collection = applyCloudAndSahdowMask(collection).select(spectralBands);
 
        return collection;
    };
    
    var makeCollection = function () {

        var collection = processCollection(
                     options.collectionIds[options.collectionid][0]);

        // Unmask data with the secondary mosaic (+L5 or +L7)
        if (options.collectionIds[options.collectionid].length == 2) {
            var collection2 = processCollection(
                options.collectionIds[options.collectionid][1]);

            collection = collection.merge(collection2);
        }

      return collection;
    };

    var coll = makeCollection();

    var median = coll.filterDate(options.dates.t0, options.dates.t1);

    return median;
}

//*****


var collection_without_blacklist = getImages(param, [],grid);
var collection_with_blacklist = getImages(param, blackList,grid);



print('collection sin blackList:', collection_without_blacklist);
print('collection con blackList:', collection_with_blacklist);


/**
 * Despliega en el mapa los mosaicos y polígonos necesarios
 * para la visualización
 */

Map.addLayer(
    grid.style({ fillColor: 'gold', color: 'orange'}), 
    {}, 'Background'
);

Map.addLayer(
  collection_without_blacklist.median().clip(grid),
  {
    bands: 'swir1,nir,red',
    gain: '0.08,0.06,0.2'
  },
  'MOSAIC',
  true
);
                    
Map.addLayer(
  collection_with_blacklist.median().clip(grid),
  {
    bands: 'swir1,nir,red',
    gain: '0.08,0.06,0.2'
  },
  'MOSAIC BLACK LIST',
  true 
);

Map.addLayer(
    region.style({ fillColor: '#ff000000', color: 'f59e42'}),
    {}, 'Regions ' + param.pais, false
);

/**
 * Despliega las escenas landsat disponibles para cada mosaico, de manera que
 * se puede visualizar cómo afecta la calidad del mosaico
 */
collection_with_blacklist.reduceColumns(ee.Reducer.toList(), ['system:index'])
  .get('list')
  .evaluate(
      function(ids){
          ids.forEach(
              function(imageid){
                  var image = collection_with_blacklist.filterMetadata('system:index', 'equals', imageid);
                  image = image.mosaic()//.clip(paises);
                  Map.addLayer(image,
                    {
                      bands: 'swir1,nir,red',
                      gain: '0.08,0.06,0.2'
                    },
                    imageid,
                    false
                  );
                  print(imageid);
              }
          );
      }  
  );
  
