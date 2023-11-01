var user = 'Mosaico_Clasification'; 


/**
 * PARÁMETROS DE USUARIO
 */
var param = {
  regionId: 90203,
  country: "VENEZUELA",
  years: [2019, 2021],
  inputVersion: 3,
  outputVersion: 5,
  classes: [3, 6, 11, 12, 13, 33],
  naturalVegetation: 50,   // % minimo vegetación natural para ser considerado en el filtro de frecuencia
  majorityPercent:   50,   // % mayoritario para que prevalezca una clase
  driveFolder: "DRIVE-EXPORT",
  exclusion: {
    classes: [25], // Lista de clases a excluir en todos los años
    years: [], // Lista de años a excluir con todas la clases
  },
  excludeFirstLastYear: true, // Para no aplicar filtro en los primeros y ultimos años con clases continuas
};

// Params
var regionId = param.regionId;
var years = param.years;
var country = param.country;
var inputVersion = param.inputVersion;
var outputVersion = param.outputVersion;
var classes = param.classes;
var driveFolder = param.driveFolder;
var exclusion = param.exclusion;
var excludeFirstLastYear = param.excludeFirstLastYear;
var naturalVegetation = param.naturalVegetation;
var majorityPercent = param.majorityPercent;
var assetName = country + "-" + regionId;
var exclusionYears = param.exclusion.years;

// Inputs
var palettes = require("users/mapbiomas/modules:Palettes.js");
var assetMosaics = "projects/mapbiomas-raisg/MOSAICOS/mosaics-2";
var basePath = 'users/' + user + '/CURSO-PRACTICO-MAPBIOMAS/clasificacion-ft/';
var vectorRegions = "projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4";
var rasterRegions = "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4";



// Clasification region
var region = ee
  .FeatureCollection(vectorRegions)
  .filterMetadata("id_regionC", "equals", regionId)
  .map(function(item) { return item.set('version', 1) });


// Mosaics and input asset
var input = basePath + assetName + "-" + inputVersion;
var classification = ee.Image(input);

var mosaicRegion = parseInt(regionId.toString().slice(0, 3), 10);
var mosaic = ee.ImageCollection(assetMosaics)
  .filterMetadata("region_code", "equals", mosaicRegion)
  .select(["swir1_median", "nir_median", "red_median"]);

// Get band names list
var allYears = ee.List.sequence(1985, 2021).getInfo();
var bandNames = allYears.map(function (item) {
  item = ee.String(ee.Number(item).toInt16());
  return ee.String("classification_").cat(item);
});

var bandsExclude = exclusionYears.map(function (year) {
  return "classification_" + year;
});

classification = classification.select(bandNames);


// Colors
var palette = require("users/mapbiomas/modules:Palettes.js").get("classification2");
palette[29] = 'brown';

var filtrofreq = function (image) {
  // General rule
  var exp =
    "100*((b(0)+b(1)+b(2)+b(3)+b(4)+b(5)+b(6)" +
    "+b(7)+b(8)+b(9)+b(10)+b(11)+b(12)+b(13)+b(14)+b(15)" +
    "+b(16)+b(17)+b(18)+b(19)+b(20)+b(21))/22 )";

  // get frequency
  var frequency = ee.Image(0);

  classes.forEach(function (classId) {
    var frequencyClass = image
      .eq(classId)
      .expression(exp)
      .rename("class" + classId);

    frequency = frequency.addBands(frequencyClass);
  });

  // Frequency mask (freq >%)
  var vegetationMask = frequency.reduce("sum");
  vegetationMask = ee.Image(0).where(vegetationMask.gt(naturalVegetation), 1);

  // Reclassification based on classes frequencies
  var vegetationMap = ee.Image(0);
  classes.forEach(function (classId) {
    var frequencyClass = frequency.select("class" + classId);

    vegetationMap = vegetationMap.where(
      vegetationMask.eq(1).and(frequencyClass.gt(majorityPercent)),
      classId
    );
  });

  vegetationMap = vegetationMap.updateMask(vegetationMap.neq(0));
  return image.where(vegetationMap, vegetationMap);
};

var filtered = filtrofreq(classification);

var class_col2 = classification;

// SELECT THE CLASS OF THE FIRST YEAR TO BE REPEATED NEXT YEAR
var t0 = 1985;
var t1 = 2021;

bandNames = ee.List(bandNames);
var firstYearSelect = bandNames.iterate(function (bandName, previousImage) {
  var currentImage = classification.select(ee.String(bandName));

  previousImage = ee.Image(previousImage);

  currentImage = currentImage
    .eq(previousImage.select(0))
    .multiply(currentImage);

  return ee.Image(previousImage).addBands(currentImage);
}, ee.Image(classification.select([bandNames.get(0)])));

firstYearSelect = ee.Image(firstYearSelect).select(bandNames);

var firstYearContinuity = function (year, previousImage) {
  var currentImage = firstYearSelect.select(ee.Number(year).subtract(t0));
  var num = ee.Number(year).subtract(t0);

  previousImage = ee.Image(previousImage);
  currentImage = currentImage.where(previousImage.select(num).eq(0), 0);

  return ee.Image(previousImage).addBands(currentImage);
};

var firstYear = ee
  .Image(
    ee.List.sequence(t0, t1).iterate(
      firstYearContinuity,
      firstYearSelect.select(0)
    )
  )
  .select(bandNames);
  

// SELECT THE CLASS OF THE LAST YEAR TO BE REPEATED NEXT YEAR
var nImages = bandNames.size();

var lastYearSelect = bandNames
  .iterate(function (bandName, previousImage) {
    var currentImage = classification.select(ee.String(bandName));
    previousImage = ee.Image(previousImage);
    
    currentImage = currentImage
      .eq(previousImage.select(0))
      .multiply(currentImage);
    
    return ee.Image(previousImage).addBands(currentImage);
  }, 
  ee.Image(
    classification.select([bandNames.get(nImages.add(-1))])
  )
);

lastYearSelect = ee.Image(lastYearSelect).select(bandNames);

var lastYearSelectReverse = lastYearSelect.select(bandNames.reverse());

var lastYearContinuityRev = function (year, previousImage) {
  var currentImage = lastYearSelectReverse.select(ee.Number(year).subtract(t0));

  previousImage = ee.Image(previousImage);

  var num = ee.Number(year).subtract(t0);
  currentImage = currentImage.where(previousImage.select(num).eq(0), 0);

  return ee.Image(previousImage).addBands(currentImage);
};

var lastYearRev = ee
  .Image(
    ee.List.sequence(t0, t1).iterate(
      lastYearContinuityRev,
      lastYearSelectReverse.select(0)
    )
  )
  .select(bandNames);

Map.addLayer(lastYearRev, {}, "lastYear_identifi", false);

// No aplicar filtro en los primeros y ultimos años con clases continuas
if (excludeFirstLastYear) {
  var continuityExtremes = firstYear.selfMask().unmask(lastYearRev.selfMask());

  filtered = filtered.blend(continuityExtremes);
}

//Excluir clases y años
var newFiltered = filtered;

if (exclusion.classes.length > 0) {
  var classified = ee.List([]);

  exclusion.classes.forEach(function (classId) {
    var classifiedCode = classification.eq(classId).selfMask();
    classified = classified.add(
      classification.updateMask(classifiedCode).selfMask()
    );
  });

  classified = ee.ImageCollection(classified);
  classified = classified.max();
  newFiltered = newFiltered.blend(classified);

  Map.addLayer(classified, {}, "clasific exclu_classe", false);
  print("Clases excluidos en el Filtro temporal", exclusion.classes);
}

if (exclusion.years.length > 0) {
  var yearExlude = classification.select(bandsExclude);
  newFiltered = newFiltered.addBands(yearExlude, null, true);

  print("Años excluidos en el Filtro temporal", exclusion.years);
}

filtered = newFiltered.select(bandNames)

filtered = filtered
  .set("code_region", param.code_region)
  .set("pais", param.pais)
  .set("version", outputVersion)
  .set("descripcion", "filtro frecuencia")
  .set("paso", "P12");

print(classification);
print(filtered);

Map.addLayer(region, {}, "region", false);

years.forEach(function(year) {
  var vis = {
    bands: "classification_" + year,
    min: 0,
    max: 34,
    palette: palette,
    format: "png",
  };
  
  Map.addLayer(
    mosaic
      .filterMetadata("year", "equals", year)
      .mosaic()
      .updateMask(filtered.select([bandNames.get(0)]).neq(0)),
    {
      bands: ["swir1_median", "nir_median", "red_median"],
      gain: [0.08, 0.06, 0.08],
      gamma: 0.65,
    },
    "MOSAIC-" + year,
    false
  );
  
  Map.addLayer(classification, vis, "ORIGINAL-" + year, false);
  
  Map.addLayer(filtered, vis, "FILTERED-" + year, false);
  
  // Exportar a Google Drive
  if (driveFolder) {
    Export.image.toDrive({
      image: filtered.select("classification_" + year).toInt8(),
      description: assetName + "-DRIVE-" + outputVersion,
      folder: driveFolder,
      scale: 30,
      maxPixels: 1e13,
      region: region.geometry().bounds(),
    });
  }
});


// graficos
classes.forEach(function(id) {
  imgchart(classification, region, 'ORIGINAL ', id);
  imgchart(filtered, region, 'FILTERED ', id);
});


// Exportar asset resultante
Export.image.toAsset({
  image: filtered,
  description: assetName + "-" + outputVersion,
  assetId: basePath + assetName + "-" + outputVersion,
  pyramidingPolicy: {
    ".default": "mode",
  },
  region: region.geometry().bounds(),
  scale: 30,
  maxPixels: 1e13,
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
