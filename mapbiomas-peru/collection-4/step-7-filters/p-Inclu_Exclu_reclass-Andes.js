/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Area_trabajo = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-82.69764779765171, -0.1688592729582631],
                  [-82.69764779765171, -19.221641007296423],
                  [-65.82264779765171, -19.221641007296423],
                  [-65.82264779765171, -0.1688592729582631]]], null, false),
            {
              "system:index": "0"
            })]),
    inclusion = /* color: #3614d6 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-76.3237420310458, -6.473597994969973],
                  [-76.32460027565135, -6.471721832052054],
                  [-76.32717516878479, -6.468694227028139],
                  [-76.32837676102088, -6.469077979381582],
                  [-76.32631677053199, -6.475303635276085]]]),
            {
              "value": 1,
              "type": "inclusion",
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.32032475811675, -13.652950550678197],
                  [-73.32028184169488, -13.65572374516713],
                  [-73.32058225018217, -13.658663750996105],
                  [-73.31950936657621, -13.65887225933853],
                  [-73.31925187451078, -13.653242469378053]]]),
            {
              "value": 1,
              "type": "inclusion",
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-77.29405584827758, -8.093438367669703],
                  [-77.29315462604858, -8.095010416839433],
                  [-77.293412118114, -8.092971000517437]]]),
            {
              "value": 1,
              "type": "inclusion",
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([-77.29221395061732, -8.092598301915602]),
            {
              "value": 1,
              "type": "inclusion",
              "system:index": "3"
            })]),
    exclusion = /* color: #ff0000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-76.3634815709856, -6.488607687549568],
                  [-76.36124997308521, -6.485196440535515],
                  [-76.36794476678638, -6.487243191515146]]]),
            {
              "value": 1,
              "type": "exclusion",
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-73.33864961010649, -13.664001506492948],
                  [-73.33624635082914, -13.66387640423178],
                  [-73.33727631909086, -13.660665423471263],
                  [-73.34083829266265, -13.661624552175944]]]),
            {
              "value": 1,
              "type": "exclusion",
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-77.29027929798461, -8.091568895808134],
                  [-77.2895926524768, -8.09382075857286],
                  [-77.28924932972289, -8.092546120817678]]]),
            {
              "value": 1,
              "type": "exclusion",
              "system:index": "2"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var param = {
  regions: [    
  // PERU
    // ANDES
      [70301,	33],
      [70302,	33],
      [70303,	33],
      [70304,	34],
      [70305,	24],
      [70306,	9],
      [70307,	9],
      // [70308,	10],
      // [70309,	10],
      // [70310,	21],
      // [70311,	21],
      // [70312,	21],
      // [70313,	22],
      // [70314,	5],
              ],
  country: 'PERU',
  // trees: 70,
  // yearsPreview: [2000, 2018], //años [2000, 2018]
  // Samples_version_input : 1,  // si se pone una version ejemplo 1 va ha buscar muestras en la region de interes, caso contrario si se deja vacio '', solo tomará muestra global
  // Global_Samples: 70304, // Region tomada como muestra global o auxialiar modelo  '', si se deja vacio no se toma muestras globales
  // version_input: 5,   // 
  // version_output: 6,
  _print: false,
  _Map_addLaye: false,
  inclusion: inclusion,
  waterindexMax_inclu: 13000,
  exclusion: exclusion,
  inclu_exclu_SHP_version :'1', // version '' '1'
};


// featureSpace
var featureSpace = [
  "blue_median",
  "green_median",
  "red_median",
  "nir_median",
  "swir1_median",
  "swir2_median",
  "ndvi_median",
  "soil_median",
  "snow_median",
  "ndwi_mcfeeters_median",
  "mndwi_median",
  // "slope",
  "slope_min",
  "slppost",
  "elevation",
  "AWEIsh",
  "AWEInsh",
  "WI2015"
  // "shade_mask2",
];


var Water = function(param){
  
  this.param = param;
  
  this.inputs = {
    mosaics: [
      'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2'
    ],
    _regions: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4-buffer-250m',
    samples:  'projects/mapbiomas-raisg/MUESTRAS/'+param.country+'/COLECCION4/TRANSVERSALES/AGUA/',
    clasific_ft: 'projects/mapbiomas-raisg/COLECCION4/clasificacion-ft',
    geom_inclu_exclu : 'projects/mapbiomas-raisg/MUESTRAS/'+param.country+'/COLECCION4/TRANSVERSALES/AGUA/GEOMETRIAS',
    years: [
      1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
      1996, 1997, 1998, 1999, 
      2000, 
      2001, 2002, 2003,
      2004,
      2005, 
      2006, 
      2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
      2018, 2019,
      2020, 
      2021
    ],
    palette: require('users/mapbiomas/modules:Palettes.js').get('classification2')
  };
  
  
  
  this.init = function(param){
    
    // Set satellite as default view
    Map.setOptions({
      mapTypeId: 'SATELLITE'
    });
    
    // Inputs and parms
    var _this = this;
    var regionsId = param.regions;
    var regionAsset = _this.inputs._regions;
    var country = param.country;
    //var roiName = param.roiName.toUpperCase();
    var variables = featureSpace;
    // var trees = param.trees;
    var _print = param._print;

    // var version_out = param.version_output;
    // var Samples_version_input = param.Samples_version_input.toString();
    var palette = _this.inputs.palette;
    
    // var samplesPath = _this.inputs.samples;
    var assetMosaics = _this.inputs.mosaics;
    var years = _this.inputs.years;
    var outputPath = _this.inputs.clasific_ft;
    
    regionsId.forEach(function(regionIdNum){
      print(regionIdNum)
      
      var regionId = regionIdNum[0];
      var version_input = regionIdNum[1];
      var version_out = version_input + 1;
      // Region
      var region = _this._getRegion(regionAsset, regionId);
      var regionMask = region.rasterMask;
      var regionLayer = region.vector;
        // print(regionLayer)

      
      // Mosaics
      var mosaic = _this.getMosaic(assetMosaics, regionId);
      var clasification_ft = ee.ImageCollection(outputPath).filter(ee.Filter.eq('code_region', regionId))
                                                           .filter(ee.Filter.eq('version', version_input))
                                                           .min()
      
      // print('clasification_ft',clasification_ft)
      
      
      // var trainingSamples = ee.FeatureCollection([]);
      // muestras de la region
      // if(param.Samples_version_input !== ''){
        
      //   var samplesAsset = 'water-' + regionId + '-' + country + '-' + Samples_version_input;
      //       trainingSamples = ee.FeatureCollection(samplesPath + samplesAsset);
      //   // print(trainingSamples.aggregate_histogram('reference'));
      // }
      // // Muestras globales
      // if(param.Global_Samples !== ''){
      //   var samplesAsset2 = 'water-' + param.Global_Samples + '-' + 'PERU' + '-1';
      //   var trainingSamples2 = ee.FeatureCollection('projects/mapbiomas-raisg/MUESTRAS/'+'PERU'+'/COLECCION4/TRANSVERSALES/AGUA/' + samplesAsset2);
      //   // print(trainingSamples2.aggregate_histogram('reference'));
      // }
      
      
      // trainingSamples = trainingSamples.merge(trainingSamples2);
      
      // Define classifier
      // var classifier = ee.Classifier.smileRandomForest({
      //     numberOfTrees: trees, 
      //     variablesPerSplit: 1
      // });

      function inclus_exclu (inclu, exclu){
         var inclusionRegions=  ee.FeatureCollection(inclu).reduceToImage(['value'], ee.Reducer.first())
                       .eq(1)
         var exclusionRegions=  ee.FeatureCollection(exclu).reduceToImage(['value'], ee.Reducer.first())
                       .eq(1)
         var INCLU_EXCLU = inclusionRegions.rename('inclu').addBands(exclusionRegions.rename('exclu'));
                           
      return INCLU_EXCLU.toUint8()
        }

      var inclu_exclu_shp = ee.FeatureCollection(_this.inputs.geom_inclu_exclu + '/' + 'water-'+ regionId + '-' + country);
      var inclusionFEA = inclu_exclu_shp.filter(ee.Filter.eq('type', 'inclusion'))
      var exclusionFEA = inclu_exclu_shp.filter(ee.Filter.eq('type', 'exclusion'))
      inclusionFEA = inclusionFEA.merge(param.inclusion)
      exclusionFEA = exclusionFEA.merge(param.exclusion)
      
      Map.addLayer(inclusionFEA,{},'inclusionFEA',false)
      Map.addLayer(exclusionFEA,{},'exclusionFEA',false)

      var INCLU_EXCLU = inclus_exclu(inclusionFEA,exclusionFEA)
    
      // Terrain
      var dem = ee.Image('JAXA/ALOS/AW3D30_V1_1').select("AVE");  
      var slope = ee.Terrain.slope(dem).rename('slope');
      var aspect = ee.Terrain.aspect(dem).rename('aspect');
      var slppost = ee.Image('projects/mapbiomas-raisg/MOSAICOS/slppost2_30_v2').rename('slppost')
      var shadeMask2 = ee.Image("projects/mapbiomas-raisg/MOSAICOS/shademask2_v2").rename('shade_mask2')
      
      // // var clasif_Dark_RockyOutcrop = ee.ImageCollection(_this.inputs.Dark_RockyOutcrop);
      // var yearsDR = [
      //       1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
      //       1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 
      //       2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
      //       2018, 2019, 2020, 
      //       2021
      //     ];
      // var clasificationDR = ee.Image(0).select([]);
      // yearsDR.forEach(function(year){
        
      //         var DarkRockyYear = clasif_Dark_RockyOutcrop.filter(ee.Filter.eq('year', year)).mosaic();
              
      //         clasificationDR = clasificationDR.addBands(DarkRockyYear.rename('classification_' + year));
      
      // })
      
      // var DarkRocky_Acc = clasificationDR.eq(29).reduce('sum').gte(treeD.frec_Dark_Rock)//.selfMask();
      
      
      var classifiedImage = ee.Image().byte();
      
      // Iterate by years
      years.forEach(function(year) {
        
        // Mosaics
        var yearMosaic = mosaic.filterMetadata('year', 'equals', year)
                              .filterBounds(regionLayer)
                              
        if(yearMosaic.size().getInfo() !== 0){
              
        yearMosaic = yearMosaic.median()
                              .addBands(dem.rename('elevation'))
                              // .addBands(slope)
                              .addBands(slppost)
                              .addBands(shadeMask2)
                              // .select(featureSpace)
                              .updateMask(regionMask);
       
       
          yearMosaic =    _this.getNDWImf(yearMosaic);
          yearMosaic =    _this.getmNDWI(yearMosaic);
          yearMosaic =    _this.getAWEIsh(yearMosaic);
          yearMosaic =    _this.getAWEInsh(yearMosaic);
          yearMosaic =    _this.getWI2015(yearMosaic);
          yearMosaic =    _this.getslopeMin(yearMosaic);
          var shade_median =  yearMosaic.select("shade_median");  
          yearMosaic =    yearMosaic.select(featureSpace);
          
        yearMosaic = yearMosaic.updateMask(yearMosaic.select('blue_median').gte(0));
      
      if(param._Map_addLaye){
        Map.addLayer(yearMosaic, {
            bands: ['swir1_median', 'nir_median', 'red_median'],
            gain: [0.08, 0.06, 0.2]
          }, 
          'MOSAICO ' + year, 
          false
        );
        
        var palette_index = 'ffffff,fffcff,fff9ff,fff7ff,fff4ff,fff2ff,ffefff,ffecff,ffeaff,ffe7ff,' +
                            'ffe5ff,ffe2ff,ffe0ff,ffddff,ffdaff,ffd8ff,ffd5ff,ffd3ff,ffd0ff,ffceff,' +
                            'ffcbff,ffc8ff,ffc6ff,ffc3ff,ffc1ff,ffbeff,ffbcff,ffb9ff,ffb6ff,ffb4ff,' +
                            'ffb1ff,ffafff,ffacff,ffaaff,ffa7ff,ffa4ff,ffa2ff,ff9fff,ff9dff,ff9aff,' +
                            'ff97ff,ff95ff,ff92ff,ff90ff,ff8dff,ff8bff,ff88ff,ff85ff,ff83ff,ff80ff,' +
                            'ff7eff,ff7bff,ff79ff,ff76ff,ff73ff,ff71ff,ff6eff,ff6cff,ff69ff,ff67ff,' +
                            'ff64ff,ff61ff,ff5fff,ff5cff,ff5aff,ff57ff,ff55ff,ff52ff,ff4fff,ff4dff,' +
                            'ff4aff,ff48ff,ff45ff,ff42ff,ff40ff,ff3dff,ff3bff,ff38ff,ff36ff,ff33ff,' +
                            'ff30ff,ff2eff,ff2bff,ff29ff,ff26ff,ff24ff,ff21ff,ff1eff,ff1cff,ff19ff,' +
                            'ff17ff,ff14ff,ff12ff,ff0fff,ff0cff,ff0aff,ff07ff,ff05ff,ff02ff,ff00ff,' +
                            'ff00ff,ff0af4,ff15e9,ff1fdf,ff2ad4,ff35c9,ff3fbf,ff4ab4,ff55aa,ff5f9f,' +
                            'ff6a94,ff748a,ff7f7f,ff8a74,ff946a,ff9f5f,ffaa55,ffb44a,ffbf3f,ffc935,' +
                            'ffd42a,ffdf1f,ffe915,fff40a,ffff00,ffff00,fffb00,fff700,fff300,fff000,' +
                            'ffec00,ffe800,ffe400,ffe100,ffdd00,ffd900,ffd500,ffd200,ffce00,ffca00,' +
                            'ffc600,ffc300,ffbf00,ffbb00,ffb700,ffb400,ffb000,ffac00,ffa800,ffa500,' +
                            'ffa500,f7a400,f0a300,e8a200,e1a200,d9a100,d2a000,ca9f00,c39f00,bb9e00,' +
                            'b49d00,ac9c00,a59c00,9d9b00,969a00,8e9900,879900,7f9800,789700,709700,' +
                            '699600,619500,5a9400,529400,4b9300,439200,349100,2d9000,258f00,1e8e00,' +
                            '168e00,0f8d00,078c00,008c00,008c00,008700,008300,007f00,007a00,007600,' +
                            '007200,006e00,006900,006500,006100,005c00,005800,005400,005000,004c00';
        
      //   Map.addLayer(yearMosaic.select('mndwi_median'), {
      //     'palette':  palette_index,
      //   'max':20000,
      //   'min':0,
      //         }, 
      //     'mndwi_median ' + year, 
      //     false
      //   );
      //   Map.addLayer(yearMosaic.select('ndwi_mcfeeters_median'), {
      //     'palette':  palette_index,
      //   'max':20000,
      //   'min':0,
      //         }, 
      //     'ndwi_mcfeeters_median ' + year, 
      //     false
      //   );
        
      //   Map.addLayer(yearMosaic.select('slppost'), {
      //     'palette':  palette_index,
      //   'max':100,
      //   'min':0,
      //         }, 
      //     'slppost ' + year, 
      //     false
      //   );
        
      //   Map.addLayer(slope, {
      //     'palette':  palette_index,
      //   'max':100,
      //   'min':0,
      //         }, 
      //     'slope ' + year, 
      //     false
      //   );
        
      //   Map.addLayer(yearMosaic.select('ndwi_mcfeeters_median').gte(13500).and(yearMosaic.select('slope_min').lte(10).and(shadeMask2.neq(1))).selfMask(), {
      //     palette: 'yellow'
      //         }, 
      //     'ndwi_mcfeeters_median gte13mil' + year, 
      //     false
      //   );
        

      // Map.addLayer(shade_median,{'palette':  palette_index,
      //                             'max':100,
      //                             'min':0,},'shade_median',false);
        
        
      }
      
      // Samples
      // var yearSamples = trainingSamples.filterMetadata('year', 'equals', year)
      //   .map(function(feature){
      //     return _this.removeProperty(feature, 'year');
      //   });
        
      
      // Classification
      var classified_RF_DT = clasification_ft.select('classification_' + year.toString());
      
      // // tree decision 
      
      // // Mask sombra relieve
      //   var classified_RF_DT = classified.where(shadeMask2.gte(1),27)
       

      // // Mask Pendientes por altitudes
      //   // classified_RF_DT = classified_RF_DT.where(yearMosaic.select('slope_min').gte(15),27)

      //   classified_RF_DT = classified_RF_DT.where(slope.gte(treeD.slopeLowAltitudes).and(yearMosaic.select('elevation').lte(treeD.AltitudSlope)),27)
      //   classified_RF_DT = classified_RF_DT.where(slope.gte(treeD.slopehigherAltitudes).and(yearMosaic.select('elevation').gte(treeD.AltitudSlope)),27)
       
      //   var classified_RF_DT_terrain = classified_RF_DT;
      
      // // si tiene pendiente encima de 10° y valores bajos de indice de agua, es sombra
      //   classified_RF_DT = classified_RF_DT.where(yearMosaic.select('slope_min').gte(10).and(yearMosaic.select('ndwi_mcfeeters_median').lte(7000)),27)

      
        
      // Mask altitud INDICE DE AGUA   "ndwi_mcfeeters_median",  "mndwi_median", (Las lagunas glaciares tienen valores mayores en el indice mndwi_median)
        var waterindexMax = yearMosaic.select(["ndwi_mcfeeters_median","mndwi_median"]).reduce('max').rename('waterIndex')  //,  "mndwi_median"
        // Map.addLayer(waterindexMax.selfMask(),{},'waterindexMax')

        
      // // Mask Roca y suelo oscuro y altitudes
      //   var DarkRockyOutAlti_1 = DarkRocky_Acc.eq(1).and(yearMosaic.select('elevation').gte(treeD.DarkRockyOutAlti)).or(yearMosaic.select('elevation').gte(treeD.DarkRockyOutAlti)).selfMask()
      //   var DarkRockyOutAlti_2 = DarkRocky_Acc.eq(1).selfMask().and(yearMosaic.select('elevation').lt(treeD.DarkRockyOutAlti)).selfMask()
      //   if(param._Map_addLaye){
      //     Map.addLayer(DarkRocky_Acc.selfMask(), {palette: 'ff00f8'}, 'DarkRocky-'+year,false);
      //     Map.addLayer(DarkRockyOutAlti_1, {palette: 'green'}, 'clasif_Dark_RockyOutcrop1-'+year,false);
      //     Map.addLayer(DarkRockyOutAlti_2, {palette: 'yellow'}, 'clasif_Dark_RockyOutcrop2-'+year,false);
      //     // Map.addLayer(yearMosaic.select('elevation').gte(treeD.DarkRockyOutAlti).selfMask(),{palette: 'orange'}, 'elevation-'+year,false)
      //   }
      //   classified_RF_DT = classified_RF_DT.where(waterindexMax.lte(15000).and(DarkRockyOutAlti_1.eq(1)),27)  
      //   classified_RF_DT = classified_RF_DT.where(waterindexMax.lte(11000).and(DarkRockyOutAlti_2.eq(1)),27)  
        
      //   // Si el pixel tiene mas de 25% de nieve a altitudes mayores a 4500 entonces no es agua es glaciar
      //   classified_RF_DT = classified_RF_DT.where(yearMosaic.select('snow_median').gte(27).and(yearMosaic.select('elevation').gte(4500)),27)
        
      //   // Si el indice de nieve es mas de 5% tiene que tener el indice de agua con valores mayores para ser agua
      //   classified_RF_DT = classified_RF_DT.where(yearMosaic.select('snow_median').gte(7).and(yearMosaic.select('ndwi_mcfeeters_median').lte(11000)),27)
        
      //   // si la fraccion de agua tiene valores encima de 98 
      //   if(treeD.shade_median.Usar){
      //   classified_RF_DT = classified_RF_DT.where(classified_RF_DT_terrain.eq(33).and(shade_median.gte(treeD.shade_median.shade_median))
      //                                             .and(yearMosaic.select('elevation').lte(treeD.shade_median.altitud)), 33)
      //   }
      //   // todo pixel con mas de 0.8 indice agua es Agua sin importar la pendiente debajo de 5000 m 
      //   classified_RF_DT = classified_RF_DT.where(yearMosaic.select('ndwi_mcfeeters_median').gte(18000).and(yearMosaic.select('elevation').lte(4500)), 33)

      //   // todo area con indice de agua ndwi > 1.4 con pendiente menos de 7 p%
      //   classified_RF_DT = classified_RF_DT.where(yearMosaic.select('ndwi_mcfeeters_median').gte(13500).and(yearMosaic.select('slope_min').lte(10).and(shadeMask2.neq(1))), 33)
        
     // Inclusion y exclusion
        var exclu = INCLU_EXCLU.select('exclu')
        var inclu = INCLU_EXCLU.select('inclu')
      
        classified_RF_DT = classified_RF_DT.where(exclu.eq(1).and(classified_RF_DT.eq(33)), 25)
                                               .where(inclu.eq(1).and(waterindexMax.gte(param.waterindexMax_inclu)), 33)
                                              // .updateMask(yearMosaic.select('blue_median').gte(0))
                                              // .updateMask(regionMask)


      var name = 'classification_' + year.toString();

      classifiedImage = classifiedImage.addBands(classified_RF_DT.rename(name));
      
      if(param._Map_addLaye){
        // Display and exports
        Map.addLayer(clasification_ft.select(name), {
            min: 0, 
            max: 34,
            palette: _this.inputs.palette
          }, 
          'CLASIFICACION-original-' + year, 
          false
        );
        // Map.addLayer(clas_DT,{},'clas_DT',false);
        // Display and exports
        Map.addLayer(classified_RF_DT.rename(name), {
            min: 0, 
            max: 34,
            palette: _this.inputs.palette
          }, 
          'CLASIFICACION-'+'New-'+ year , 
          false
        )
      }
       }
      });
      
      if(param._Map_addLaye){
      Map.addLayer(shadeMask2.selfMask(),{palette: 'red'},'shademask2',false)
      }
      // Map.addLayer(aspect,{},'aspect',false)
     
  
      // Export image to asset
      // var siteName =  'water-' + regionId + '-' + country  + '-RF-' + version_out;  //samplesAsset.toUpperCase()
      var siteName = country + '-' + regionId + '-' + version_out;
      
      classifiedImage = classifiedImage.slice(1).updateMask(regionMask).byte()
        .set({
          code_region: regionId,
          pais: country,
          descripcion: 'Filtro inclusion y exclusion', 
          version: version_out,
          paso: 'P07'
        });
        
      if(_print) print(classifiedImage);
  
      Export.image.toAsset({
        image: classifiedImage,
        description: siteName,
        assetId: outputPath + '/' + siteName,
        region: regionLayer.geometry().bounds(),
        scale: 30,
        maxPixels: 1e13,
        pyramidingPolicy: 'mode'
      });
    
    })
    
  };
  
  
  /**
   * Get mosaics
   * Get mosaics from collection2 asset. Then compute
   * waters indexes remaining.
   */
  this.getMosaic = function(paths, regionId) {
  
      // Additional variables
     // var shademask2_v1 = shademask2_v1.rename('shade_mask2')
      
      var mosaicRegion = regionId.toString().slice(0, 3);
      
      var mosaics = paths.map( function(path) {
              
              var mosaic = ee.ImageCollection(path)
                .filterMetadata('region_code', 'equals', Number(mosaicRegion))
                .map(function(image) {
                  var index = ee.String(image.get('system:index')).slice(0, -3);
                  return image
                    .set('index', index);
                });
              
              if(mosaic.size().getInfo() !== 0) return mosaic;
              
            });
            
      mosaics = mosaics.filter( 
              function(m) { return m !== undefined }
            );
      
      var joinedMosaics = mosaics[0];
      
      if(mosaics.length === 2) {
          
              var join = ee.Join.inner(),
                  joiner = ee.Filter.equals({
                    leftField: 'index',
                    rightField: 'index'
                  });
                  
              var joinedCollection = join.apply(mosaics[0], mosaics[1], joiner);
              
              joinedMosaics = ee.ImageCollection(
                joinedCollection.map( function(feature) {
                  var primary = feature.get('primary'),
                      secondary = feature.get('secondary');
                      
                  return ee.Image.cat(primary, secondary);
                })
              );
            }
            
      return joinedMosaics;
      
  };

 /**
 *
 * Water Index  https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018RG000598
 * @param {*} image
 */
 this.getNDWImf  = function  (image) {

	var exp = '( b("green_median") - b("nir_median") ) / ( b("green_median") + b("nir_median") )';

	var ndwimf = image.expression(exp).rename("ndwi_mcfeeters_median")
		.add(1).multiply(10000)
		.toInt16();

	return image.addBands(ndwimf, ["ndwi_mcfeeters_median"], true);
 }

  this.getmNDWI  = function  (image) {

	var exp = '( b("green_median") - b("swir1_median") ) / ( b("green_median") + b("swir1_median") )';

	var ndwimf = image.expression(exp).rename("mndwi_median")
		.add(1).multiply(10000)
		.toInt16();

	return image.addBands(ndwimf, ["mndwi_median"], true);
 }

 this.getAWEIsh  = function  (image) {

	var exp = '( b("blue_median") + (25000 * b("green_median")) - 15000 * ( b("nir_median") + b("swir1_median")) - 2500 * (b("swir2_median")) )';

	var ndwimf = image.expression(exp).divide(10000).rename("AWEIsh");

	return image.addBands(ndwimf, ["AWEIsh"], true);
 }

 this.getAWEInsh  = function  (image) {

	var exp = '( 40000 * (b("green_median") - b("swir1_median")) - (2500 * b("nir_median") + 27500 * b("swir2_median")) )';

	var ndwimf = image.expression(exp).divide(10000).rename("AWEInsh")

	return image.addBands(ndwimf, ["AWEInsh"], true);
 }

 this.getWI2015  = function  (image) {

	var exp = '( 17204 + ( 1710000 * b("green_median")) + 30000 * b("red_median") - 700000 * b("nir_median") - 450000 * b("swir1_median") - 710000 * b("swir2_median") )';

	var ndwimf = image.expression(exp).divide(10000).rename("WI2015")

	return image.addBands(ndwimf, ["WI2015"], true);
 }

 this.getslopeMin = function  (image){
  var SRTMGL1_003 = ee.Image("USGS/SRTMGL1_003").select('elevation'),
    ALOS_V3_2 = ee.ImageCollection("JAXA/ALOS/AW3D30/V3_2").select('DSM'),
    ALOS_v1 = ee.Image('JAXA/ALOS/AW3D30_V1_1').select("AVE"),  
    NASADEM_HGT = ee.Image("NASA/NASADEM_HGT/001").select('elevation');

  var slopeSRTMGL1_003 = ee.Terrain.slope(SRTMGL1_003).rename('slope');
  var slopeALOS = ee.Terrain.slope(ALOS_v1).rename('slope');
  var slopeNASADEM_HGT = ee.Terrain.slope(NASADEM_HGT).rename('slope');
  var proj = ALOS_V3_2.first().select(0).projection(); //.aside(print);
  var slopeALOS_V3_2 = ee.Terrain.slope(ALOS_V3_2.mosaic()
                               .setDefaultProjection(proj));

  var slope = slopeSRTMGL1_003.rename('srtm')
                               .addBands(slopeALOS.rename('alosv1'))
                               .addBands(slopeALOS_V3_2.rename('alosv32'))
                               .addBands(slopeNASADEM_HGT.rename('nasadem'));

  var slopeMin = slope.reduce('min').rename('slope_min');
  
  return image.addBands(slopeMin);
 }

  
  /**
 * Función para generar region de interés (ROI) con base en
 * las región de clasificación o una grilla millonésima contenida en ella
 */
  this._getRegion = function(regionPath, regionIds){
  
    var setVersion = function(item) { return item.set('version', 1) };
    
    var region = ee.FeatureCollection(regionPath)
      .filter(ee.Filter.eq('id_regionC', regionIds));
    
    var regionMask = region
      .map(setVersion)
      .reduceToImage(['version'], ee.Reducer.first());
      
    return {
      vector: region,
      rasterMask: regionMask
    };
  
 };
  
  /**
   * RandomForests classifier
   */
  this.classifyRandomForests = function(mosaic, classifier, samples) {

    var bands = mosaic.bandNames();
    
    var nBands = bands.size();
    
    var points = samples.size();
    
    var nClassSamples = samples
      .reduceColumns(ee.Reducer.toList(), ['reference'])
      .get('list');
      
      
    nClassSamples = ee.List(nClassSamples)
      .reduce(ee.Reducer.countDistinct());
    
    
    var _classifier = ee.Classifier(
      ee.Algorithms.If(
        ee.Algorithms.IsEqual(nBands, 0),
        null, 
        ee.Algorithms.If(
          ee.Algorithms.IsEqual(nClassSamples, 1),
          null,
          classifier.train(samples, 'reference', bands)
        )
      )
    );

    var classified = ee.Image(
      ee.Algorithms.If(
        ee.Algorithms.IsEqual(points, 0),
        ee.Image().rename('classification'),
        ee.Algorithms.If(
          ee.Algorithms.IsEqual(nBands, 0),
          ee.Image().rename('classification'),
          ee.Algorithms.If(
            ee.Algorithms.IsEqual(nClassSamples, 1),
            ee.Image().rename('classification'),
            mosaic.classify(_classifier)
          )
        )
      )
    ).unmask(27).toByte();
    

    classified = classified
      .where(classified.neq(33), 27)
      .where(classified.eq(33), 33);

    
    return classified;
    
  };
  

  /**
   * utils methods
   */
  this.setVersion = function(item){ return item.set('version', 1) };
  
  
  
  this.removeProperty = function(feature, property) {
    var properties = feature.propertyNames();
    var selectProperties = properties.filter(ee.Filter.neq('item', property));
    return feature.select(selectProperties);
  };
  
  
  
  return this.init(param);
  
};


var Water = new Water(param);