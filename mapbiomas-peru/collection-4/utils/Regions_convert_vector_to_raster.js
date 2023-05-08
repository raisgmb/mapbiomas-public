/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-91.69203689945564, 13.283148422027894],
          [-91.69203689945564, -35.7818127271303],
          [-30.520161899455644, -35.7818127271303],
          [-30.520161899455644, 13.283148422027894]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// convert vector to raster

var assetRegions ='projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-4';


var propertie = 'featureid';  

var regions = ee.FeatureCollection(assetRegions);
print(regions.limit(1))

var regionsRaster = ee.Image().uint32().paint({
    featureCollection: regions,
    color: propertie
}).rename(['regions']);

//projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/paises-3

Export.image.toAsset({
    "image": regionsRaster,
    "description": 'paises-4',
    "assetId": 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/' + 'paises-4',
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": geometry
});


Map.addLayer(regionsRaster.randomVisualizer())


