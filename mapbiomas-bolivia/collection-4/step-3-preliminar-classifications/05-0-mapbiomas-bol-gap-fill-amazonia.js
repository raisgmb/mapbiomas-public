/** 
 * STEP 03-5: FILTRO DE GAP FILL  
 * Noviembre 2021
 * DOCUMENTACIÓN: https://docs.google.com/document/d/1V1_kj6idnTzLslsXFC11EbU-qGcwhsHBWQTgRLR9QEw/edit?userstoinvite=sig2%40provitaonline.org&ts=5f7333f7&actionButton=1#heading=h.vae2491gsdj6
 * ----------------------------------------------------------------------------------------------
 */

/**
 * User defined parameters
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
    pais: 'BOLIVIA',
    code_region: 21002,  //Region de Clasificacion
    eightConnected: true,
    year: 1986  // Solo visualizacion
};

//------------Versiones---------------------
// Ciclo I
    var version_input= 1
    var version_output= 2
//------------------------------------------


//var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-bolivia/collection-4/modules/CollectionDirectories.js').paths;
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-bolivia/collection-4/modules/directories.js').paths;
//var assetCollection = paths.classificationRaisg;
var assetCollection = paths.classificationRaisg;
var assetRegions = paths.regionVectorRaisg
var assetOutput = paths.clasificacionFiltrosRaisg
var assetOutputMetadata = paths.filtrosMetadataRaisg

var years = [
    1985, 1986, 1987, 1988,
    1989, 1990, 1991, 1992,
    1993, 1994, 1995, 1996,
    1997, 1998, 1999, 2000,
    2001, 2002, 2003, 2004,
    2005, 2006, 2007, 2008,
    2009, 2010, 2011, 2012,
    2013, 2014, 2015, 2016,
    2017, 2018, 2019, 2020, 2021];

var palettes = require('users/mapbiomas/modules:Palettes.js');
var eePalettes = require('users/gena/packages:palettes');
/**
 * User defined functions
 */
var applyGapFill = function (image) {

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
};
/**
 * 
 */
var regions = ee.FeatureCollection(assetRegions)
    .filterMetadata('id_regionC', "equals", param.code_region);

var image = ee.ImageCollection(assetCollection)
    .filterMetadata('code_region', 'equals', param.code_region)
    .filterMetadata('version', 'equals', version_input)
    .min();


// get band names list 
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

//--- inserta pixel 0 para mask---
var classif = ee.Image();
var bandnameReg = image.bandNames();
bandnameReg.getInfo().forEach(
  function (bandName) {
    var imagey = image.select(bandName)
    var band0 = imagey.updateMask(imagey.unmask().neq(27))
    classif = classif.addBands(band0.rename(bandName))
  }
)
image =classif.select(bandnameReg);

// generate a histogram dictionary of [bandNames, image.bandNames()]
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

print(bandsOccurrence);

// insert a masked band 
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                image.select([key]).byte(),
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// convert dictionary to image
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);


// generate image pixel years
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);

// apply the gap fill
var imageFilledtnt0 = applyGapFill(imageAllBands);
var imageFilledYear = applyGapFill(imagePixelYear);

print(imageFilledtnt0);

// add connected pixels bands
var imageFilledConnected = imageFilledtnt0.addBands(
    imageFilledtnt0
        .connectedPixelCount(100, param.eightConnected)
        .rename(bandNames.map(
            function (band) {
                return ee.String(band).cat('_connected')
            }
        ))
);
//print(imageFilledConnected)
/**
* Export images to asset
*/
var imageName = param.pais + '-' + param.code_region + '-' + version_output;

Export.image.toAsset({
    'image': imageFilledConnected.select(bandNames)
        .set('code_region', param.code_region)
        .set('pais', param.pais)
        .set('version', version_output)
        .set('descripcion', 'gapfill')
        .set('paso', 'P04-1'),
    'description': imageName,
    'assetId': assetOutput + '/' + imageName,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': regions.geometry().bounds(),
    'scale': 30,
    'maxPixels': 1e13
});

var imageNameGapFill = param.pais + '-' + param.code_region + '-' + version_output + '-metadata';

Export.image.toAsset({
    'image': imageFilledYear
        .set('code_region', param.code_region)
        .set('pais', param.pais)
        .set('version', version_output)
        .set('descripcion', 'gapfill metadata')
        .set('paso', 'P04-1'),
    'description': imageNameGapFill,
    'assetId': assetOutputMetadata + '/' + imageNameGapFill,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': regions.geometry().bounds(),
    'scale': 30,
    'maxPixels': 1e13
});
/**
* Layers
*/

var vis = {
    'bands': ['classification_' + param.year],
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2'),
    'format': 'png'
};

Map.addLayer(
    image,
    vis,
    'clasificacion original ' + param.year);

Map.addLayer(
    imageFilledConnected.select(bandNames),
    vis,
    'clasificacion gap fill ' + param.year);

Map.addLayer(imageFilledYear,
    {
        'bands': ['classification_' + param.year],
        'min': 1985,
        'max': 2018,
        'palette': eePalettes.colorbrewer.YlOrBr[9],
        'format': 'png'
    },
    'image metadata'
);

Map.addLayer(
    regions.style({
        "color": "ff0000",
        "fillColor": "ff000000"
    }),
    {
        "format": "png"
    },
    'Region ' + param.code_region,
    false);