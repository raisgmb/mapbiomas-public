/** 
                                P1 - 02 VER MOSAICOS DE LANDSAT COLECCIÓN 2
 Update  2019___   Joao et: 
 Update  20200904  EYTC: creacion de nuevo modulo GetImages para blacklist
 Update  20211215   RCA: Adapción para Bolivia
 Update  20220307   RCA: Adapción para ver mosaicos en Bolivia
 */    
  
 var param = {
    'pais': 'BOLIVIA', // 
    'regionMosaic': 210,  //
    yearVis: [1985,1990,2000,2010,2015,2020,2021]
};

var AssetRegions = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4';
var AssetGrids = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid-world';
var AssetMosaicosCol1 = 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1'
var AssetMosaicosCol2 = 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2'
var AssetCartas = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/cartas-mapbiomas-2'

var MosCol1 = ee.ImageCollection(AssetMosaicosCol1)
              .filter(ee.Filter.eq('country',param.pais))
var pa =''
if (param.pais ==='BOLIVIA'){
  pa = 'Bolivia'
}

var MosCol2 = ee.ImageCollection(AssetMosaicosCol2)
              .filter(ee.Filter.eq('country',param.pais))

var Regiones = ee.FeatureCollection(AssetRegions)
               .filter(ee.Filter.eq('pais',pa))

var Cartas = ee.FeatureCollection(AssetGrids)
Cartas = Cartas.filterBounds(Regiones)

print('MosCol1',MosCol1.size())
print('MosCol2',MosCol2.size())

var MosYearCol1;
var MosYearCol2;
var  visMos = {
  bands: 'swir1_median,nir_median,red_median',
  gain: '0.08,0.06,0.2'
}

param.yearVis.forEach(function(y){
  MosYearCol1 = MosCol1.filter(ee.Filter.eq('year',y))
  MosYearCol2 = MosCol2.filter(ee.Filter.eq('year',y))
  Map.addLayer(MosYearCol1,visMos,'Mosaico-Col1 '+y,false)
  Map.addLayer(MosYearCol2,visMos,'Mosaico-Col2 '+y,false)

  
})

Map.addLayer(Cartas,{},'Cartas - Bolivia',false,0.4)
Map.addLayer(Regiones,{},'Regiones - Bolivia',false,0.5)
/*
var getCodCarta = function(){
  print('Click')
}
Map.onClick(getCodCarta())
*/

var panel = ui.Panel({style:{position:'bottom-right'}})
//position ('top-right', 'top-center', 'top-left', 'bottom-right', ...)
var text = ui.Label('')
panel.add(text)
var getIdCarta = function(es){
  //print('click')
  //print(es)
  var Geo = ee.Geometry.Point({coords:[es.lon,es.lat]})
  var CartaSel = Cartas.filterBounds(Geo)
  //print(CartaSel.getInfo().features[0].properties.name)
  text.setValue('Carta:'+CartaSel.getInfo().features[0].properties.name)
  //Map.
}
Map.add(panel)
Map.onClick(getIdCarta)


