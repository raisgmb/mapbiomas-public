/*
Visualizar mosaicos guardados en asset por región y pais

Update  20190930  RCA: 
Update  20210211  EYTC: 
*/

var year = 2020;
var region = 701;
var Pais =  'PERU';

var Collection3 = ee.ImageCollection("projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1") 
var Collection4 = ee.ImageCollection('projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2') 
var Regiones = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-raisg-clasificacion-regiones-4');
var Cartas = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid-world');

var setVersion = function(item){ return item.set('version', 1) }
// Regions
var regionLayer = ee.FeatureCollection(Regiones)
  .filterMetadata('id_region', 'equals', region)
  .map(setVersion)
  .reduceToImage(['version'], ee.Reducer.first());

Collection3 = Collection3
                      .filterMetadata('year','equals',year)
                      .filterMetadata('region_code','equals',String(region))
                      .filterMetadata('country','equals',Pais)
                       //.filterMetadata('account','equals',cuenta)
                       //.first();
                       
Collection4 = Collection4
                      .filterMetadata('year','equals',year)
                      .filterMetadata('region_code','equals',region)
                      .filterMetadata('country','equals',Pais)
                       //.filterMetadata('account','equals',cuenta)
                       //.first();
                       
                       
print(Collection4);
var Nombre = Collection4.getInfo().id;
//Nombre = Nombre.split('/')[5]

Regiones = Regiones.filterMetadata('id_region','equals',region);

var Regiones_joinedFeatures = Regiones.union().map(function(fea){ return fea.simplify(90)})

Collection3 = Collection3.mosaic().updateMask(regionLayer) //.clip(Regiones_joinedFeatures);
Collection4 = Collection4.mosaic().updateMask(regionLayer)//.clip(Regiones_joinedFeatures);

Map.addLayer(Collection3, {
      'bands': ['swir1_median', 'nir_median', 'red_median'],
      'gain': '0.08,0.06,0.2'
      //'gain': [0.08, 0.06, 0.08],
      //'gamma': 0.65
  },'Mosaico_C3_'+region+'_'+year,false);
  
Map.addLayer(Collection4, {
      'bands': ['swir1_median', 'nir_median', 'red_median'],
      'gain': '0.08,0.06,0.2'
      //'gain': [0.08, 0.06, 0.08],
      //'gamma': 0.65
  },'Mosaico_C4_'+region+'_'+year,true);
  
var empty = ee.Image().byte();
var outline = empty.paint({
          featureCollection: Regiones_joinedFeatures,
          color: 1,
          width: 1.5
      });
    Map.addLayer(outline, {
          palette: '#000000'
   }, 'Regiones',false);  

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
