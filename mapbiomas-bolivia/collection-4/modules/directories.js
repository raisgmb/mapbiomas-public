var country = 'BOLIVIA';

exports.paths = { 
  
  /**
   * Rutas generales usadas en toda la metodología 
   */
  grids:'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid_world',
  //regionVector: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-3',
  //regionCRaster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-3',
  regionVector: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
  regionVectorRaisg: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
  regionVectorRaisgBuffer: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-buffer-250m',
  regionVectorBuffer: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-buffer-250m',
  regionCRaster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
  regionCRasterRaisg: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',
  regionMosRaster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',
  mosaics: 'projects/mapbiomas-raisg/MOSAICOS/', 
  terrain: 'JAXA/ALOS/AW3D30_V1_1',
  collection1: 'projects/mapbiomas-raisg/public/collection1/mapbiomas_raisg_panamazonia_collection1_integration_v1',
  collection2: 'projects/mapbiomas-raisg/public/collection2/mapbiomas_raisg_panamazonia_collection2_integration_v2',
  collection3: 'projects/mapbiomas-raisg/public/collection3/mapbiomas_raisg_panamazonia_collection3_integration_v2',

  /**
   * Coleccion 3 RAISG
   */
  //mosaics_c3_v2: 'projects/mapbiomas-raisg/MOSAICOS/workspace-c3-v2',
  mosaics_c3_v2: 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1',
  mosaics_c4_v1: 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2',
  //regionVector_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-3',
  //regionCRaster_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-3',
  //regionVector_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-bol',
  //regionCRaster_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-bol',
  //regionVector_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
  //regionVector_RAISG_Buff: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-buffer-250m',
  //regionCRaster_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',
  //regionMosRaster_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',
  /**
   * Coleccion 4 RAISG
   */
  regionVector_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
  regionVector_RAISG_Buff: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-buffer-250m',
  regionCRaster_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',
  regionMosRaster_RAISG: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4', 
   
  /**
   * Rutas correspondientes al P02 y P06
   */
  muestrasestables: 'projects/mapbiomas-raisg/MUESTRAS/' + country + '/COLECCION4/MUESTRAS_ESTABLES/',
  muestrasestablesRaster: 'projects/mapbiomas-raisg/MUESTRAS/' + country + '/COLECCION4/MUESTRAS_ESTABLES/muestras-estables/',
  
  stablePixelsPath: 'projects/mapbiomas-raisg/MUESTRAS/' + country + '/COLECCION4/MUESTRAS_ESTABLES/',
  stablePixelsImages: 'projects/mapbiomas-raisg/MUESTRAS/' + country + '/COLECCION4/MUESTRAS_ESTABLES/muestras-estables/',

  /**
   * Rutas correspondientes al P03 y P07
   */
  trainingSamples: 'projects/mapbiomas-raisg/MUESTRAS/' + country + '/COLECCION4/PUNTOS_ESTABLES/',
  trainingAreas: 'projects/mapbiomas-raisg/MUESTRAS/' + country + '/COLECCION4/AREAS_CLASE_REGION/',

  /**
   * Rutas correspondientes al  paso 4
   */
  classification: 'projects/mapbiomas-raisg/COLECCION4/clasificacion/',
  classificationRaisg: 'projects/mapbiomas-raisg/COLECCION4/clasificacion',
  
  
  
  /**
   * Rutas correspondientes al  paso 5
   */
  clasificacionFiltros: 'projects/mapbiomas-raisg/COLECCION4/clasificacion-ft/',
  clasificacionFiltrosRaisg: 'projects/mapbiomas-raisg/COLECCION4/clasificacion-ft',
  filtrosMetadata: 'projects/mapbiomas-raisg/COLECCION4/metadata/',
  filtrosMetadataRaisg: 'projects/mapbiomas-raisg/COLECCION4/metadata',

};