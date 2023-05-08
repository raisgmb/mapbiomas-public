// LIMPIEZA POR PIXEL ESTABLE Y CAPAS REFERENCIA MINAM Y MINAGRI
// se excluye el año 2021
// Aplicado por region de clasificacion

var param = {
    ID_pais: 8,
    pais: 'PERU',
    region: 70206,
    year: 2019,          // Solo visualizacion
    version_input: 1,
    version_output:4,
    clase_destino: 21,    // Destino del no bosque MINAM 
    periodo: [2000,2020], // Indicar el periodo para el remap aplicado solo para remap MINAM
    dist_buffer: 90,       // metros
    use_stablePixel: false //condicionar remap pixel estable aplicado para todos los años
};

var palettes = require('users/mapbiomas/modules:Palettes.js');
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
var assetClasif = paths.classificationRaisg;
var assetFiltros = paths.clasificacionFiltrosRaisg
var dirout  = paths.clasificacionFiltrosRaisg
var regionesclass = paths.regionVectorBuffer
var pathpixelstable = 'projects/mapbiomas-raisg/MUESTRAS/'+ param.pais + '/COLECCION4/MUESTRAS_ESTABLES/muestras-estables/ME-' + param.pais  +'-' + param.region + '-1'

var assetMosaic =  'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2';
var assetCountries = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-2';
var assetBosqueMINAM = "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per_bosque_no_bosque_2020" //2020
var assetAgriMINAGRI = "projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per_midagri2020" //2020
var GlobalSurfaceWater = ee.Image("JRC/GSW1_3/GlobalSurfaceWater")
              .select('occurrence')
              .gte(0).selfMask()
GlobalSurfaceWater = ee.Image(0).where(GlobalSurfaceWater, 1);

var region = ee.FeatureCollection(regionesclass).filterMetadata('id_regionC', 'equals', param.region)
Map.addLayer(region,{},'region',false)

var palettes = require('users/mapbiomas/modules:Palettes.js');
var pal = palettes.get('classification2');
var vis = {
      bands: 'classification_'+param.year,
      min:0,
      max:34,
      palette: pal,
      format: 'png'
    };

var setVersion = function(item) { return item.set('version', 1) };
var regioesRaster = region
                      .map(setVersion)
                      .reduceToImage(['version'], ee.Reducer.first());
                      
var pixelstable = ee.Image(pathpixelstable).updateMask(regioesRaster)
print(pixelstable)

var Classif_Input
if(param.version_input == 1 || param.version_input == 3){
    var assetPath = assetClasif + '/' + param.pais + '-' + param.region;
    Classif_Input = ee.Image(assetPath  + '-' + param.version_input);
   } else {
    Classif_Input = ee.ImageCollection(assetFiltros)
              .filterMetadata('code_region', 'equals', param.region)
              .filterMetadata('version', 'equals', param.version_input)
              .min();
   }
var class_origin = Classif_Input;
//*******************Limpieza con pixel estable col3*************************
if(param.use_stablePixel){
    Map.addLayer(Classif_Input.updateMask(regioesRaster)
            .reproject('EPSG:4326', null, 30), 
            vis, 'Clasif-Col4-Original'+param.year, false);  
            
    Classif_Input = Classif_Input.where(pixelstable.eq(3).and(Classif_Input.eq(21)), 3) 
                                 .where(pixelstable.eq(3).and(Classif_Input.eq(25)), 3)
                                 .where(pixelstable.eq(21), 21)
                                // .updateMask(regioesRaster)
                                 
    //  ajustado
    Classif_Input = Classif_Input.addBands(class_origin.select('classification_2021'),null,true).updateMask(regioesRaster)

    Map.addLayer(Classif_Input
            .reproject('EPSG:4326', null, 30), 
            vis, 'Clasif-Col4-Remap-PixEst-'+param.year, false);               
}

//***************************************************************************************

var country = ee.FeatureCollection(assetCountries).filterMetadata('name', 'equals', 'Perú');

var Bosque_No_Bosque_2020_MINAM = ee.Image(assetBosqueMINAM)
                                  .remap([1,2,3,4,5],[0,param.clase_destino,3,33,param.clase_destino])
                                  .rename('Bosque_2020_MINAM')
                                  .updateMask(regioesRaster);

var Agricultura_2020 = ee.Image(assetAgriMINAGRI)
                                  .remap([0,1],[27,21])
                                  .rename('Agricultura_2020_MINAGRI')
                                  .updateMask(regioesRaster);
                                  
var Bosque_No_Bosque_Ref_2020 = Bosque_No_Bosque_2020_MINAM.where(Agricultura_2020.eq(21), param.clase_destino)

// spatial filtrer mask
var conect = Bosque_No_Bosque_Ref_2020.connectedPixelCount(100).rename('connected')
var moda = Bosque_No_Bosque_Ref_2020.select(0).focal_mode(1, 'square', 'pixels')
moda = moda.mask(conect.select('connected').lte(5))
Bosque_No_Bosque_Ref_2020 = Bosque_No_Bosque_Ref_2020.select(0).blend(moda)

//--
var years = []
for (var y = param.periodo[0]; y <= param.periodo[1]; y++) {years.push(y)}

var bandNamesPeriodo = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

print('hey',bandNamesPeriodo)
 
//buffer around 
var No_Bosque_2020 = Bosque_No_Bosque_Ref_2020.eq(param.clase_destino)
                                                    .or(Bosque_No_Bosque_Ref_2020.eq(5));
var buffer = ee.Image(1)
    .cumulativeCost({
      source: No_Bosque_2020, 
      maxDistance: param.dist_buffer,
    }).lt(param.dist_buffer);
    
buffer = ee.Image(0).where(buffer.eq(1), 1).clip(country)
var Classif_InputRemap =  Classif_Input.select(bandNamesPeriodo)
                                        .where(Classif_Input.select(bandNamesPeriodo).eq(21)
                                                .and(Bosque_No_Bosque_Ref_2020.eq(3))
                                                .and(buffer.neq(1)), 3)
                                        .where(Classif_Input.select(bandNamesPeriodo).eq(22)
                                                .and(Bosque_No_Bosque_Ref_2020.eq(3))
                                                .and(buffer.neq(1)), 3)
                                        .where(Classif_Input.select(bandNamesPeriodo).eq(3)
                                                .and(Bosque_No_Bosque_Ref_2020.eq(param.clase_destino))
                                                .and(buffer.neq(1)), param.clase_destino);

Classif_InputRemap = Classif_Input.addBands(Classif_InputRemap, null, true)
Classif_InputRemap = Classif_InputRemap.where(Classif_InputRemap.eq(21)
                                              .and(GlobalSurfaceWater.neq(1)), 18)

var remapDif = Classif_InputRemap.select('classification_'+param.year)
              .neq(Classif_Input.select('classification_'+param.year))  

var mosaicRegion = param.region.toString().slice(0, 3);
var collMosaic = ee.ImageCollection(assetMosaic)
            .filterMetadata('region_code', 'equals', Number(mosaicRegion))
            .select(['swir1_median', 'nir_median', 'red_median'])
            .filterMetadata('year', 'equals', param.year);
            
Map.addLayer(collMosaic.mosaic().updateMask(regioesRaster), {
        'bands': ['swir1_median', 'nir_median', 'red_median'],
        "min":150,
        "max":4700,
   }, 'Mosaic-'+param.year, false)
   
if(param.use_stablePixel !== true){
Map.addLayer(Classif_Input.updateMask(regioesRaster)
            .reproject('EPSG:4326', null, 30), 
            vis, 'Clasif-Col4-Original-'+param.year, true);
}


Map.addLayer(Classif_InputRemap.updateMask(regioesRaster)
            .reproject('EPSG:4326', null, 30), 
            vis, 'Clasif-Remap-MINAM-Col4-'+param.year, true);
Map.addLayer(Bosque_No_Bosque_2020_MINAM
            .reproject('EPSG:4326', null, 30), 
            {min:0, max:34, palette: pal}, 'Bosque_No_Bosque_MINAM-2020', false) 
Map.addLayer(Bosque_No_Bosque_Ref_2020
            .reproject('EPSG:4326', null, 30), 
            {min:0, max:34, palette: pal}, 'Bosque_No_Bosque_ref-2020', false) 
Map.addLayer(buffer.mask(buffer).updateMask(regioesRaster)
            .reproject('EPSG:4326', null, 30), 
            {min: 0, max: 1, palette: ['39ffda'], opacity:0.5}, 'Bosque_No_Bosque_ref_2020_buffer'+param.dist_buffer+'m', false);
Map.addLayer(remapDif.updateMask(remapDif)
            .reproject('EPSG:4326', null, 30), 
            {max:1, min:0, palette:['ff0000']}, 'Pixeles con REMAP', false);
            
Map.addLayer(GlobalSurfaceWater, {palette:['red']})
// // TODOS LOS AÑOS
// for (var year = 1985; year <= 2018; year++) {

//     Map.addLayer(collMosaic.filterMetadata('year', 'equals', year).mosaic().clip(country), {
//         'bands': ['swir1_median', 'nir_median', 'red_median'],
//         'gain': [0.08, 0.06, 0.3],
//         'gamma': 0.5
//     },
//         'Mosaic ' + String(year), false);

//     var palettes = require('users/mapbiomas/modules:Palettes.js');

//     Map.addLayer(Classif_InputRemap, {
//         'bands': ['classification_' + String(year)],
//         'palette': palettes.get('classification2'),
//         'min': 0,
//         'max': 34
//     }, 'Classification ' + String(year), false);
// }

Classif_InputRemap = Classif_InputRemap.updateMask(regioesRaster)
          .set('code_region', param.region)
          .set('pais', param.pais)
          .set('version', param.version_output)
          .set('descripcion', 'filtro bosque')
          .set('paso', 'P14');
          
print(Classif_InputRemap)


var prefijo_out = param.pais+ '-' + param.region + '-' +  param.version_output;

Export.image.toAsset({
    'image': Classif_InputRemap,
    'description': prefijo_out,
    'assetId': dirout+'/'+prefijo_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': region.geometry().bounds(),
    'scale': 30,
    'maxPixels': 1e13
});






// APUNTES REF
// Script de recuperacion de pixeles estables
//  recuperar los pixeles estables de la coll 3 y remplazaria a la col4
//  col3 estable clase 3, col4 estable clase 12.   revisar
//  col3 estable clase 3, col4 no estable clase 12.   remplaza la col 3

//preferencia bosque y agricultura
