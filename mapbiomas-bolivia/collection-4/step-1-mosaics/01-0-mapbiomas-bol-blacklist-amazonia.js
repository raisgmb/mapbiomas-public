/** 
                                P1 BLACK LIST EN MOSAICOS PERU PACIFICO
 Update  2019___   Joao et: 
 Update  20200904  EYTC: creacion de nuevo modulo GetImages para blacklist
 Update  20211215   RCA: Adapción para Bolivia
 */    

 var param = {
    'grid_name': 'SE-20-Z-A',
    't0': '2018-01-01',
    't1': '2018-12-31',
    'satellite': 'l8',
    'cloud_cover': 70,
    'pais': 'Bolivia', // Options: 'Perú'
    'regionMosaic': 210,  //
    'shadowSum':3500,   //0 - 10000  Defaut 3500  
    'cloudThresh':10,  // 0 - 100    Defaut 10
};

/**
 * Definición de imágenes que serán excluidas del procesamiento (Blacklist)
 */
var blackList = [
    'LT05_009066_19940610', 'LT05_009065_19941016'
];

/**
 * Importa geometria: carta y region
 */
 
//var AssetRegions = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-3';
var AssetRegions = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-bol';
var AssetGrids = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid-world';
                  
var region = ee.FeatureCollection(AssetRegions).filterMetadata('id_region', 'equals', param.regionMosaic)
var grid =  ee.FeatureCollection(AssetGrids).filterMetadata('name', 'equals', param.grid_name)


//*****

/**  
 * @name
 *      reescale
 * @description
 *      Aplica o reescalonamento em uma imagem
 * @argument
 *      Objecto contendo os atributos
 *          @attribute image {ee.Image}
 *          @attribute min {Integer}
 *          @attribute max {Integer}
 * @example
 *      var obj = {
 *          'image': image.expression('b(red) + b(green) + b(blue)'),
 *          'min': 2000,
 *          'max': 8000
 *      };
 *      
 *      var reescaled = reescale(obj);
 * @returns
 *      ee.Image
 */
var rescale = function (obj) {

    var image = obj.image.subtract(obj.min).divide(ee.Number(obj.max).subtract(obj.min));

    return image;
};

/**
 * @name
 *      cloudScore
 * @description
 *      Constroi uma máscara de nuvens usando varios indicadores de presença de nuvens 
 * @argument
 *      @attribute image {ee.Image}
 * @example
 *      var image = cloudScore(image);
 * @returns 
 *      ee.Image
 */
var cloudScore = function (image) {

    var cloudThresh = param.cloudThresh;

    // Compute several indicators of cloudiness and take the minimum of them.
    var score = ee.Image(1.0);

    // Clouds are reasonably bright in the blue band.
    score = score.min(rescale({
        'image': image.select(['blue']),
        'min': 1000,
        'max': 3000
    }));

    // Clouds are reasonably bright in all visible bands.
    score = score.min(rescale({
        'image': image.expression("b('red') + b('green') + b('blue')"),
        'min': 2000,
        'max': 8000
    }));

    // Clouds are reasonably bright in all infrared bands.
    score = score.min(rescale({
        'image': image.expression("b('nir') + b('swir1') + b('swir2')"),
        'min': 3000,
        'max': 8000
    }));

    // Clouds are reasonably cool in temperature.
    var temperature = image.select(['temp']);

    // score = score.where(temperature.mask(),
    //     score.min(rescale({
    //         'image': temperature,
    //         'min': 300,
    //         'max': 290
    //     })));

    // However, clouds are not snow.
    var ndsi = image.normalizedDifference(['green', 'swir1']);

    score = score.min(rescale({
        'image': ndsi,
        'min': 0.8,
        'max': 0.6
    })).multiply(100).byte();

    score = score.gte(cloudThresh).rename('cloudScoreMask');

    return image.addBands(score);
};

/**
 * @name
 *      tdom
 * @description
 *      The TDOM method first computes the mean and standard deviation of the near-infrared(NIR) and
 *      shortwave-infrared(SWIR1) bands across a collection of images.For each image, the algorithm then
 *      computes the z - score of the NIR and SWIR1 bands(z(Mb))(Equation(5))(Figure 2). Each image also has a
 *      darkness metric computed as the sum of the NIR and SWIR1 bands().Cloud shadows are then identified
 *      if a pixel has a z - score of less than −1 for both the NIR and SWIR1 bands and a darkness
 *      value less than 0.35 (Equation(8)).These thresholds were chosen after extensive qualitative evaluation of
 *      TDOM outputs from across the CONUS.
 * 
 * https://www.mdpi.com/2072-4292/10/8/1184/htm
 * @argument
 *      Objecto contendo os atributos
 *          @attribute collection {ee.ImageCollection}
 *          @attribute zScoreThresh {Float}
 *          @attribute shadowSumThresh {Float}
 *          @attribute dilatePixels {Integer}
 * @example
 *      var obj = {
 *          'collection': collection,
 *          'zScoreThresh': -1,
 *          'shadowSumThresh': 0.5,
 *          'dilatePixels': 2,
 *      };
 *      
 *      collection = tdom(obj);
 * @returns
 *      ee.ImageCollection
 */
var tdom = function (obj) {

    var shadowSumBands = ['nir', 'swir1'];

    // Get some pixel-wise stats for the time series
    var irStdDev = obj.collection
        .select(shadowSumBands)
        .reduce(ee.Reducer.stdDev());

    var irMean = obj.collection
        .select(shadowSumBands)
        .mean();

    // Mask out dark dark outliers
    var collection = obj.collection.map(
        function (image) {
            var zScore = image.select(shadowSumBands)
                .subtract(irMean)
                .divide(irStdDev);

            var irSum = image.select(shadowSumBands)
                .reduce(ee.Reducer.sum());

            var tdomMask = zScore.lt(obj.zScoreThresh)
                .reduce(ee.Reducer.sum())
                .eq(2)
                .and(irSum.lt(obj.shadowSumThresh))
                .not();

            tdomMask = tdomMask.focal_min(obj.dilatePixels);

            return image.addBands(tdomMask.rename('tdomMask'));
        }
    );

    return collection;
};

/**
 * @name
 *      cloudProject
 * @description
 *      
 * @argument
 *      Objecto contendo os atributos
 *          @attribute image {ee.Image}
 *          @attribute cloudHeights {ee.List}
 *          @attribute shadowSumThresh {Float}
 *          @attribute dilatePixels {Integer}
 *          @attribute cloudBand {String}
 * @example
 *      var obj = {
 *          'image': image,
 *          'cloudHeights': ee.List.sequence(200, 10000, 500),
 *          'shadowSumThresh': 0.5,
 *          'dilatePixels': 2,
 *          'cloudBand': 'cloudScoreMask',
 *      };
 *      
 *      image = cloudProject(obj);
 * @returns
 *      ee.Image
 */
var cloudProject = function (obj) {

    // Get the cloud mask
    var cloud = obj.image
        .select(obj.cloudBand);

    // Get TDOM mask
    var tdomMask = obj.image
        .select(['tdomMask']);

    //Project the shadow finding pixels inside the TDOM mask that are dark and 
    //inside the expected area given the solar geometry
    //Find dark pixels
    var darkPixels = obj.image.select(['nir', 'swir1', 'swir2'])
        .reduce(ee.Reducer.sum())
        .lt(obj.shadowSumThresh);

    //Get scale of image
    var nominalScale = cloud
        .projection()
        .nominalScale();

    //Find where cloud shadows should be based on solar geometry
    //Convert to radians
    var meanAzimuth = obj.image.get('sun_azimuth_angle');
    var meanElevation = obj.image.get('sun_elevation_angle');

    var azR = ee.Number(meanAzimuth)
        .multiply(Math.PI)
        .divide(180.0)
        .add(ee.Number(0.5).multiply(Math.PI));

    var zenR = ee.Number(0.5)
        .multiply(Math.PI)
        .subtract(ee.Number(meanElevation).multiply(Math.PI).divide(180.0));

    //Find the shadows
    var shadows = obj.cloudHeights.map(
        function (cloudHeight) {

            cloudHeight = ee.Number(cloudHeight);

            var shadowCastedDistance = zenR.tan()
                .multiply(cloudHeight); //Distance shadow is cast

            var x = azR.cos().multiply(shadowCastedDistance)
                .divide(nominalScale).round(); //X distance of shadow

            var y = azR.sin().multiply(shadowCastedDistance)
                .divide(nominalScale).round(); //Y distance of shadow

            return cloud.changeProj(cloud.projection(), cloud.projection()
                .translate(x, y));
        }
    );

    var shadow = ee.ImageCollection.fromImages(shadows).max().unmask();

    //Create shadow mask
    shadow = shadow.focal_max(obj.dilatePixels);
    shadow = shadow.and(darkPixels).and(tdomMask.not().and(cloud.not()));

    var shadowMask = shadow
        .rename(['shadowTdomMask']);

    return obj.image.addBands(shadowMask);
};

/**
 * @name
 *      cloudBQAMaskToaLX
 * @description
 *      
 * @argument
 * 
 * @example
 * 
 * @returns
 *      ee.Image
 */
var cloudBQAMaskToaLX = function (image) {

    var qaBand = image.select('BQA');

    var cloudMask = qaBand.bitwiseAnd(Math.pow(2, 5)).neq(0)
        .or(qaBand.bitwiseAnd(Math.pow(2, 6)).neq(0))
        .rename('cloudBQAMask');

    return ee.Image(cloudMask);
};

/**
 * @name
 *      cloudBQAMaskToaS2
 * @description
 *      
 * @argument
 * 
 * @example
 * 
 * @returns
 *      ee.Image
 */
var cloudBQAMaskToaS2 = function (image) {

    var qaBand = image.select('BQA');

    var cloudMask = qaBand.bitwiseAnd(Math.pow(2, 10)).neq(0)
        .or(qaBand.bitwiseAnd(Math.pow(2, 11)).neq(0))
        .rename('cloudBQAMask');

    return ee.Image(cloudMask);
};

/**
 * @name
 *      cloudBQAMaskToa
 * @description
 *      
 * @argument
 * 
 * @example
 * 
 * @returns
 *      ee.Image
 */
var cloudBQAMaskToa = function (image) {

    var cloudMask = ee.Algorithms.If(
        ee.String(image.get('satellite_name')).slice(0, 10).compareTo('Sentinel-2').not(),
        cloudBQAMaskToaS2(image),
        cloudBQAMaskToaLX(image)
    );

    return ee.Image(cloudMask);
};

/**
 * @name
 *      cloudBQAMaskSr
 * @description
 *      
 * @argument
 * 
 * @example
 * 
 * @returns
 *      ee.Image
 */
var cloudBQAMaskSr = function (image) {

    var qaBand = image.select(['pixel_qa']);

    var cloudMask = qaBand.bitwiseAnd(Math.pow(2, 5)).neq(0)
        .rename('cloudBQAMask');

    return ee.Image(cloudMask);
};

/**
 * @name
 *      cloudBQAMask
 * @description
 *      
 * @argument
 * 
 * @example
 * 
 * @returns
 *      ee.Image
 */
var cloudBQAMask = function (image) {

    var cloudMask = ee.Algorithms.If(
        ee.String(image.get('reflectance')).compareTo('TOA').not(),
        cloudBQAMaskToa(image),
        cloudBQAMaskSr(image)
    );

    return image.addBands(ee.Image(cloudMask));
};

/**
 * @name
 *      shadowBQAMaskToaLX
 * @description
 *      
 * @argument
 * 
 * @example
 * 
 * @returns
 *      ee.Image
 */
var shadowBQAMaskToaLX = function (image) {

    var qaBand = image.select('BQA');

    var cloudShadowMask = qaBand.bitwiseAnd(Math.pow(2, 7)).neq(0)
        .or(qaBand.bitwiseAnd(Math.pow(2, 8)).neq(0))
        .rename('shadowBQAMask');

    return ee.Image(cloudShadowMask);
};

/**
 * @name
 *      shadowBQASrLX
 * @description
 *      
 * @argument
 * 
 * @example
 * 
 * @returns
 *      ee.Image
 */
var shadowBQAMaskSrLX = function (image) {

    var qaBand = image.select(['pixel_qa']);

    var cloudShadowMask = qaBand.bitwiseAnd(Math.pow(2, 3)).neq(0)
        .rename('shadowBQAMask');

    return ee.Image(cloudShadowMask);
};

/**
 * @name
 *      cloudBQAMask
 * @description
 *      
 * @argument
 * 
 * @example
 * 
 * @returns
 *      ee.Image
 */
var shadowBQAMask = function (image) {

    var cloudShadowMask = ee.Algorithms.If(
        ee.String(image.get('satellite_name')).slice(0, 10).compareTo('Sentinel-2').not(),
        // true
        ee.Image(0).mask(image.select(0)).rename('shadowBQAMask'),
        // false
        ee.Algorithms.If(ee.String(image.get('reflectance')).compareTo('TOA').not(),
            shadowBQAMaskToaLX(image),
            shadowBQAMaskSrLX(image)
        )
    );

    return image.addBands(ee.Image(cloudShadowMask));
};

/**
 * @name
 *      getMasks
 * @description
 *      
 * @argument
 *      Objecto contendo os atributos
 *          @attribute collection {ee.ImageCollection}
 *          @attribute cloudBQA {Boolean}
 *          @attribute cloudScore {Boolean}
 *          @attribute shadowBQA {Boolean}
 *          @attribute shadowTdom {Boolean}
 *          @attribute zScoreThresh { Float}
 *          @attribute shadowSumThresh { Float}
 *          @attribute dilatePixels { Integer}
 *          @attribute cloudHeights {ee.List}
 *          @attribute cloudBand {String}
 * @example
 *      var obj = {
 *          'collection': collection,
 *          'cloudBQA': true,
 *          'cloudScore': true,
 *          'shadowBQA': true,
 *          'shadowTdom': true,
 *          'zScoreThresh': -1,
 *          'shadowSumThresh': 0.5,
 *          'dilatePixels': 2,
 *          'cloudHeights': ee.List.sequence(200, 10000, 500),
 *          'cloudBand': 'cloudScoreMask'
 *      };
 *      
 *      var collectionWithMasks = getMasks(obj);
 * @returns
 *      ee.ImageCollection
 */
var getMasks = function (obj) {

    // Cloud mask
    var collection = ee.Algorithms.If(obj.cloudBQA,
        ee.Algorithms.If(obj.cloudScore,
            // cloudBQA is true and cloudScore is true
            obj.collection.map(cloudBQAMask).map(cloudScore),
            // cloudBQA is true and cloudScore is false
            obj.collection.map(cloudBQAMask)),
        // cloudBQA is false and cloudScore is true
        obj.collection.map(cloudScore));

    collection = ee.ImageCollection(collection);

    // Cloud shadow Mask
    collection = ee.Algorithms.If(obj.shadowBQA,
        ee.Algorithms.If(obj.shadowTdom,
            // shadowBQA is true and shadowTdom is true
            tdom({
                'collection': collection.map(shadowBQAMask),
                'zScoreThresh': obj.zScoreThresh,
                'shadowSumThresh': obj.shadowSumThresh,
                'dilatePixels': obj.dilatePixels,
            }),
            // shadowBQA is true and shadowTdom is false
            collection.map(shadowBQAMask)),
        // shadowBQA is false and shadowTdom is true
        tdom({
            'collection': collection,
            'zScoreThresh': obj.zScoreThresh,
            'shadowSumThresh': obj.shadowSumThresh,
            'dilatePixels': obj.dilatePixels,
        }));

    collection = ee.ImageCollection(collection);

    var getShadowTdomMask = function (image) {

        image = cloudProject({
            'image': image,
            'shadowSumThresh': obj.shadowSumThresh,
            'dilatePixels': obj.dilatePixels,
            'cloudHeights': obj.cloudHeights,
            'cloudBand': obj.cloudBand,
        });

        return image;
    };

    collection = ee.Algorithms.If(
        obj.shadowTdom,
        collection.map(getShadowTdomMask),
        collection);

    return ee.ImageCollection(collection);

};

//*****
var bns = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/step-1-mosaics/modules/BandNames.js');
//var csm = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/CloudAndShadowMasking.js');
var col = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/step-1-mosaics/modules/Collection.js');
var dtp = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/step-1-mosaics/modules/DataType.js');
var ind = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/step-1-mosaics/modules/SpectralIndexes.js');
var mis = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/step-1-mosaics/modules/Miscellaneous.js');
var mos = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/step-1-mosaics/modules/Mosaic.js');
var sma = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/step-1-mosaics/modules/SmaAndNdfi.js');

var getImages = function (param, blackList, grid) {
    var options = {

        dates: {
            t0: param.t0,
            t1: param.t1
        },

        collection: null,

        regionMosaic: param.regionMosaic,
        gridName: param.grid_name,
        cloudCover: param.cloud_cover,
        shadowSum: param.shadowSum,
        cloudThresh: param.cloudThresh,
        
        blackList: blackList,

        imageList: [],

        collectionid: param.satellite,

        collectionIds: {
            'l4': [
                'LANDSAT/LT04/C01/T1_SR'
            ],
            'l5': [
                'LANDSAT/LT05/C01/T1_SR'
            ],
            'l7': [
                'LANDSAT/LE07/C01/T1_SR'
            ],
            'l8': [
                'LANDSAT/LC08/C01/T1_SR'
            ],
            'lx': [
                'LANDSAT/LT05/C01/T1_SR',
                'LANDSAT/LE07/C01/T1_SR'
            ],
        },

        endmembers: {
            'l4': sma.endmembers['landsat-4'],
            'l5': sma.endmembers['landsat-5'],
            'l7': sma.endmembers['landsat-7'],
            'l8': sma.endmembers['landsat-8'],
            'lx': sma.endmembers['landsat-5'],
        },

        bqaValue: {
            'l4': ['pixel_qa', Math.pow(2, 5)],
            'l5': ['pixel_qa', Math.pow(2, 5)],
            'l7': ['pixel_qa', Math.pow(2, 5)],
            'l8': ['pixel_qa', Math.pow(2, 5)],
            'lx': ['pixel_qa', Math.pow(2, 5)],
        },
        bandIds: {
            'LANDSAT/LT04/C01/T1_SR': 'l4',
            'LANDSAT/LT05/C01/T1_SR': 'l5',
            'LANDSAT/LE07/C01/T1_SR': 'l7',
            'LANDSAT/LC08/C01/T1_SR': 'l8',
        },
        visParams: {
            bands: 'swir1,nir,red',
            gain: '0.08,0.06,0.2',
            gamma: 0.75
        }
    }
    
    var applyCloudAndSahdowMask = function (collection) {

        var collectionWithMasks = getMasks({
            'collection': collection,
            'cloudBQA': true,    // cloud mask using pixel QA
            'cloudScore': true,  // cloud mas using simple cloud score
            'shadowBQA': true,   // cloud shadow mask using pixel QA
            'shadowTdom': true,  // cloud shadow using tdom
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
                        'cloudScoreMask',
                        'shadowBQAMask',
                        'shadowTdomMask'
                    ]).reduce(ee.Reducer.anyNonZero()).eq(0)
                );
            }
        );

        return collectionWithoutClouds;
    }

    var applySingleCloudMask = function (image) {

        return image.mask(
            image.select(options.bqaValue[options.collectionid][0])
                .bitwiseAnd(options.bqaValue[options.collectionid][1]).not());
    }

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

         collection = applyCloudAndSahdowMask(collection)
                     .select(spectralBands);

        // apply SMA
        collection = collection.map(
            function (image) {
                return sma.getFractions(image,
                    options.endmembers[options.collectionid]);
            }
        );

        // calculate SMA indexes        
        collection = collection
            .map(sma.getNDFI)
            .map(sma.getSEFI)
            .map(sma.getWEFI)
            .map(sma.getFNS);

        // calculate Spectral indexes        
        collection = collection
            .map(ind.getCAI)
            .map(ind.getEVI2)
            .map(ind.getGCVI)
            .map(ind.getHallCover)
            .map(ind.getHallHeigth)
            .map(ind.getNDVI)
            .map(ind.getNDWI)
            .map(ind.getPRI)
            .map(ind.getSAVI);

 

        return collection
    }
    
    var makeCollection = function () {

        var collection = processCollection(
                     options.collectionIds[options.collectionid][0]);

        // Unmask data with the secondary mosaic (+L5 or +L7)
        if (options.collectionIds[options.collectionid].length == 2) {
            var collection2 = processCollection(
                options.collectionIds[options.collectionid][1]);

            collection = collection.merge(collection2);
        }

      return collection
    }

    var coll = makeCollection()

    var coll_median = coll.filterDate(options.dates.t0, options.dates.t1)
    //print(coll_median)
    
    return coll_median
}

//*****


var collection_without_blacklist = getImages(param, [],grid);
var collection_with_blacklist = getImages(param, blackList,grid);



print('collection sin blackList:', collection_without_blacklist);
print('collection con blackList:', collection_with_blacklist);

Map.centerObject(grid, 10);

/**
 * Despliega en el mapa los mosaicos y polígonos necesarios
 * para la visualización
 */

Map.addLayer(
    grid.style({ fillColor: 'f8fc03', color: 'f8fc0300'}), 
    {}, 'Background'
);

Map.addLayer(collection_without_blacklist.median().clip(region).clip(grid), {
        bands: 'swir1,nir,red',
        gain: '0.08,0.06,0.2'
    },
    'MOSAIC',
    true
);
                    
Map.addLayer(collection_with_blacklist.median().clip(region).clip(grid), {
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
                  Map.addLayer(image, {
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
  