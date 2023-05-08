/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var formacion_campestre_2021 = /* color: #fff216 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-69.74251268087463, -17.161876163261258]),
            {
              "class": 12,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([-69.73787782369689, -17.167288682882383]),
            {
              "class": 12,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([-69.7469758766754, -17.16122008954595]),
            {
              "class": 12,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([-69.81907365499572, -17.16843677280078]),
            {
              "class": 12,
              "system:index": "3"
            })]),
    matorral_2021 = /* color: #ff7e19 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([-69.8261117714508, -17.27878416590111]),
            {
              "class": 13,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([-69.83400819479064, -17.288127052243542]),
            {
              "class": 13,
              "system:index": "1"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Visualizar mosaicos guardados en asset por región y pais y colectar muestras
COL4
 
Update  20220106  EYTC: actual

*/
var region = 704;
var Pais = 'PERU';
var regionName = 'andes-pacifico'
var Grup =  'P2'
var year_sampling = 2021
var lista_amostra = [matorral_2021, formacion_campestre_2021];

var assetSamples = 'projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/OTROS'
var Collectionc4 = ee.ImageCollection('projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2') 
var Regiones = ee.FeatureCollection('projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-clasificacion-regiones-4');
var Cartas = ee.FeatureCollection('users/Mapbiomas_Peru_C1/DATOS_AUXILIARES/VECTORES/grid_world');

       
Collectionc4 = Collectionc4.filterMetadata('region_code','equals',region)
                            .filterMetadata('country','equals',Pais)
                            

Regiones = Regiones.filterMetadata('id_region','equals',region);
var Regiones_joinedFeatures = Regiones.union().map(function(fea){ return fea.simplify(90)})

for(var year = year_sampling; year<=year_sampling; year++){
  
  var mosaic_c3_v2 = Collectionc4.filterMetadata('year','equals',year)
                                    // .filterMetadata('region_code','equals',String(region))
  
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
   }, 'Regiones class',false);  

var outlineM = empty.paint({
          featureCollection: Regiones_joinedFeatures,
          color: 1,
          width: 1.5
      });
    Map.addLayer(outlineM, {
          palette: '#000000'
   }, 'Regiones mos',true);  


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


///MUESTRAS
    
    var amostraTotal = lista_amostra[0];
    for (var i_amostra = 1; i_amostra < lista_amostra.length; i_amostra++) {
        amostraTotal = amostraTotal.merge(lista_amostra[i_amostra]);
    }
    var list_pts = amostraTotal.reduceColumns(ee.Reducer.toList(), ['class']).get('list');
    var freqClass = ee.List(list_pts).reduce(ee.Reducer.frequencyHistogram())
    print(freqClass)
    
// Exportar muestras
    var filename = 'muestras' + '-' + Grup  + '-'  +  regionName  + '-' + year_sampling
 Export.table.toAsset(
            amostraTotal,
            filename,
            assetSamples  + '/' + filename
          );