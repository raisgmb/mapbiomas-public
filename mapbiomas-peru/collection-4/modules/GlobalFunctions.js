exports.GlobalFunct = {  
  hola: function(){
      print("Hola Mundo")
  },
  
  // función para decodificar la región de mosaico a partir de la región de clasificación
  /*
  ObtenerCodigoMosaico:function(CodClass,pais){
      var CodMos="";
      CodMos = String(CodClass).slice(0, 3);
      if (pais == 'GUYANA'|| pais == 'SURINAME' || pais == 'GUIANA_FRANCESA'){
        
        if (CodClass == 15023 ||   CodClass == 15024){
            CodMos = '509';    
        }
        else{
          CodMos = '502';  
        }
      }
      return CodMos;
  },
  */
  // función para adicionar un mosaico al mapa
 
  AddMosaico:function(CodReg,CodMos,year){
    var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
    var dirRegions = paths.region;
    year = parseInt(year+"")
                
    var regions = ee.FeatureCollection(paths.regionbuffer240) // see 
                .filterMetadata('id_regionC', 'equals', CodReg);
    
    var mosaics = ee.ImageCollection(paths.mosaics_c2);
    var mosaic = mosaics
                  .filterMetadata('region_code', 'equals', CodMos)
                  .filterMetadata("year", "equals", year )
                  .mosaic()
                  .clip(regions);
    //print(regions)
    Map.addLayer(mosaic, {
                        bands: 'swir1_median,nir_median,red_median',
                        gain: '0.08,0.06,0.2'
                        },
                        'mosaico '+year,
                        false
                    );
  },
  // Función para calcular estadísticas a partir de una clasificación
  CalcularEstadisticas:function(image,region){
    
    var pixelArea = ee.Image.pixelArea().divide(1000000);
    var regions = image.select(0).gte(0);
    pixelArea = pixelArea.clip(region);
    pixelArea = pixelArea.mask(regions);
    
    var Stats;
    
    var reducer = ee.Reducer.sum().group(1, 'classe').group(1, 'featureid');
    
    var convert2featCollection = function (item) {
    item = ee.Dictionary(item);
    var feature = ee.Feature(null)
        .set('Clase_id', item.get('classe'))
        .set("area", item.get('sum'))
        //.set("region_code", param.region_code)
        //.set("pais", param.pais)
    return feature;
    };

    var areas = pixelArea.addBands(regions).addBands(image)
        .reduceRegion({
            reducer: reducer,
            geometry: region,
            scale: 30,
            maxPixels: 1e12
        });

    Stats = ee.FeatureCollection(
        ee.List(ee.Dictionary(ee.List(areas.get('groups')).get(0)).get('groups'))
        .map(convert2featCollection)
    );
    
    return  Stats
  },
  // Función para unir bandas de dos colecciones
  UnionBands: function(coll1,coll2){
    var collUnion = coll1.map(function(image){
                    var grid_name = image.get('grid_name')
                    var region_code = image.get('region_code')
                    var year = image.get('year')
                    var imagecol2 = coll2.filterMetadata('grid_name', 'equals', grid_name)
                                         .filterMetadata('region_code', 'equals', region_code)
                                         .filterMetadata('year', 'equals', year)
                                         .first()
    return image.addBands(imagecol2)
  })
  return collUnion
  },
  
  ExportarTablaDrive:function(Stats,Nombre,Carpeta,Formato){
    Export.table.toDrive({
    "collection": Stats,
    "description": Nombre,
    "folder": Carpeta,
    "fileFormat":Formato
  });
  },
  getNomCorto:function(NomOri,BandSel,NomCort){
    
    var ResNomCor = []
    var n;
    BandSel.forEach(function(ele){
      n = NomOri.indexOf(ele)
      if (n>=0){
        ResNomCor.push(NomCort[n])
      }
    })
    return ResNomCor;
  },
  ListToFeat:function(lista){
    /**
     * by rcamargo  
     * 
     */
    var feat = ee.FeatureCollection([]);

    var Nro = lista.getInfo().length
    for (var i=0;i<Nro;i++){
      feat = feat.merge(ee.FeatureCollection([ee.Feature(null,{'Val':lista.get(i)})]))
    }
    return feat
  },
  ObjToFeat:function(Obj){
    /**
     * by rcamargo  
     * 
     */
    return ee.FeatureCollection([ee.Feature(null,Obj)])
  }
};
