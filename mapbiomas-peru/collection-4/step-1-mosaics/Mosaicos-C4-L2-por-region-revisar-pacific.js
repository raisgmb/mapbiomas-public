/*
Visualizar mosaicos guardados en asset por región y pais
COL4 LANDSAT L2
 
Update  20210106  EYTC: 

*/
var region = 705;
var Pais = 'PERU';


var Collectionc3_v2 = ee.ImageCollection("projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1") //projects/mapbiomas-raisg/MOSAICOS/workspace-c3-v2
var Collectionc4 = ee.ImageCollection("projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2") //projects/mapbiomas-raisg/MOSAICOS/workspace-c3-v2
var Regiones = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-noraisg-mosaic-regiones-1');
var RegionesRaster = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per-noraisg-mosaic-regiones-1');
var Cartas = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid-world');

       
Collectionc3_v2 = Collectionc3_v2.filterMetadata('region_code','equals',String(region))
                            // .filterMetadata('country','equals',Pais)
                            
Collectionc4 = Collectionc4.filterMetadata('region_code','equals',region)

print(Collectionc4)

Regiones = Regiones //.filterMetadata('id_region','equals',region);

for(var year = 2000; year<=2021; year++){
  
  var Collectionc4_year = Collectionc4.filterMetadata('year','equals',year)
  
  Map.addLayer(Collectionc4_year, {
        'bands': ['swir1_median', 'nir_median', 'red_median'],
        'gain': '0.08,0.06,0.2'
        // 'min':200,
        // 'max':4000
    },'Mosaico_c4_'+region+'_'+year,false);
  
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
