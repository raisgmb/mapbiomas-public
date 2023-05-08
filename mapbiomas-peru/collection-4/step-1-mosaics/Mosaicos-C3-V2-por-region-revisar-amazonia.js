/*
Visualizar mosaicos guardados en asset por región y pais
COL3_V2 y COL2_V2
 
Update  20210106  EYTC: 

*/
var region = 703; 
var Pais = 'PERU';


var Collectionc3_v2 = ee.ImageCollection("projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1") //projects/mapbiomas-raisg/MOSAICOS/workspace-c3-v2
var Regiones = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-raisg-clasificacion-regiones-4');
var RegionesRaster = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per-raisg-mosaic-regiones-4');
var Cartas = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid-world');

       
Collectionc3_v2 = Collectionc3_v2.filterMetadata('region_code','equals',String(region))
                            // .filterMetadata('country','equals',Pais)
                            

Regiones = Regiones //.filterMetadata('id_region','equals',region);

for(var year = 2021; year<=2021; year++){
  
  var mosaic_c3_v2 = Collectionc3_v2.filterMetadata('year','equals',year)
  
  Map.addLayer(mosaic_c3_v2, {
        'bands': ['swir1_median', 'nir_median', 'red_median'],
        'min':200,
        'max':4000
    },'Mosaico_c3_v2_'+region+'_'+year,false);
  
}



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
