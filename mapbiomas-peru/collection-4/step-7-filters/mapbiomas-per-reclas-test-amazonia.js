/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var From_18_to_27 = /* color: #d63000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-78.10594274631369, -7.03117997637903],
                  [-77.25999548068869, -6.998467704045579],
                  [-77.19407751193869, -6.551174636971071],
                  [-77.84227087131369, -5.721004776728552],
                  [-78.24876501193869, -6.56208910876786]]]),
            {
              "remap": "3,21",
              "periodo": "1985,2021",
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([-78.36024990003948, -4.2752989473876974]),
            {
              "remap": "3,21",
              "periodo": "1985,2021",
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[-78.35441341322307, -4.278786807459945],
                  [-78.35484256666545, -4.273801088496306],
                  [-78.3602713577116, -4.276989384620448]]]),
            {
              "remap": "3,21",
              "periodo": "1985,2021",
              "system:index": "2"
            })]),
    From_33_to_3 = /* color: #f2ff17 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-78.35795392920011, -4.280626947160015],
                  [-78.35683813034345, -4.279278883778296],
                  [-78.36177339451713, -4.278615550131906]]]),
            {
              "remap": "33,3",
              "periodo": "2021,2021",
              "system:index": "0"
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// remap
var param = {
    code_region: 70102,  //Region de Clasificacion
    pais: 'PERU', 
    year: [2000,2021],  // Solo visualizacion
    // ciclo: 'ciclo-1',
    version_input:1, // 
    version_output:2,// 
    remapGeometry: [From_18_to_27,From_33_to_3]
};

 
var paths = require('users/raisgmb01/projects-mapbiomas:mapbiomas-peru/collection-4/modules/CollectionDirectories.js').paths;
var assetClasif = paths.classificationRaisg;
var assetFiltros = paths.clasificacionFiltrosRaisg
var dirout  = paths.clasificacionFiltrosRaisg
var regionesclass = paths.regionVectorBuffer
var AssetMosaic= paths.mosaics_c4

// Obtiene la version de salida en base al ciclo
  // var version = getVersion(param.ciclo);
  var version_input = param.version_input;
  var version_output = param.version_output;
  var prefixo_out = param.pais+ '-' + param.code_region + '-' 

////*************************************************************
// Do not Change from these lines
////*************************************************************

var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};
var regioes = ee.FeatureCollection(regionesclass)
                .filterMetadata("id_regionC","equals", param.code_region);
                
var setVersion = function(item) { return item.set('version', 1) };
var regionRaster = regioes
                      .map(setVersion)
                      .reduceToImage(['version'], ee.Reducer.first());

  
var mosaicRegion = param.code_region.toString().slice(0, 3);
var mosaic = ee.ImageCollection(AssetMosaic)
            .filterMetadata('region_code', 'equals', Number(mosaicRegion))
            .select(['swir1_median', 'nir_median', 'red_median']);
var image_FE
if(param.version_input == 1 || param.version_input == 3){
    var assetPath = assetClasif + '/' + param.pais + '-' + param.code_region;
    image_FE = ee.Image(assetPath  + '-' + version_input);
   } else {
    image_FE = ee.ImageCollection(assetFiltros)
               .filterMetadata('code_region', 'equals', param.code_region)
               .filterMetadata('version', 'equals', version_input)
               .first()
   }
   
print(image_FE);

//-----
var years = [
    1985, 1986, 1987, 1988,
    1989, 1990, 1991, 1992,
    1993, 1994, 1995, 1996,
    1997, 1998, 1999, 2000,
    2001, 2002, 2003, 2004,
    2005, 2006, 2007, 2008,
    2009, 2010, 2011, 2012,
    2013, 2014, 2015, 2016,
    2017, 2018, 2019, 2020, 2021];

// get band names list 
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// generate a histogram dictionary of [bandNames, image.bandNames()]
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image_FE.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

// print(bandsOccurrence);

// insert a masked band 
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                image_FE.select([key]).byte(),
                ee.Image().rename([key]).byte().updateMask(image_FE.select(0))
            )
        );
    }
);
// convert dictionary to image
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);

image_FE = imageAllBands

var filtered = image_FE;
var temp1,temp2,prop,cont;
var atrib = [];
filtered = ee.Image([])
// obtenermos los atributos de todas las geometrias definidas en Geometry
param.remapGeometry.forEach(function(geo){
  temp1 = geo.getInfo().features[0].properties
  temp2 = temp1.periodo.split(',')
  temp1 = temp1.remap.split(',')
  atrib[atrib.length] = {
    from:parseInt(temp1[0]),
    to:parseInt(temp1[1]),
    FIni:temp2[0],
    FFin:temp2[1],
  }
})

print(atrib)

// aplicamos el remap a todas las bandas de la clasificación 
years.forEach(function(y){
  temp1 = image_FE.select('classification_'+y)
  cont=0;
  param.remapGeometry.forEach(function(geo){
    prop = atrib[cont]
    if ((prop.FIni<=y) && (y<=prop.FFin)){
      temp2 = temp1.clip(geo).selfMask();
      temp1 = temp1.where(temp2.eq(prop.from),prop.to)
    }
    cont = cont+1;
  })
  //print(y)
  filtered = filtered.addBands(temp1)
})


print('filtered',filtered)


filtered =filtered.select(bandNames)
                    .updateMask(regionRaster);

//----


for (var yearI=0;yearI<param.year.length;yearI++) {

var vis = {
    'bands': 'classification_'+param.year[yearI],
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};
Map.addLayer(mosaic.filterMetadata('year', 'equals', param.year[yearI])
                   .mosaic()
                   .updateMask(regionRaster), {
      'bands': ['swir1_median', 'nir_median', 'red_median'],
      'gain': [0.08, 0.06, 0.08],
      'gamma': 0.65
  }, 'mosaic-'+param.year[yearI], false);
  
Map.addLayer(image_FE, vis, 'original'+param.year[yearI],false);

Map.addLayer(filtered, vis, 'filtered'+param.year[yearI],false);
}

filtered = filtered
          .set('code_region', param.code_region)
          .set('pais', param.pais)
          .set('version', version_output)
          .set('descripcion', 'filtro reclas')
          .set('paso', 'P07');
          
print(filtered)
          
// EXPORTS 
  Export.image.toAsset({
      'image': filtered,
      'description': prefixo_out+version_output,
      'assetId': dirout+'/' +prefixo_out+version_output,
      'pyramidingPolicy': {
          '.default': 'mode'
      },
      'region': regioes.geometry().bounds(),
      'scale': 30,
      'maxPixels': 1e13
  });
  

 