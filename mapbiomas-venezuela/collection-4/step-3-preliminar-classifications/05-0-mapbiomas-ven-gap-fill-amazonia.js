/**
 * PARÁMETROS DE USUARIO
 */
var param = {
  // user
  user: 'Mosaico_Clasification',
  
  // Region de clasificación y país
  regionId: 90203,
  country: 'VENEZUELA',
  
  // Años para corregir
  years: [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014,
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023
  ],

  // Año de visualización
  yearsPreview: [2000, 2005],
  
  // Clases para graficar
  classes: [3, 6, 33],
  
  // Versiones por ciclo
  inputVersion:  1,
  outputVersion: 2
};




/**
 * required modules
 */
var eePalettes = require('users/gena/packages:palettes');
var palettes = require('users/mapbiomas/modules:Palettes.js').get('classification2');
palettes[29] = 'brown';




/**
 * Input data and parameters
 */
var user            = param.user
var regionId        = param.regionId;
var classes         = param.classes;
var country         = param.country;
var eightConnected  = param.eightConnected || true;
var years           = param.years;
var yearsPreview    = param.yearsPreview;
var inputVersion    = param.inputVersion;
var outputVersion   = param.outputVersion;
var assetRegions    = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4';
var assetCollection = 'users/' + user + '/CURSO-PRACTICO-MAPBIOMAS/clasificacion/';
var assetOutput     = 'users/' + user + '/CURSO-PRACTICO-MAPBIOMAS/clasificacion-ft/';




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
        currentImage = currentImage.unmask(previousImage.select([0]));

        return currentImage.addBands(previousImage);
      },
      ee.Image(image.select([bandNames.get(0)]))
    );

  imageFilledt0tn = ee.Image(imageFilledt0tn);


  // apply the gap fill form tn until t0
  var bandNamesReversed = bandNames.reverse();

  var imageFilledtnt0 = bandNamesReversed.slice(1)
    .iterate(
      function (bandName, previousImage) {

        var currentImage = imageFilledt0tn.select(ee.String(bandName));
        previousImage = ee.Image(previousImage);

        currentImage = currentImage
          .unmask(previousImage
            .select(previousImage.bandNames().length().subtract(1))
          );

        return previousImage.addBands(currentImage);

      },
      ee.Image(imageFilledt0tn.select([bandNamesReversed.get(0)]))
    );


  imageFilledtnt0 = ee.Image(imageFilledtnt0).select(bandNames);

  return imageFilledtnt0;
};




/**
 * Implementation
 */
var regions = ee.FeatureCollection(assetRegions)
    .filterMetadata('id_regionC', "equals", regionId);

var image = ee.Image(assetCollection + country + '-' + regionId + '-' + inputVersion);

var bandNames = ee.List(
  years.map(
    function (year) { return 'classification_' + year.toString() }
  )
);




// Inserta pixel 0 para mask
var classif = ee.Image();
var bandnameReg = image.bandNames();
bandnameReg.getInfo().forEach(
  function (bandName) {
    var imagey = image.select(bandName);
    var band0  = imagey.updateMask(imagey.unmask().neq(27));
    classif = classif.addBands(band0.rename(bandName));
  }
);
image = classif.select(bandnameReg);




// generate a histogram dictionary of [bandNames, image.bandNames()]
var bandsOccurrence = ee.Dictionary(
  bandNames
    .cat(image.bandNames())
    .reduce(ee.Reducer.frequencyHistogram())
);




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
    .connectedPixelCount(100, eightConnected)
    .rename(bandNames.map(
      function (band) { return ee.String(band).cat('_connected') }
    ))
);




/**
 * Export images to asset
 * Display data to map
 */
var imageName = country + '-' + regionId + '-' + outputVersion;
var imageNameGapFill = imageName + '-metadata';
print("Output:", assetOutput + imageName)

Export.image.toAsset({
  image: imageFilledConnected.select(bandNames)
    .set({
      code_region: regionId,
      pais: country,
      version: outputVersion,
      descripcion: 'gapfill',
      paso: 'P05'
    }),
  description: imageName,
  assetId: assetOutput + imageName,
  pyramidingPolicy: {'.default': 'mode'},
  region: regions.geometry().bounds(),
  scale: 30,
  maxPixels: 1e13
});


var vis = {
  'min': 0,
  'max': 34,
  'palette': palettes,
  'format': 'png'
};

yearsPreview.forEach(function(yearPreview) {
  var name = 'classification_' + yearPreview;
  var original = image.select(name);
  var filled = imageFilledConnected.select(name);
  
  Map.addLayer(original, vis, 'ORIGINAL ' + yearPreview, false);
  Map.addLayer(filled, vis, 'GAP FILL ' + yearPreview);
  
  Export.image.toDrive({
    image: imageFilledConnected.select(name),
    description: imageName + '-' + yearPreview + '-DRIVE',
    folder: 'DRIVE-EXPORT',
    region: regions.geometry().bounds(),
    scale: 30,
    maxPixels: 1e13
  });
});


Map.addLayer(
  regions.style({
    "color": "ff0000",
    "fillColor": "cyan"
  }),
  {
    "format": "png"
  },
  'Region ' + regionId,
  false
);


// graficos
classes.forEach(function(id) {
  imgchart(image, regions, 'ORIGINAL ', id);
  imgchart(imageFilledConnected.select(bandNames), regions, 'FILTERED ', id);
});



/**
 * Chart maker
 */
function imgchart(image, region, title, classId) {
  var classImg = image
    .eq(classId)
    .multiply(9e2)
    .divide(1e6);
  
  var graphic = ui.Chart.image.regions({
    image: classImg,
    regions: region,
    reducer: ee.Reducer.sum(),
    scale: 30,
    seriesProperty: 'year',
    xLabels: ee.List.sequence(1985, 2021)
      .getInfo()
      .map(function(year) { return year.toString() })
  })
  .setChartType('LineChart')
  .setOptions({
    title: title + '-' + classId,
    height: '300px',
    hAxis: {
      slantedText: true,
      slantedTextAngle: 90,
    },
    vAxis: {
      title: 'Area km2',
    },
    series: {
      0: {color: '0f8755', pointSize: 4, lineDashStyle: [4, 4]}
    },
  });

  print(graphic);
}
