/**
 * PARÁMETROS DE USUARIO
 */
var param = {
  user: 'Mosaico_Clasification',
  regionId: 90203,
  pais: 'VENEZUELA',
  classes: [3, 6],                    // clases para graficar
  yearsPreview: [1991, 1985, 2020],
  driveFolder: 'DRIVE-EXPORT',        // carpeta a exportar archivo drive
  exclusion:{ 
    clases : [12, 33],                // lista de clases a excluir en todos los años
    years  : [],                      // lista de años a excluir con todas la clases
  },
  interval: null,
  inputVersion: 2,
  outputVersion: 3
};


//---------------------ORDEN DE PRIORIDAD DE EJECUCIÓN-----------------------
// Ejemplo si se pasa 3  caso: FF NV FF NV FF NV FF =  FF FF FF FF FF FF FF   La prioridad de mantener la clase será la clase a pasar primero
var ordem_exec_first =  [3, 6, 12, 11, 13];                  //Filtro de primer año
var ordem_exec_last =   [25];                                //Filtro de ultimo año
var ordem_exec_middle = [33, 13, 4, 29, 25, 3, 12, 22, 34];  //Filtro de años intermedios

//--------------------------------------------

var user = param.user;
var country = param.pais;
var classes = param.classes;
var interval = param.interval || null;
var driveFolder = param.driveFolder;
var regionId = param.regionId;
var inputVersion = param.inputVersion;
var outputVersion = param.outputVersion;
var fullRegion = country + '-' + regionId;
var years = ee.List.sequence(1985, 2023).getInfo();
var yearsPreview = param.yearsPreview;


// Input data
var outputDir = 'users/' + user + '/CURSO-PRACTICO-MAPBIOMAS/clasificacion-ft/';
var dirInput  = 'users/' + user + '/CURSO-PRACTICO-MAPBIOMAS/clasificacion-ft/' + country + '-' + regionId + '-' + inputVersion;
var regions = {
  vector: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
  raster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4'
};


var regioes = ee.FeatureCollection(regions.vector)
  .filterMetadata("id_regionC","equals", regionId);

var image_FE = ee.Image(dirInput);


print(image_FE);




// get band names list 
function defineBandNames(year) { return 'classification_' + String(year) }
var bandNames = ee.List(years.map(defineBandNames));
var bandNamesToExclude = ee.List(param.exclusion.years.map(defineBandNames));



// Completar años faltantes con banda 0 (zero band)
var zeroBand = ee.Image(0)
  .updateMask(image_FE.select([bandNames.get(0)]).neq(0));

var bandsOccurrence = ee.Dictionary(
    bandNames
      .cat(image_FE.bandNames())
      .reduce(ee.Reducer.frequencyHistogram())
);

var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                image_FE.select([key]).byte(),
                ee.Image().rename([key]).byte().updateMask(image_FE.select(0))
            )
        );
    }
);

var classification = ee.Image(bandNames.iterate(
  function(band, image){
    var imageBand = ee.Image(bandsDictionary.get(ee.String(band)));

    zeroBand = zeroBand.where(imageBand.gte(0), imageBand).rename([band]);

    return ee.Image(image).addBands(zeroBand);
  },
  ee.Image().select()
));

image_FE = classification.select(bandNames);



// Setup temporal masks 
var mask3 = function(valor, year, imagem){
  var yearPrev = parseInt(year, 10) - 1;
  var yearNext1 = parseInt(year, 10) + 1;
  
  var mask = imagem
    .select('classification_' + yearPrev).eq(valor)
    .and(imagem.select('classification_' + year).neq(valor))
    .and(imagem.select('classification_' + yearNext1).neq(valor));

  var muda_img = imagem.select('classification_'+ year)
    .mask(mask.eq(1)).where(mask.eq(1), valor);  
  
  return imagem.select('classification_' + year)
    .blend(muda_img);
};


var mask4 = function(valor, year, imagem){
  var yearPrev = parseInt(year, 10) - 1;
  var yearNext1 = parseInt(year, 10) + 1;
  var yearNext2 = parseInt(year, 10) + 2;

  var mask = imagem
    .select('classification_' + yearPrev).eq(valor)
    .and(imagem.select('classification_' + year).neq(valor))
    .and(imagem.select('classification_'+ yearNext1).neq(valor))
    .and(imagem.select('classification_'+ yearNext2).neq(valor));
  
  var muda_img  = imagem.select('classification_' + year)
    .mask(mask.eq(1)).where(mask.eq(1), valor);
    
  var muda_img1 = imagem.select('classification_' + yearNext1)
    .mask(mask.eq(1)).where(mask.eq(1), valor); 
  
  return imagem.select('classification_' + year)
    .blend(muda_img).blend(muda_img1);
};


var mask5 = function(valor, year, imagem) {
  var yearPrev = parseInt(year, 10) - 1;
  var yearNext1 = parseInt(year, 10) + 1;
  var yearNext2 = parseInt(year, 10) + 2;
  var yearNext3 = parseInt(year, 10) + 3;
  
  var mask = imagem
    .select('classification_' + yearPrev).eq(valor)
    .and(imagem.select('classification_' + year).neq(valor))
    .and(imagem.select('classification_'+ yearNext1).neq(valor))
    .and(imagem.select('classification_'+ yearNext2).neq(valor))
    .and(imagem.select('classification_'+ yearNext3).eq (valor));
        
  var muda_img  = imagem.select('classification_' + year)
    .mask(mask.eq(1)).where(mask.eq(1), valor);
  
  var muda_img1 = imagem.select('classification_' + yearNext1)
    .mask(mask.eq(1)).where(mask.eq(1), valor);  
  
  var muda_img2 = imagem.select('classification_' + yearNext2)
    .mask(mask.eq(1)).where(mask.eq(1), valor);  
  
  return imagem.select('classification_'+ year)
    .blend(muda_img).blend(muda_img1).blend(muda_img2);
};


var window5years = function(imagem, valor){
  var img_out = imagem.select('classification_1985');
  
  for (var year = 1986; year < 2021; year++){
    img_out = img_out.addBands(mask5(valor, year, imagem));
  }
  
  return img_out
    .addBands(imagem.select(
      ['classification_2021', 'classification_2022', 'classification_2023']
    ));
};


var window4years = function(imagem, valor){
  var img_out = imagem.select('classification_1985');
  
  for (var year = 1986; year < 2022; year++){  
    img_out = img_out.addBands(mask4(valor, year, imagem));
  }
   
  return img_out
    .addBands(imagem.select(
      ['classification_2022', 'classification_2023']
    ));
};


var window3years = function(imagem, valor){
  var img_out = imagem.select('classification_1985');

  for (var year = 1986; year < 2023; year++){
    img_out = img_out.addBands(mask3(valor, year, imagem));
  }

  return img_out
    .addBands(imagem.select('classification_2023'));
};


var mask3first = function(valor, imagem){
  var bands = [];
  
  for(var i = 1986; i < 2022; i++) bands.push('classification_' + i);
  
  var mask = imagem.select('classification_1985').neq (valor)
        .and(imagem.select('classification_1986').eq(valor))
        .and(imagem.select('classification_1987').eq (valor));
  
  var muda_img = imagem.select('classification_1985')
    .mask(mask.eq(1)).where(mask.eq(1), valor);  
  
  var img_out = imagem.select('classification_1985')
    .blend(muda_img)
    .addBands(imagem.select(bands));

  return img_out;
};


var mask3last = function(valor, imagem){
  var bands = [];
  
  for(var i = 1986; i < 2023; i++) bands.push('classification_' + i);

  var mask = imagem.select('classification_2019').eq (valor)
        .and(imagem.select('classification_2020').eq(valor))
        .and(imagem.select('classification_2021').neq (valor));
  
  var muda_img = imagem.select('classification_2023')
        .mask(mask.eq(1)).where(mask.eq(1), valor);
        
  var img_out = imagem
    .select('classification_1985')
    .addBands(imagem.select(bands))
    .addBands(imagem.select('classification_2023')
    .blend(muda_img));
    
  return img_out;
};


// Implementación
var filtered = image_FE;

for (var i = 0; i < ordem_exec_first.length; i++){  
   var id_class = ordem_exec_first[i];
   filtered = mask3first(id_class, filtered);
}

for (var i = 0; i < ordem_exec_last.length; i++){  
   var id_class = ordem_exec_last[i]; 
   filtered = mask3last(id_class, filtered);
}


if(interval) {
  if(interval === 3) {
    for (var i = 0; i < ordem_exec_middle.length; i++){  
       var id_class = ordem_exec_middle[i]; 
       filtered = window3years(filtered, id_class);
    }
  }
  
  if(interval === 4) {
    for (var i = 0; i < ordem_exec_middle.length; i++){  
       var id_class = ordem_exec_middle[i]; 
       filtered = window4years(filtered, id_class);
    }
  }
  
  if(interval === 5) {
    for (var i = 0; i < ordem_exec_middle.length; i++){  
       var id_class = ordem_exec_middle[i]; 
       filtered = window5years(filtered, id_class);
    }
  }
}
else {
  for (var i = 0; i < ordem_exec_middle.length; i++){  
     var id_class = ordem_exec_middle[i]; 
     filtered = window3years(filtered, id_class);
  }
  
  for (var i = 0; i < ordem_exec_middle.length; i++){  
     var id_class = ordem_exec_middle[i]; 
     filtered = window4years(filtered, id_class);
     filtered = window5years(filtered, id_class);
  }
}



// Excluir clases y años 
if(param.exclusion.clases.length>0){
   var classification = ee.List([]);
      
  param.exclusion.clases.forEach(function(clase){
    var coverClass = image_FE.eq(clase).selfMask();
    classification = classification
      .add(image_FE.updateMask(coverClass).selfMask());
  });
      
  classification = ee.ImageCollection(classification).max();
  filtered = filtered.blend(classification);
  
  Map.addLayer(classification, {}, 'CLASES EXCLUIDAS');
  print('Clases excluidos en el filtro temporal', param.exclusion.clases);
}


if(param.exclusion.years.length > 0){
  var yearExlud = image_FE.select(bandNamesToExclude);  //addbands
  filtered = filtered.addBands(yearExlud,null,true); // Remplaza las clases a no modificar
  print('Años excluidos en el Filtro temporal', param.exclusion.years);
}



// Visualizaciones  
filtered = filtered.select(bandNames)
  //.updateMask(regioesRaster)
  .set('code_region', regionId)
  .set('pais', param.pais)
  .set('version', outputVersion)
  .set('descripcion', 'filtro temporal')
  .set('paso', 'P4');

var palette = require('users/mapbiomas/modules:Palettes.js').get('classification2');
palette[29] = 'brown';


Map.setOptions('SATELLITE');
yearsPreview.forEach(function(yearPreview){
  var vis = { 
    bands: ['classification_' + yearPreview],
    min: 0, max: 34, 
    palette: palette
  };

  Map.addLayer(image_FE, vis, 'ORIGINAL ' + yearPreview, false);
  Map.addLayer(filtered, vis, 'FILTERED ' + yearPreview, false);
});


// Graficos
classes.forEach(function(id) {
  imgchart(image_FE, regioes, 'ORIGINAL ', id);
  imgchart(filtered, regioes, 'FILTERED ', id);
});




// Exports
var outputName = fullRegion + '-' + outputVersion;

Export.image.toAsset({
  'image': filtered,
  'description': outputName,
  'assetId': outputDir + outputName,
  'pyramidingPolicy': {
      '.default': 'mode'
  },
  'region': regioes.geometry().bounds(),
  'scale': 30,
  'maxPixels': 1e13
});
  

if(driveFolder !== ''){
  Export.image.toDrive({
    image: filtered.toInt8(),
    description: outputName + '-DRIVE',
    folder: driveFolder,
    scale: 30,
    maxPixels: 1e13,
    region: regioes.geometry().bounds()
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
