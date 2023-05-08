/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-81.70357900607053, -3.197017952401174],
          [-81.70357900607053, -18.554102993866803],
          [-68.71773916232053, -18.554102993866803],
          [-68.71773916232053, -3.197017952401174]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var integradoDEMERT = 'users/NDFIb1/DEMERN/MINAM/Integracion_min'

// Bands Name 
var bandsname = []; 
var years =[]
for (var year = 2011; year<=2018; year++){
  bandsname.push('classification_'+year)
  years.push(year)
}
print(bandsname)
print(years)


var  IntegradoDEMERTv1 = ee.Image(integradoDEMERT).select(bandsname);

print(IntegradoDEMERTv1)

var remapClassOri =  [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14];
var remapClassNew =  [22,22,21,3,12,13,13,22,34,11,13,33,27,27];

var colList = ee.List([]);
years.forEach( function( year ) {
    var col1flor = IntegradoDEMERTv1.select('classification_' + year.toString())
                           .remap ( remapClassOri, remapClassNew )
                           .rename('classification_' + year.toString());

    colList = colList.add(col1flor.int8());
});
print(colList)
var IntegradoDEMERTv1remap = ee.ImageCollection(colList).toBands().rename(IntegradoDEMERTv1.bandNames());
print(IntegradoDEMERTv1remap)

var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'bands': 'classification_'+ 2018,
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};


Map.addLayer(IntegradoDEMERTv1remap, vis, 'IntegradoDEMERTv1remap'+ 2018,false);

Export.image.toAsset({
    "image": IntegradoDEMERTv1remap.toUint8(),
    "description": 'classification_DEMERN',
    "assetId": 'users/Mapbiomas_Peru_C1/DATOS_AUXILIARES/RASTERS' + "/" + 'classification_DEMERN',//
    "region": geometry,
    "scale": 30,
    "maxPixels": 1e13,
    "pyramidingPolicy": {
        ".default": "mode"
    },
})
