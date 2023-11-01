/**
 * 
 */
var param = {
  user: 'Mosaico_Clasification',
  regionId: 90203,
  country: 'VENEZUELA',
  eightConnected: true,
  yearPreview: 2000,                // Año de visualización
  driveFolder: 'RAISG-EXPORT',
  exclusion:{                       
    clases : [14],                  // Lista de clases a excluir en todos los años
    years  : [],                    // Lista de años a excluir con todas la clases
  },
  minConnectedPixels: 5,
  classIds: [3, 12, 33]
};


// Params
var user          = param.user;
var classIds      = param.classIds;
var minConnectPx  = param.minConnectedPixels;
var country       = param.country;
var driveFolder   = param.driveFolder;
var regionId      = param.regionId;
var inputVersion  = param.inputVersion || 3;
var outputVersion = param.outputVersion || 4;
var fullRegion    = country + '-' + regionId;
var years         = ee.List.sequence(1985, 2023).getInfo();
var yearPreview   = param.yearPreview;



// Input data
var outputDir  = 'users/' + user + '/CURSO-PRACTICO-MAPBIOMAS/clasificacion-ft/';
var inputAsset = 'users/' + user + '/CURSO-PRACTICO-MAPBIOMAS/clasificacion-ft/' + fullRegion + '-' + inputVersion;
var regions = {
  vector: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
  raster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4'
};

var region = ee.FeatureCollection(regions.vector)
  .filterMetadata("id_regionC","equals", regionId);
  
var class4FT = ee.Image(inputAsset);

print(class4FT);


    
// Get band names lists
function defineBandNames(year) { return 'classification_' + String(year) }
var bandNames = ee.List(years.map(defineBandNames));
var bandNamesToExclude = ee.List(param.exclusion.years.map(defineBandNames));



// Connected pixels bands
var imageFilledConnected = class4FT.addBands(
  class4FT
    .connectedPixelCount(100, param.eightConnected)
    .rename(bandNames.map(
      function (band) { return ee.String(band).cat('_connected') }
    ))
);

print('Filled connected', imageFilledConnected);



// Filtro espacial
var class_outTotal = ee.Image(0)
  .updateMask(class4FT.select([bandNames.get(0)]).neq(0));

years.forEach(function(year){  
  var image = imageFilledConnected.select('classification_' + year);
  var connected = imageFilledConnected.select('classification_' + year + '_connected');
  
  var moda = image
    .focal_mode(1, 'square', 'pixels')
    .mask(connected.lte(minConnectPx));
    
  var class_out = image.blend(moda);
  
  class_outTotal = class_outTotal.addBands(class_out);
  
  return class_outTotal
});

var classif_FS = class_outTotal.select(bandNames);



// Excluir clases y años 
if(param.exclusion.clases.length > 0) {
  var classification = ee.List([]);
  class4FT = class4FT.select(bandNames);
   
  param.exclusion.clases.forEach(function(clase){
    var coverClass = class4FT.eq(clase).selfMask();
    classification = classification
      .add(class4FT.updateMask(coverClass).selfMask());
  });
      
  classification = ee.ImageCollection(classification).max();
  classif_FS = classif_FS.blend(classification);
  
  Map.addLayer(classification,{},'CLASE EXCLUIDA');
  print('Clases excluidos', param.exclusion.clases);
}

if(param.exclusion.years.length >0) {
  var yearsToExlude = class4FT.select(bandNamesToExclude);
  classif_FS =  classif_FS.addBands(yearsToExlude, null, true);
  print('Años excluidos en el filtro espacial', param.exclusion.years);
}



// Visualizaciones
class_outTotal = classif_FS.select(bandNames)
  .set('code_region', regionId)
  .set('pais', country)
  .set('version', outputVersion)
  .set('descripcion', 'filtro espacial')
  .set('paso', 'P11');
            
print('Result', class_outTotal);

var palette = require('users/mapbiomas/modules:Palettes.js').get('classification2');
palette[29] = 'brown';

var vis = { min: 0, max: 34, palette: palette, format: 'png'};

var selector = 'classification_' + yearPreview;

Map.addLayer(class4FT.select(selector), vis, 'ORIGINAL ' + yearPreview);

Map.addLayer(class_outTotal.select(selector), vis, 'FILTERED ' + yearPreview);



// graficos
classIds.forEach(function(id) {
  imgchart(class4FT, region, 'ORIGINAL ', id);
  imgchart(class_outTotal, region, 'FILTERED ', id);
});





// Exports
var outputName = fullRegion + '-' + outputVersion;

Export.image.toAsset({
  'image': class_outTotal,
  'description': outputName,
  'assetId': outputDir + outputName,
  'pyramidingPolicy': {
      '.default': 'mode'
  },
  'region': region.geometry().bounds(),
  'scale': 30,
  'maxPixels': 1e13
});


if(driveFolder !== ''){
  Export.image.toDrive({
    image: class_outTotal.toInt8(),
    description: outputName + '-DRIVE',
    folder: driveFolder,
    scale: 30,
    maxPixels: 1e13,
    region: region.geometry().bounds()
  });
}






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
