/**
 * @name 
 *      MapBiomas Integration Toolkit
 * 
 * @description
 *  
 * @author
 *      João Siqueira
 *      joaovsiqueira1@gmail.com
 *
 * @version
 *  1.0.0
 *  1.0.6
 *  1.1.0 - Atualização das regras de prevalência da integração
 *  1.2.0 - Atualização das regras de prevalência da integração para a coleção 4.0
 *  1.3.0 - Atualização das regras de prevalência da integração para a coleção 4.1
 *  1.3.1 - Atualização dos dados da Amazônia, Cerrado e Mata Atlântica para integração da coleção 4.1
 *  1.4.0 - Atualização dos dados da coleção 5.0
 *  1.4.1 - Otimização do filtro espacial
 *  1.5.0 - Atualização da regra de integração da mata atlântica
 *  1.6.0 - Otimização do tempo de exportação
 *  
 */  
var outputAsset = 'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/integracion-pais';

var outputVersion = 1; 

// import modules
var Legend = require('users/joaovsiqueira1/packages:Legend.js');

var palette = [
    '#ffffff', // [00]      0. Ausência de dados
    '#129912', // [01]      1. Floresta
    '#1f4423', // [02]    1.1. Floresta Natural
    '#006400', // [03]  1.1.1. Formação Florestal
    '#00ff00', // [04]  1.1.2. Formação Savânica
    '#687537', // [05]  1.1.3. Mangue
    '#76a5af', // [06]-
    '#29eee4', // [07]-
    '#77a605', // [08]-
    '#935132', // [09]    1.2. Floresta Plantada
    '#bbfcac', // [10]      2. Formação Natural não Florestal
    '#45c2a5', // [11]    2.1. Área Úmida Natural não Florestal
    '#b8af4f', // [12]    2.2. Formação Campestre
    '#f1c232', // [13]    2.5. Outra Formação não Florestal
    '#ffffb2', // [14]      3. Agropecuária
    '#ffd966', // [15]    3.1. Pastagem
    '#f6b26b', // [16]-
    '#f99f40', // [17]-
    '#e974ed', // [18]    3.2. Agricultura
    '#d5a6bd', // [19]  3.2.1. Lavoura Temporária
    '#c27ba0', // [20]3.2.1.2. Cana
    '#fff3bf', // [21]    3.3. Mosaico de Agricultura ou Pastagem
    '#ea9999', // [22]      4. Área não Vegetada
    '#dd7e6b', // [23]    4.3. Praia e Duna
    '#aa0000', // [24]    4.1. Infraestrutura Urbana //'#aa0000'
    '#ff99ff', // [25]    4.4. Outra Área não Vegetada  //'#ff0000',
    '#0000ff', // [26]      5. Corpo D'água
    '#d5d5e5', // [27]      6. Não Observado
    '#dd497f', // [28]-
    '#b2ae7c', // [29]    2.4. Afloramento Rochoso
    '#580000', // [30]    4.2. Mineração   //'#af2a2a'
    '#8a2be2', // [31]  5.2.3. Aquicultura
    '#968c46', // [32]    2.3. Apicum
    '#0000ff', // [33]    5.1. Corpo dágua Natura
    '#4fd3ff', // [34]    5.3. Glaciais
    '#645617', // [35]-
    '#f3b4f1', // [36]  3.2.3. Lavoura Perene
    '#02106f', // [37]    5.2. Corpo dágua Artificial
    '#02106f', // [38]  5.2.1. Reservatórios
    '#c59ff4', // [39]3.2.1.1. Soja
    '#ba87f8', // [40]3.2.1.3. Arroz
    '#e787f8', // [41]3.2.1.4. Outros
    '#cca0d4', // [42]3.2.2.1. Café
    '#d082de', // [43]3.2.2.1. Citrus
    '#cd49e4', // [44]3.2.2.1. Caju
    '#e04cfa', // [45]3.2.2.1. Outros
];

var App = {

    options: {
        // app version
        version: '1.5.0',

        // assets versions
        versions: {
            // paises
            // bol: '3',
            // col: '1',
            // ecu: '1',
            // guf: '1',
            // guy: '1',
            per: '1',
            // sur: '1',
            // ven: '1',
            // transversais
            agr: '1',
            pas: '1',
            min: '1',
            // pec: '1',
            urb: '1',
            // fpt: '1',
            // znc: '1',
            fld: '1',
            wat: '1',
            glc: '1',
            // man:'1'
        },

        assets: { 
            // ancilary data
            // biomes: 'projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41',
            regions: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/paises-4',
            subregions: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',

            mosaic: 'projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2',
            regionMosRaster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/mosaico-regiones-4',

            classification: 'projects/mapbiomas-raisg/COLECCION4/INTEGRACION/clasificacion',
            collection1: 'projects/mapbiomas-raisg/public/collection1/mapbiomas_raisg_panamazonia_collection1_integration_v1',
            collection2: 'projects/mapbiomas-raisg/public/collection2/mapbiomas_raisg_panamazonia_collection2_integration_v2',
            collection3: 'projects/mapbiomas-raisg/public/collection3/mapbiomas_raisg_panamazonia_collection3_integration_v2',

            // transversal data
            urb: 'projects/mapbiomas-raisg/TRANSVERSALES/PERU/COLECCION4/URBANA/INTEGRACION/urbana4',
            wat: 'projects/mapbiomas-raisg/TRANSVERSALES/PERU/COLECCION4/AGUA/INTEGRACION/agua4',
            glc: 'projects/mapbiomas-raisg/TRANSVERSALES/PERU/COLECCION4/GLACIAR/INTEGRACION/glaciar4',
            agr: 'projects/mapbiomas-raisg/TRANSVERSALES/PERU/COLECCION4/AGRICULTURA/INTEGRACION/agricultura4',
            pas: 'projects/mapbiomas-raisg/TRANSVERSALES/PERU/COLECCION4/PASTURE/INTEGRACION/pasture4',
            fld: 'projects/mapbiomas-raisg/TRANSVERSALES/PERU/COLECCION4/INUNDABLE/INTEGRACION/inundable64',
            min: 'projects/mapbiomas-raisg/TRANSVERSALES/PERU/COLECCION4/MINERIA/INTEGRACION/mineria4',
            //man: 'projects/mapbiomas-raisg/TRANSVERSALES/MANGLARES3_0',
            //projects/mapbiomas-raisg/TRANSVERSALES/MANGLARES3_0/ZC-1999-1

            // agr: 'projects/mapbiomas-workspace/TRANSVERSAIS/AGRICULTURA5-FT',
            // fpt: 'projects/mapbiomas-workspace/TRANSVERSAIS/FLORESTAPLANTADA5-FT',
            //pec: 'projects/mapbiomas-workspace/TRANSVERSAIS/PECUARIA5-FT',
            // znc: 'projects/mapbiomas-workspace/TRANSVERSAIS/ZONACOSTEIRA5-FT',
            //min: 'projects/mapbiomas-workspace/TRANSVERSAIS/MINERACAO5-FT',
            //fld: 'projects/mapbiomas-workspace/TRANSVERSAIS/FLOOD5-FT',

            // vector data
            grids: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/cartas-mapbiomas-2',
            regionsVector: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/clasificacion-regiones-4',
            regionsRaster: 'projects/mapbiomas-raisg/DATOS_AUXILIARES/RASTERS/clasificacion-regiones-4',
        },

        ids: {
            bol: 7,
            col: 3,
            ecu: 5,
            guf: 9,
            guy: 2,
            per: 8,
            sur: 6,
            ven: 1,
            per_reg703: 703,
            per_reg702: 702,
            per_reg701: 701,
            per_reg1: 70208
        },

        prefix: {
            // bol: '/BOLIVIA-',
            // col: '/COLOMBIA-',
            // ecu: '/ECUADOR-',
            //guf: '/GUIANA_FRANCESA-', // TODO: revisar esse prefixo
            //guy: '/GUYANA-',
            per: '/PERU-',
            //sur: '/SURINAME-',
            // ven: '/VENEZUELA-',
        },

        year: '2020',

        layers: [],

        classification: null,
        integration: null,
        mosaics: null,
        regions: null,
        collection1: null,
        collection2: null,
        collection3: null,

        vis: {
            'integration': {
                'min': 0,
                'max': 45,
                'palette': palette,
                'format': 'png'
            },

            'mosaic': {
                'bands': ['swir1_median', 'nir_median', 'red_median'],
                'gain': [0.08, 0.06, 0.2],
                'gamma': 0.65
            },

            // 'pasture': {},
            // 'agriculture': {},
            // 'plantedForest': {},
            // 'urbanArea': {},
            // 'coastalZone': {},

            'vectors': {
                color: 'ff0000',
                fillColor: '00000000',
                width: 2
            }
        },

        'prevalenceList': [],
        
        'legend': {
            'params': {
                "title": 'Legend',
                "layers": [
                    // ['#ffffff', 0, '0. Ausência de dados'],
                    // ['#129912', 1, '1. Floresta'],
                    // ['#1f4423', 2, '1.1. Floresta Natural'],
                    ['#006400', 3, '1.1.1. Formação Florestal'],
                    ['#00ff00', 4, '1.1.2. Formação Savânica'],
                    ['#687537', 5, '1.1.3. Mangue'],
                    ['#935132', 9, '1.2. Floresta Plantada'],
                    // ['#bbfcac', 10, '2. Formação Natural não Florestal'],
                    ['#45c2a5', 11, '2.1. Área Úmida Natural não Florestal'],
                    ['#b8af4f', 12, '2.2. Formação Campestre'],
                    ['#f1c232', 13, '2.5. Outra Formação não Florestal'],
                    // ['#ffffb2', 14, '3. Agropecuária'],
                    ['#ffd966', 15, '3.1. Pastagem'],
                    ['#e974ed', 18, '3.2. Agricultura'],
                    // ['#d5a6bd', 19, '3.2.1. Lavoura Temporária'],
                    // ['#c27ba0', 20, '3.2.1.2. Cana'],
                    ['#fff3bf', 21, '3.3. Mosaico de Agricultura ou Pastagem'],
                    // ['#ea9999', 22, '4. Área não Vegetada'],
                    ['#dd7e6b', 23, '4.3. Praia e Duna'],
                    ['#aa0000', 24, '4.1. Infraestrutura Urbana'],
                    ['#ff99ff', 25, '4.4. Outra Área não Vegetada'],
                    // ['#0000ff', 26, '5. Corpo Dágua'],
                    // ['#d5d5e5', 27, '6. Não Observado'],
                    // ['#b2ae7c', 29, '2.4. Afloramento Rochoso'],
                    ['#580000', 30, '4.2. Mineração'],
                    // ['#8a2be2', 31, '5.2.3. Aquicultura'],
                    // ['#968c46', 32, '2.3. Apicum'],
                    ['#0000ff', 33, '5.1. Corpo Dágua Natura'],
                    ['#4fd3ff', 34, '5.3. Glaciais'],
                    ['#645617', 35, 'clase 35'],
                    // ['#f3b4f1', 36, '3.2.3. Lavoura Perene'],
                    // ['#02106f', 37, '5.2. Corpo Dágua Artificial'],
                    // ['#02106f', 38, '5.2.1. Reservatórios'],
                    // ['#c59ff4', 39, '3.2.1.1. Soja'],
                    // ['#ba87f8', 40, '3.2.1.3. Arroz'],
                    // ['#e787f8', 41, '3.2.1.4. Outros'],
                    // ['#cca0d4', 42, '3.2.2.1. Café'],
                    // ['#d082de', 43, '3.2.2.1. Citrus'],
                    // ['#cd49e4', 44, '3.2.2.1. Caju'],
                    // ['#e04cfa', 45, '3.2.2.1. Outros']
                ],
                "style": {
                    "backgroundColor": "#ffffff",
                    "color": "#212121"
                },
                "orientation": "vertical"
            }
        }

    },

    init: function () {

        App.loadData();
        App.ui.init()

    },

    setVersion: function () {

        App.ui.form.labelTitle.setValue('MapBiomas Integration Toolkit ' + App.options.version);

    },

    getPrevalenceList: function () {

        var prevalenceList = [
          // Amazonia Alta
              {
                'prevalence_id': 1,
                'label': 'Plantaciones Forestales (T)',
                'rule': {
                    'class_input': 9,
                    'class_output': 9,
                    'source':  App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                },
                'exception': null,
                'exception2': null
              },
              
              {
                'prevalence_id': 2,
                'label': 'Infraestructura Urbana (T)',
                'rule': {
                    'class_input': 24,
                    'class_output': 24,
                    'source': App.options.assets.urb + App.options.prefix.per + App.options.year + '-' + App.options.versions.urb
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [30],
                            'source': App.options.assets.min + App.options.prefix.per + App.options.year + '-' + App.options.versions.min
                        }
                    ],
                    'class_output': 30
                },
              'exception2': null
              },
              
              {
                'prevalence_id': 3,
                'label': 'Agua (G)',
                'rule': {
                    'class_input': 33,
                    'class_output': 33,
                    'source': App.options.classification
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [24],
                            'source': App.options.assets.urb + App.options.prefix.per + App.options.year + '-' + App.options.versions.urb
                        }
                    ],
                    'class_output': 24
                },
              'exception2': null
              },
              
              {
                'prevalence_id': 4,
                'label': 'Agua (T)',
                'rule': {
                    'class_input': 33,
                    'class_output': 33,
                    'source': App.options.assets.wat + App.options.prefix.per + App.options.year + '-' + App.options.versions.wat
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [18],
                            'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                        }
                    ],
                    'class_output': 18
                },
              'exception2': null
              }, 

              {
                'prevalence_id': 5,
                'label': 'Minería (T)',
                'rule': {
                    'class_input': 30,
                    'class_output': 30,
                    'source': App.options.assets.min + App.options.prefix.per + App.options.year + '-' + App.options.versions.min
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [15],
                            'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                        }
                    ],
                    'class_output': 15
                },
              'exception2': null
              },
              
              {
                'prevalence_id': 6,
                'label': 'Agricultura (T)',
                'rule': {
                    'class_input': 18,
                    'class_output': 18,
                    'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg702,
                                // App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [25],
                            'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                        }
                    ],
                    'class_output': 25
                },
              'exception2': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [21],
                            'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                        }
                    ],
                    'class_output': 21
                }
              },
              
              {
                'prevalence_id': 7,
                'label': 'Pastos (T)',
                'rule': {
                    'class_input': 15,
                    'class_output': 15,
                    'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                },
                'exception':  {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg702,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [18],
                            'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                        }
                    ],
                    'class_output': 18
                },
              'exception2': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [13],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 13
                }
              },

              {
                'prevalence_id': 8,
                'label': 'Mosaico de agricultura y pasto (G)',
                'rule': {
                    'class_input': 21,
                    'class_output': 21,
                    'source': App.options.classification
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg702,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [15],
                            'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                        }
                    ],
                    'class_output': 15
                },
              'exception2': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [3],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 3
                }
              },

              {
                'prevalence_id': 9,
                'label': 'Mosaico de agricultura y pasto (T)',
                'rule': {
                    'class_input': 21,
                    'class_output': 21,
                    'source': App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr
                },
                'exception': null,
                'exception2': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [4],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 4
                }
              },
              
              {
                'prevalence_id': 10,
                'label': 'FNNF inundable (T)',
                'rule': {
                    'class_input': 11,
                    'class_output': 11,
                    'source': App.options.assets.fld + App.options.prefix.per + App.options.year + '-' + App.options.versions.fld
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg702,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [21],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 21
                },
                'exception2': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [21],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 21
                }
              },
              
              {
                'prevalence_id': 11,
                'label': 'FNNF inundable (G)',
                'rule': {
                    'class_input': 11,
                    'class_output': 11,
                    'source': App.options.classification
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg702,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [11],
                            'source': App.options.assets.fld + App.options.prefix.per + App.options.year + '-' + App.options.versions.fld
                        }
                    ],
                    'class_output': 11
                },
                'exception2': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [11],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 11
                }
              },
              
              {
                'prevalence_id': 12,
                'label': 'Glaciar (T)',
                'rule': {
                    'class_input': 34,
                    'class_output': 34,
                    'source': App.options.assets.glc + App.options.prefix.per + App.options.year + '-' + App.options.versions.glc
                },
                'exception': null,
                'exception2': null
              },
              
              {
                'prevalence_id': 13,
                'label': 'Otra área sin vegetación (G)',
                'rule': {
                    'class_input': 25,
                    'class_output': 25,
                    'source': App.options.classification
                },
                'exception': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg702,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [11],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 11
                },
                'exception2': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [12],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 12
                }
              },
              
              {
                'prevalence_id': 14,
                'label': 'Formacion campestre (G)',
                'rule': {
                    'class_input': 12,
                    'class_output': 12,
                    'source': App.options.classification
                },
                'exception': null,
                'exception2': {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [34],
                            'source': App.options.assets.glc + App.options.prefix.per + App.options.year + '-' + App.options.versions.glc
                        }
                    ],
                    'class_output': 34
                }
              },
              
              {
                'prevalence_id': 15,
                'label': 'Otra FNNF (G)',
                'rule': {
                    'class_input': 13,
                    'class_output': 13,
                    'source': App.options.classification
                },
                'exception': null,
                'exception2': null
              },

              {
                'prevalence_id': 16,
                'label': 'Bosque inundable (T)',
                'rule': {
                    'class_input': 6,
                    'class_output': 6,
                    'source': App.options.assets.fld + App.options.prefix.per + App.options.year + '-' + App.options.versions.fld
                },
                'exception': null,
                'exception2':  {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [33],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 33
                }
              },
              
              {
                'prevalence_id': 17,
                'label': 'Bosque inundable (T)',
                'rule': {
                    'class_input': 6,
                    'class_output': 6,
                    'source': App.options.classification
                },
                'exception': null,
                'exception2':  {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [33],
                            'source': App.options.assets.wat + App.options.prefix.per + App.options.year + '-' + App.options.versions.wat
                        }
                    ],
                    'class_output': 33
                }
              },
              
              {
                'prevalence_id': 18,
                'label': 'Bosque inundable (T)',
                'rule': {
                    'class_input': 4,
                    'class_output': 4,
                    'source': App.options.classification
                },
                'exception': null,
                'exception2':  {
                    'rule': [
                        {
                            'class_input': [
                                App.options.ids.per_reg703,
                            ],
                            'source': App.options.assets.regionMosRaster
                        },
                        {
                            'class_input': [25],
                            'source': App.options.classification
                        }
                    ],
                    'class_output': 25
                }
              },
              
              {
                'prevalence_id': 19,
                'label': 'Bosque (T)',
                'rule': {
                    'class_input': 3,
                    'class_output': 3,
                    'source': App.options.classification
                },
                'exception': null,
                'exception2': null
              },
              
        ];

        return prevalenceList;
    },

    getClassifications: function () {

        // var ecu = ee.Image([App.options.assets.classification, App.options.prefix.ecu, App.options.year, '-', App.options.versions.ecu].join(''));
        // var col = ee.Image([App.options.assets.classification, App.options.prefix.col, App.options.year, '-', App.options.versions.col].join(''));
        // var ecu = ee.Image([App.options.assets.classification, App.options.prefix.ecu, App.options.year, '-', App.options.versions.ecu].join(''));
        //var guf = ee.Image([App.options.assets.classification, App.options.prefix.guf, App.options.year, '-', App.options.versions.guf].join(''));
        //var guy = ee.Image([App.options.assets.classification, App.options.prefix.guy, App.options.year, '-', App.options.versions.guy].join(''));
        var per = ee.Image([App.options.assets.classification, App.options.prefix.per, App.options.year, '-', App.options.versions.per].join(''));
        //var sur = ee.Image([App.options.assets.classification, App.options.prefix.sur, App.options.year, '-', App.options.versions.sur].join(''));
        // var ven = ee.Image([App.options.assets.classification, App.options.prefix.ven, App.options.year, '-', App.options.versions.ven].join(''));

        var image = ee.ImageCollection.fromImages([
            // ecu.mask(App.options.regions.eq(App.options.ids.ecu)).rename('classification'),
            // col.mask(App.options.regions.eq(App.options.ids.col)).rename('classification'),
            // ecu.mask(App.options.regions.eq(App.options.ids.ecu)).rename('classification'),
            //guf.mask(App.options.regions.eq(App.options.ids.guf)).rename('classification'),
            //guy.mask(App.options.regions.eq(App.options.ids.guy)).rename('classification'),
            per.mask(App.options.regions.eq(App.options.ids.per)).rename('classification'),
            //sur.mask(App.options.regions.eq(App.options.ids.sur)).rename('classification'),
            // ven.mask(App.options.regions.eq(App.options.ids.ven)).rename('classification'),
        ]).min();

        return image;
    },

    getMosaics: function () {
      
      var regionMosaicRaster = ee.Image(App.options.assets.regionMosRaster)
      
      var filterByYear = ee.Filter.eq('year', parseInt(App.options.year, 10));
      
      var collection = ee.ImageCollection(App.options.assets.mosaic)
                                .filter(filterByYear)
                                .select(['swir1_median', 'nir_median', 'red_median'])
                                .map(
                                    function (image) {
                                        return image.updateMask(
                                            regionMosaicRaster.eq(ee.Number.parse(image.get('region_code')).toInt16()));
                                    }
                                );
      
        // var ecu = collection
        //     .filterMetadata('country', 'equals', 'ECUADOR')
        //     .mosaic();

        // var col = collection
        //     .filterMetadata('biome', 'equals', 'COLOMBIA')
        //     .mosaic();

        // var ecu = collection
        //     .filterMetadata('biome', 'equals', 'ECUADOR')
        //     .mosaic();

        //var guf = collection
        //   .filterMetadata('country', 'equals', 'GUIANA_FRANCESA') // TODO: confirmar o padrão deste país
       //    .mosaic();

        //var guy = collection
        //   .filterMetadata('country', 'equals', 'GUYANA')
        //   .mosaic();

        var per = collection
            .filterMetadata('country', 'equals', 'PERU')
            .mosaic();

        //var sur = collection
        //   .filterMetadata('country', 'equals', 'SURINAME')
       //    .mosaic();

        // var ven = collection
        //     .filterMetadata('biome', 'equals', 'VENEZUELA')
        //     .mosaic();

        var image = ee.ImageCollection.fromImages([
            // ecu.mask(App.options.regions.eq(App.options.ids.ecu)),
            // col.mask(App.options.regions.eq(App.options.ids.col)),
            // ecu.mask(App.options.regions.eq(App.options.ids.ecu)),
            //guf.mask(App.options.regions.eq(App.options.ids.guf)),
            //guy.mask(App.options.regions.eq(App.options.ids.guy)),
            per.mask(App.options.regions.eq(App.options.ids.per)),
            //sur.mask(App.options.regions.eq(App.options.ids.sur)),
            // ven.mask(App.options.regions.eq(App.options.ids.ven)),
        ]).mosaic();

        return image;
    },
    
    getRegions: function () {

        var regions = ee.Image(App.options.assets.regions);

        return regions;
    },

    getCollections: function () {

        App.options.collection1 = ee.Image(App.options.assets.collection1)
            .select('classification_' + App.options.year);

        App.options.collection2 = ee.Image(App.options.assets.collection2)
            .select('classification_' + App.options.year);
            
        App.options.collection3 = ee.Image(App.options.assets.collection3)
            .select('classification_' + App.options.year);
    },
    
    loadLayers: function () {
        App.options.layers = [
            {
                'name': 'Mosaic',
                'data': App.options.mosaics,
                'shown': true
            },
            {
                'name': 'Classification',
                'data': App.options.classification,
                'shown': true
            },
            {
                'name': 'Integration',
                'data': App.options.integrated,
                'shown': true
            },
            // {
            //     'name': 'Coastal Zone',
            //     'data': ee.Image(App.options.assets.znc + '/' + App.options.year + '-' + App.options.versions.znc).selfMask(),
            //     'shown': false
            // },
            {
                'name': 'Flooded',
                'data': ee.Image(App.options.assets.fld + App.options.prefix.per + App.options.year + '-' + App.options.versions.fld).selfMask(),
                'shown': false
            },
            {
                'name': 'Mining',
                'data': ee.Image(App.options.assets.min + App.options.prefix.per + App.options.year + '-' + App.options.versions.min).selfMask(),
                'shown': false
            },
            {
                'name': 'Agriculture',
                'data': ee.Image(App.options.assets.agr + App.options.prefix.per + App.options.year + '-' + App.options.versions.agr).selfMask(),
                'shown': false
            },
            {
               'name': 'Pasture',
               'data': ee.Image(App.options.assets.pas + App.options.prefix.per + App.options.year + '-' + App.options.versions.pas).selfMask(),
               'shown': false
            },
            {
               'name': 'Glacier',
               'data': ee.Image(App.options.assets.glc + App.options.prefix.per + App.options.year + '-' + App.options.versions.glc).selfMask(),
               'shown': false
            },
             
            // {
            //     'name': 'Forest Plantation',
            //     'data': ee.Image(App.options.assets.fld + '/' + App.options.year + '-' + App.options.versions.fpt).selfMask(),
            //     'shown': false
            // },
            {
                'name': 'Urban',
                'data': ee.Image(App.options.assets.urb + App.options.prefix.per + App.options.year + '-' + App.options.versions.urb).selfMask(),
                'shown': false
            },
            //{
            //    'name': 'Mangrove',
            //    'data': (ee.ImageCollection([
            //      //App.options.assets.man + App.options.prefix.gufm +'_class5_' +App.options.year
            //      ee.Image(App.options.assets.man + App.options.prefix.gufm +'_class5_' +App.options.year),
            //      ee.Image(App.options.assets.man + App.options.prefix.guym +'_class5_' +App.options.year),
            //      ee.Image(App.options.assets.man + App.options.prefix.surm +'_class5_' +App.options.year),
            //      ])).mosaic().selfMask(),
            //    'shown': false
            //},
            
            {
                'name': 'Water',
                'data': ee.Image(App.options.assets.wat + App.options.prefix.per + App.options.year + '-' + App.options.versions.wat).selfMask(),
                'shown': false
            },
            {
                'name': 'Collection1',
                'data': App.options.collection1,
                'shown': false
            },
            {
                'name': 'Collection2',
                'data': App.options.collection2,
                'shown': false
            },
            {
                'name': 'Collection3',
                'data': App.options.collection3,
                'shown': false
            },
            {
                'name': 'Grids',
                'data': ee.Image().paint(ee.FeatureCollection(App.options.assets.grids), 25, 2),
                'shown': false
            },
            {
                'name': 'Regions',
                'data': ee.Image().paint(ee.FeatureCollection(App.options.assets.regionsVector), 25, 2),
                'shown': false
            },
        ];
    },
    
    loadData: function () {

        App.options.regions = App.getRegions();

        App.options.classification = App.getClassifications();

        App.options.mosaics = App.getMosaics();

        App.options.prevalenceList = App.getPrevalenceList();
        
        App.options.integrated = App.integrate(App.options.year);

        // loads olf collections
        App.getCollections();

        App.loadLayers();
    },

    integrate: function (year) {

        App.options.year = String(year);

        App.options.classification = App.getClassifications();
        
        App.options.prevalenceList = App.getPrevalenceList();

        App.options.integrated = App.recursion(
            ee.Image(0),
            App.options.prevalenceList,
            App.options.prevalenceList.filter(App.filterByPrevalence, {
                'id': App.options.prevalenceList.length
            })
        );

        return App.options.integrated.mask(App.options.regions.neq(0))
            .rename('classification_' + App.options.year);

    },

    filterByPrevalence: function (obj) {

        return obj.prevalence_id == this.id;

    },

    applyRule: function (image, obj) {
        
        var mask = ee.Image(obj.rule.source)
            .unmask()
            .eq(obj.rule.class_input);

        var integrated = image
            .where(mask.eq(1), obj.rule.class_output);

        if (obj.exception !== null) {

            var maskExceptionList = obj.exception.rule.map(
                function (item) {

                    return ee.Image(item.source)
                        .unmask()
                        .remap(item.class_input, ee.List.repeat(1, item.class_input.length), 0)
                        .rename(['mask']);
                }
            );

            var maskException = ee.ImageCollection.fromImages(maskExceptionList)
                .reduce(ee.Reducer.product())
                .multiply(mask);

            integrated = integrated
                .where(maskException.eq(1), obj.exception.class_output);
        }
        
        if (obj.exception2 !== null) {

            var maskExceptionList2 = obj.exception2.rule.map(
                function (item) {

                    return ee.Image(item.source)
                        .unmask()
                        .remap(item.class_input, ee.List.repeat(1, item.class_input.length), 0)
                        .rename(['mask']);
                }
            );

            var maskException2 = ee.ImageCollection.fromImages(maskExceptionList2)
                .reduce(ee.Reducer.product())
                // .multiply(mask);

            integrated = integrated
                .where(maskException2.eq(1), obj.exception2.class_output);
        }
        
        return integrated;
    },

    recursion: function (image, prevalenceList, obj) {

        var integrated;
        
        obj = obj[0];
        

        integrated = App.applyRule(image, obj);

        if (obj.prevalence_id > 1) {

            integrated = App.recursion(
                integrated,
                prevalenceList,
                prevalenceList.filter(App.filterByPrevalence, {
                    'id': obj.prevalence_id - 1
                })
            );

        }

        return integrated;
    },

    ui: {

        init: function () {

            App.ui.form.init();

        },

        clear: function () {
           App.options.layers.forEach(
                function (layer) {

                    App.ui.manageLayers(
                        false,
                        layer
                    );

                }
            );
        },
        update: function () {

            var layersState = App.options.layers;

            App.loadData();

            App.options.layers.forEach(
                function (layer, index) {

                    App.options.layers[index].shown = layersState[index].shown

                    App.ui.manageLayers(
                        layer.shown,
                        layer
                    );

                }
            );
        },

        addImageLayer: function (layer) {
            var imageLayer
            if (layer.name === 'Mosaic') {
             imageLayer = ui.Map.Layer({
                'eeObject': layer.data,
                'visParams': App.options.vis.mosaic,
                'name': layer.name,
                'shown': layer.shown,
                'opacity': 1.0
            });
               } else {
             imageLayer = ui.Map.Layer({
                'eeObject': layer.data,
                'visParams': App.options.vis.integration,
                'name': layer.name,
                'shown': layer.shown,
                'opacity': 1.0
            });
            }
            Map.add(imageLayer);

        },

        removeImageLayer: function (layer) {

            for (var i = 0; i < Map.layers().length(); i++) {

                var mapItem = Map.layers().get(i);

                if (layer.name === mapItem.get('name')) {
                    Map.remove(mapItem);
                }
            }

        },

        manageLayers: function (checked, layer) {

            if (checked) {
                App.ui.addImageLayer(layer);
            } else {
                App.ui.removeImageLayer(layer);
            }

        },

        buildLayerList: function () {

            App.options.layers.forEach(
                function (layer) {

                    var checkbox = ui.Checkbox({
                        "label": layer.name,
                        "value": false,
                        "onChange": function (checked) {

                            App.ui.manageLayers(
                                checked,
                                layer
                            );

                        },
                        "disabled": false,
                        "style": {
                            'padding': '2px',
                            'stretch': 'horizontal',
                            'backgroundColor': '#dddddd',
                            'fontSize': '12px'
                        }
                    });

                    App.ui.form.panelLayersList.add(checkbox);

                    checkbox.setValue(layer.shown, true);
                }
            );
        },

        form: {

            init: function () {

                App.ui.buildLayerList();
                
                App.ui.form.panelMain.add(App.ui.form.labelTitle);
                App.ui.form.panelMain.add(App.ui.form.selectYear0);
                App.ui.form.panelMain.add(App.ui.form.labelLayers);
                App.ui.form.panelMain.add(App.ui.form.panelLayersList);
                
                App.ui.form.panelLegend.add(Legend.getLegend(App.options.legend.params));
                App.ui.form.panelLegend.add(App.ui.form.buttonHideLegend);
                
                Map.add(App.ui.form.panelLegend);
                Map.add(App.ui.form.panelMain);

            },

            panelMain: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'width': '250px',
                    'position': 'bottom-left',
                    'margin': '0px 0px 0px 0px',
                },
            }),

            panelLayersList: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    // 'height': '270px',
                    'stretch': 'vertical',
                    'backgroundColor': '#cccccc',
                },
            }),
            
            panelLegend: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'vertical',
                    'position': 'bottom-right'
                },
            }),

            labelTitle: ui.Label('MapBiomas Integration Toolkit', {
                'fontWeight': 'PERUd',
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            labelLayers: ui.Label('Layers:', {
                // 'padding': '1px',
                'fontSize': '16px'
            }),

            selectYear0: ui.Select({
                'items': [
                    '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992',
                    '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000',
                    '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008',
                    '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016',
                    '2017', '2018', '2019', '2020', '2021'
                ],
                'placeholder': 'select year',
                'value': '2020',
                'onChange': function (year) {

                    App.ui.clear();

                    App.options.year = year;

                    //App.loadData();
                    App.ui.update();
                    //App.ui.startLayers();

                },
                'style': {
                    'stretch': 'horizontal'
                }
            }),
            buttonHideLegend: ui.Button({
                'label': '➖️',
                'onClick': function () {
                    Map.remove(App.ui.form.panelLegend);
                    Map.add(App.ui.form.buttonShowLegend)
                },
                'style': {
                    'position': 'bottom-right',
                    'padding': '0px',
                }
            }),

            buttonShowLegend: ui.Button({
                'label': '➕️',
                'onClick': function () {
                    Map.remove(App.ui.form.buttonShowLegend)
                    Map.add(App.ui.form.panelLegend);
                },
                'style': {
                    'position': 'bottom-right',
                    'padding': '0px',
                }
            }),

        },
    }
};

/**
* 
*/
var filterParams = [
    {
        'classValue': 1,
        'maxSize': 5
    },
    {
        'classValue': 2,
        'maxSize': 5
    },
    {
        'classValue': 3,
        'maxSize': 5
    },
    {
        'classValue': 4,
        'maxSize': 5
    },
    {
        'classValue': 5,
        'maxSize': 5
    },
    {
        'classValue': 6,
        'maxSize': 5
    },
    {
        'classValue': 7,
        'maxSize': 5
    },
    {
        'classValue': 8,
        'maxSize': 5
    },
    {
        'classValue': 9,
        'maxSize': 5
    },
    {
        'classValue': 10,
        'maxSize': 5
    },
    {
        'classValue': 11,
        'maxSize': 5
    },
    {
        'classValue': 12,
        'maxSize': 5
    },
    {
        'classValue': 13,
        'maxSize': 5
    },
    {
        'classValue': 14,
        'maxSize': 5
    },
    {
        'classValue': 15,
        'maxSize': 5
    },
    {
        'classValue': 16,
        'maxSize': 5
    },
    {
        'classValue': 17,
        'maxSize': 5
    },
    {
        'classValue': 18,
        'maxSize': 5
    },
    {
        'classValue': 19,
        'maxSize': 5
    },
    {
        'classValue': 20,
        'maxSize': 5
    },
    {
        'classValue': 21,
        'maxSize': 5
    },
    {
        'classValue': 22,
        'maxSize': 5
    },
    {
        'classValue': 23,
        'maxSize': 5
    },
    {
        'classValue': 24,
        'maxSize': 5
    },
    {
        'classValue': 25,
        'maxSize': 5
    },
    {
        'classValue': 26,
        'maxSize': 5
    },
    {
        'classValue': 27,
        'maxSize': 5
    },
    {
        'classValue': 28,
        'maxSize': 5
    },
    {
        'classValue': 29,
        'maxSize': 5
    },
    {
        'classValue': 30,
        'maxSize': 5
    },
    {
        'classValue': 31,
        'maxSize': 5
    },
    {
        'classValue': 32,
        'maxSize': 5
    },
    {
        'classValue': 33,
        'maxSize': 5
    },
    {
        'classValue': 36,
        'maxSize': 5
    },
    {
        'classValue': 37,
        'maxSize': 5
    },
    {
        'classValue': 38,
        'maxSize': 5
    },
    {
        'classValue': 39,
        'maxSize': 5
    },
    {
        'classValue': 40,
        'maxSize': 5
    },
    {
        'classValue': 41,
        'maxSize': 5
    },
    {
        'classValue': 42,
        'maxSize': 5
    },
    {
        'classValue': 43,
        'maxSize': 5
    },
    {
        'classValue': 44,
        'maxSize': 5
    },
    {
        'classValue': 45,
        'maxSize': 5
    },

];


/**
 * Classe de pos-classificação para reduzir ruídos na imagem classificada
 * 
 * @param {ee.Image} image [eeObjeto imagem de classificação]
 *
 * @example
 * var image = ee.Image("aqui vem a sua imagem");
 * var filterParams = [
 *     {classValue: 1, maxSize: 3},
 *     {classValue: 2, maxSize: 5}, // o tamanho maximo que o mapbiomas está usado é 5
 *     {classValue: 3, maxSize: 5}, // este valor foi definido em reunião
 *     {classValue: 4, maxSize: 3},
 *     ];
 * var pc = new PostClassification(image);
 * var filtered = pc.spatialFilter(filterParams);
 */
var PostClassification = function (image) {

    this.init = function (image) {

        this.image = image;

    };

    var majorityFilter = function (image, params) {

        params = ee.Dictionary(params);
        var maxSize = ee.Number(params.get('maxSize'));
        var classValue = ee.Number(params.get('classValue'));

        // Generate a mask from the class value
        var classMask = image.eq(classValue);

        // Labeling the group of pixels until 100 pixels connected
        var labeled = classMask.mask(classMask).connectedPixelCount(maxSize, true);

        // Select some groups of connected pixels
        var region = labeled.lt(maxSize);

        // Squared kernel with size shift 1
        // [[p(x-1,y+1), p(x,y+1), p(x+1,y+1)]
        // [ p(x-1,  y), p( x,y ), p(x+1,  y)]
        // [ p(x-1,y-1), p(x,y-1), p(x+1,y-1)]
        var kernel = ee.Kernel.square(1);

        // Find neighborhood
        var neighs = image.neighborhoodToBands(kernel).mask(region);

        // Reduce to majority pixel in neighborhood
        var majority = neighs.reduce(ee.Reducer.mode());

        // Replace original values for new values
        var filtered = image.where(region, majority);

        return filtered.byte();

    };

    /**
     * Método para reclassificar grupos de pixels de mesma classe agrupados
     * @param  {list<dictionary>} filterParams [{classValue: 1, maxSize: 3},{classValue: 2, maxSize: 5}]
     * @return {ee.Image}  Imagem classificada filtrada
     */
    this.spatialFilter = function (filterParams) {

        var image = ee.List(filterParams)
            .iterate(
                function (params, image) {
                    return majorityFilter(ee.Image(image), params);
                },
                this.image
            );

        this.image = ee.Image(image);


        return this.image;

    };

    this.init(image);

};

//=============================================================================
// Script
//=============================================================================

var years = [
    1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992,
    1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
    2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,
    2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
    2017, 2018, 2019, 2020
];

// integration
App.init();

var integratedList = ee.List(
    years.map(
        function (year) {
            var integ = App.integrate(year);

            var pc = new PostClassification(integ);

            integ = pc.spatialFilter(filterParams);

            return integ;
        }
    )
);

var integrated = ee.Image(
    integratedList.iterate(
        function (band, image) {
            return ee.Image(image).addBands(band);
        },
        ee.Image().select()
    )
);

/**
 * Export to asset
 */
var assetGrids = 'projects/mapbiomas-raisg/DATOS_AUXILIARES/VECTORES/paises-4';

var grids = ee.FeatureCollection(assetGrids);

var gridNames = [
  "Perú"
];

gridNames.forEach(
    function (gridName) {
        var grid = grids.filter(ee.Filter.stringContains('name', gridName));
        
        // var gridMask = grid.reduceToImage(['cod_idDivP'], ee.Reducer.first());
        var gridMask = grid.reduceToImage(['cod_iddivp'], ee.Reducer.first());

        Export.image.toAsset({
           'image': integrated.updateMask(gridMask).selfMask(),
           'description': gridName.toUpperCase().replace('Ú', 'U') + '-' + outputVersion,
           'assetId': outputAsset + '/' + gridName.toUpperCase().replace('Ú', 'U') + '-' + outputVersion,
           'pyramidingPolicy': {
               ".default": "mode"
           },
           'region': grid.geometry().bounds(),
           'scale': 30,
           'maxPixels': 1e13
        });
    }
);
