/** 
                                P1 - 02 VER MOSAICOS DE LANDSAT COLECCIÓN 2
 Update  2019___   Joao et: 
 Update  20200904  EYTC: creacion de nuevo modulo GetImages para blacklist
 Update  20211215   RCA: Adapción para Bolivia
 Update  20220307   RCA: Adapción para ver mosaicos en Bolivia
 */    
 
 var param = {
    'pais': 'BOLIVIA', // Options: 'Perú'
    'regionMosaic': 206,  //
    yearVis: [1985,1990,2000,2010,2015,2021]
};

var AssetRegions = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4';
var AssetGrids = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid-world';
var AssetMosaicos = 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2'
var AssetCartas = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/cartas-mapbiomas-2'

var MosCol2 = ee.ImageCollection(AssetMosaicos)
              .filter(ee.Filter.eq('country',param.pais))



var Regiones = ee.FeatureCollection(AssetRegions)



var Cartas = ee.FeatureCollection(AssetCartas)
Cartas = Cartas.filterBounds(Regiones)

print('MosCol2',MosCol2.size())
var MosYear;
var  visMos = {
  bands: 'swir1_median,nir_median,red_median',
  gain: '0.08,0.06,0.2'
}
param.yearVis.forEach(function(y){
  MosYear = MosCol2.filter(ee.Filter.eq('year',y))
  Map.addLayer(MosYear,visMos,'Mosaico-Col2 '+y,false)
})

Map.addLayer(Cartas,{},'Cartas - Bolivia',false,0.4)
Map.addLayer(Regiones,{},'Regiones - Bolivia',false,0.5)
/*
var getCodCarta = function(){
  print('Click')
}
Map.onClick(getCodCarta())
*/