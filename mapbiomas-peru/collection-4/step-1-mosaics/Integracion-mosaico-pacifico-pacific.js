// INTEGRACION MOSAICO
var param = {
    pais: 'PERU', 
    ID_pais: 8,
    years: [2013,2020],  // Lista de años Solo para visualizacion
    version_input: 1,// 
    version_out: 1,// 
}; 
  
var regionesclass = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-raisg-clasificacion-regiones-4'
var regionesclassRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per-raisg-clasificacion-regiones-4'
var regionesMosaicRaster = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per-raisg-mosaic-regiones-4'
var assetmosaics= 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1'
var assetGrids = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid-world';
var assetClasif = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-raisg-clasificacion-regiones-4'

var regionsRaster = ee.Image(regionesclassRaster)
var regionMosaicRaster = ee.Image(regionesMosaicRaster)
var Grids = ee.FeatureCollection(assetGrids)
var RClasif= ee.FeatureCollection(assetClasif)

// GetMosaicos
var MosaicoCollection = ee.ImageCollection(assetmosaics)
      .filterMetadata('country', 'equals', param.pais)
      .select(['swir1_median', 'nir_median', 'red_median'])
      .map(
          function (image) {
              return image.updateMask(
                  regionMosaicRaster.eq(ee.Number.parse(image.get('region_code')).toInt16()));
          }
      );

// Show Maps
for (var yearI=0;yearI<param.years.length;yearI++) {

Map.addLayer(MosaicoCollection.filterMetadata('year', 'equals', param.years[yearI]),{
  "bands":["swir1_median","nir_median","red_median"],
  "min":407,"max":3381}, 'Mosaic' + param.years[yearI],false)
  
}

var minamCobHomol = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per_cobveg2015_homologado';
var referencia2015 = ee.Image(minamCobHomol);
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

Map.addLayer(referencia2015, vis, 'Cobertura MINAM 2015 Homologado',false);
Map.addLayer(Grids,{},'Cartas',false)
Map.addLayer(RClasif,{},'Region-Clasificacion',false) 
