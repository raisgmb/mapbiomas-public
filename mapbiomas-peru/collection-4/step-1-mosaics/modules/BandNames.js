/** 
 * 
 */
var bandNames = {
 
 'l5': {
      'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'pixel_qa', 'B6'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'pixel_qa', 'temp']
  },
  
 'l7': {
      'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'pixel_qa', 'B6'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'pixel_qa', 'temp']
  },

  'l8' : {
      'bandNames': ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'pixel_qa', 'B11'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal', 'pixel_qa', 'temp']
  },
  'l4_sr2': {
      'bandNames': ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7', 'QA_PIXEL', 'ST_B6'],
      'newNames':  ['blue',  'green', 'red',   'nir',   'swir1', 'swir2', 'pixel_qa', 'temp']
  },
  
  'l5_sr2': {
      'bandNames': ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7', 'QA_PIXEL', 'ST_B6'],
      'newNames':  ['blue',  'green', 'red',   'nir',   'swir1', 'swir2', 'pixel_qa', 'temp']
  },
  
  'l7_sr2': {
      'bandNames': ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7', 'QA_PIXEL', 'ST_B6'],
      'newNames':  ['blue',  'green', 'red',   'nir',   'swir1', 'swir2', 'pixel_qa', 'temp']
  },
  
  'l8_sr2' : {
      'bandNames': ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7', 'ST_B10',  'QA_PIXEL'],
      'newNames':  ['blue',  'green', 'red',   'nir',   'swir1', 'swir2', 'temp',    'pixel_qa']
  },
  'l5toa': {
      'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'BQA', 'B6'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'BQA', 'temp']
  },
  
 'l7toa': {
      'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'BQA', 'B6_VCID_1'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'BQA', 'temp']
  },

  'l8toa' : {
      'bandNames': ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'BQA', 'B11'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal', 'BQA', 'temp']
  },
  
  'sentinel2' : {
      'bandNames': ['B2','B3','B4','B8','B11','B12','QA60'],
      'newNames': ['blue','green','red','nir','swir1','swir2','BQA']
    },
};

/**
 * @name
 *      rename
 * @description
 *     Padroniza os nomes  das bandas de imagens landsat 5,7, e sentinel 2
 * @argument
 *      Objecto contendo o atributo
 *          @attribute key {String}
 * @example
 *      var bands_l7 = get('l7');
 * @returns
 *      Dictionary
 */
exports.get = function (key) {

    return bandNames[key];
};