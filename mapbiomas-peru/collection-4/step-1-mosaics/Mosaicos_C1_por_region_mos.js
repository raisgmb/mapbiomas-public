/*
Visualizar mosaicos guardados en asset por región y pais
y realiza el la unión de cartos y corte por mosaico
 
Update  20190930  RCA: 

*/

var year = 2020;
var region = 705;
var Pais = 'PERU';


var Collection = ee.ImageCollection('projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1') 
var Regiones = ee.FeatureCollection('users/Mapbiomas_Peru_C1/DATOS_AUXILIARES/VECTORES/per-noraisg-mosaic-regiones-1');
var Cartas = ee.FeatureCollection('users/Mapbiomas_Peru_C1/DATOS_AUXILIARES/VECTORES/Cartas_Peru_Pacific');

Collection = Collection//.filterMetadata('grid_name','equals',carta)
                       .filterMetadata('year','equals',year)
                       .filterMetadata('region_code','equals',String(region))
                       .filterMetadata('country','equals',Pais)
                       //.filterMetadata('account','equals',cuenta)
                       //.first();
print(Collection);
var Nombre = Collection.getInfo().id;
//Nombre = Nombre.split('/')[5]
Collection = Collection.min();
Regiones = Regiones.filterMetadata('id_region','equals',region);
Collection = Collection.clip(Regiones);
Map.addLayer(Collection, {
      'bands': ['swir1_median', 'nir_median', 'red_median'],
      'min':200,
      'max':5000
      //'gain': [0.08, 0.06, 0.08],
      //'gamma': 0.65
  },'Mosaico_'+region+'_'+year,true);

var empty = ee.Image().byte();
var outline = empty.paint({
          featureCollection: Regiones,
          color: 1,
          width: 1.5
      });
    Map.addLayer(outline, {
          palette: '#000000'
   }, 'Regiones',true);  

empty = ee.Image().byte();
outline = empty.paint({
          featureCollection: Cartas,
          color: 1,
          width: 1.5
      });
    Map.addLayer(outline, {
          palette: '#000000'
   }, 'Cartas',false);
   Map.addLayer(Cartas, {
          palette: '#000000'
   }, 'Cartas_codigos',false);
  
   Map.addLayer(Regiones, {
          palette: '#000000'
   }, 'Region_codigos',false); 
