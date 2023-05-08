/**
                                MODULO PARA BLACK LIST
 Update  2019___   Joao et: 
 Update  20200904  EYTC: Ajuste y creacion de  modulo para crear collecion de imagenes
                         ajuste de parametro conforme al script de mosaicos en py
 */  

/*
var param = {
    'grid_name': 'SB-18-Y-C',
    't0': '1994-04-15',
    't1': '1994-11-15',
    'satellite': 'l5',
    'cloud_cover': 30,
    'pais': 'Perú', // Options: 'Perú', 'Bolivia', 'Colombia', 'Ecuador'...
    'regionMosaic': '701',
    'shadowSum':3500,
};
*/

var bns = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/BandNames.js');
var csm = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/CloudAndShadowMasking.js');
var col = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/Collection.js');
var dtp = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/DataType.js');
var ind = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/SpectralIndexes.js');
var mis = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/Miscellaneous.js');
var mos = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/Mosaic.js');
var sma = require('users/Mapbiomas_Peru_C1/Peru_General_NoRAISG_C1:P01_MOSAICOS/modules/SmaAndNdfi.js');

exports.getImages = function (param, blackList, grid) {
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

        var collectionWithMasks = csm.getMasks({
            'collection': collection,
            'cloudBQA': true,    // cloud mask using pixel QA
            'cloudScore': true,  // cloud mas using simple cloud score
            'shadowBQA': true,   // cloud shadow mask using pixel QA
            'shadowTdom': true,  // cloud shadow using tdom
            'zScoreThresh': -1,
            'shadowSumThresh': options.shadowSum,
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

