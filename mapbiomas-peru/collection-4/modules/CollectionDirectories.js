exports.paths = { 
  
  /**
   * Rutas generales usadas en toda la metodología 
   */
      // GENERAL
          regionVector:       'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
          regionVectorBuffer: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-buffer-250m',
          regionClasRaster:       'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',
          regionMosVector:    'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-mosaic-regiones-4',
          regionMosRaster:    'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-mosaicos-4',
          grids:'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/grid-world',
        
      // AMBITO RAISG 
          gridsRaisg:'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/cartas-mapbiomas-2',
          cartasRaisg: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/cartas-RAISG-regiones-2',
          // regionVectorRaisg: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-raisg-clasificacion-regiones-4',
          regionVectorRaisg: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
          //regionCRasterRaisg: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per-raisg-clasificacion-regiones-4',
          // regionCRasterRaisg: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',
          // regionMosRasterRaisg: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per-raisg-mosaic-regiones-4',
          
      // AMBITO NO RAISG 
      
      // regionVector: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-noraisg-clasificacion-regiones-1',
        regionCRaster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/PERU/per-noraisg-clasificacion-regiones-1',
        // regionMosRaster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/PERU/per-noraisg-mosaic-regiones-1',
        // regionMosVector: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/PERU/per-noraisg-mosaic-regiones-1',

      // GENERAL
        mosaics_c3_v2: 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-1',
        mosaics_c4: 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2',
        mosaics: 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/', 
        terrain:       'JAXA/ALOS/AW3D30_V1_1',
        collection1:   'projects/mapbiomas-raisg/COLECCION1/integracion',
        collection2: 'projects/mapbiomas-raisg/SUBPRODUCTOS/MOORE/classification/mapbiomas-raisg-collection20-integration-v8',
        collection3: 'projects/mapbiomas-raisg/public/collection3/mapbiomas_raisg_panamazonia_collection3_integration_v2',
        classification_DEMERN:'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per_classification_DEMERN',
        CobVeg_MINAM:'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per_cobveg2015_homologado',
        midagri2020:'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per_midagri2020',
        bosqueseco2018_SERFOR:'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per_bosqueseco2018_SERFOR',
        cofopri2015: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/per_cofopri2015',
    
  /**
   * Rutas correspondientes al step-3 and step-5
   */
  muestrasestables: 'projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/MUESTRAS_ESTABLES/',
  muestrasestablesRaster: 'projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/MUESTRAS_ESTABLES/muestras-estables/',  // antes samples02, pixelstable02

  trainingPoints01: 'projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/PUNTOS_ESTABLES/',
  AreasClass: 'projects/mapbiomas-raisg/MUESTRAS/PERU/COLECCION4/AREAS_CLASE_REGION/',

  /**
   * Rutas correspondientes al  step-4 and step-6
   */
      // AMBITO RAISG 
       classificationRaisg: 'projects/mapbiomas-raisg/COLECCION4/clasificacion', // Para guardar
      // AMBITO NO RAISG 
       classification: 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/clasificacion', // Para guardar
  /**
   * Rutas correspondientes al step-4
   */
      // AMBITO RAISG 
        clasificacionFiltrosRaisg: 'projects/mapbiomas-raisg/COLECCION4/clasificacion-ft',
        filtrosMetadataRaisg: 'projects/mapbiomas-raisg/COLECCION4/metadata',
      // AMBITO NO RAISG 
        clasificacionFiltros: 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/clasificacion-ft',
        filtrosMetadata: 'projects/mapbiomas-raisg/PRODUCTOS/PERU/COLECCION4/metadata',


};