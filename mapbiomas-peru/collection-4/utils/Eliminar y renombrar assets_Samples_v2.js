/*  ------------------------Script para eliminar y renombra Assets de SAMPLES--------------------
by: Efrain

Param:
Pais: Indicar el Nombre del Pais en Mayuscula
Region: Codigo de region de clasificacion 
paso: indicar a que paso corresponde el SAMPLES
version: indicar la version del SAMPLES

SE ACTIVA LAS LINEAS 57 Y 64  para eliminar los assets
aceptar ok a todos los mensajes despues de ejecutar el script
*/

// SE ACTIVA LAS LINEAS 57 Y 64 para eliminar los assets
var param  = {
  Pais : 'PERU',
  Region : '70212',
  paso : 'p03', //'p03', 'p07'  Paso   
  version: '1',
} 

//************************************************************************************************************

// var asset1 = ee.Algorithms.If(param.paso == 'P03', 
// 'P03_Puntos_estables/Muestras_Balanc/',
// 'P07_Puntos_Estables/Muestras_Balanc/');
// //print(asset1)

var asset1 = ee.String('projects/mapbiomas-raisg/MUESTRAS/').cat(param.Pais).cat('/COLECCION4/PUNTOS_ESTABLES').getInfo();
//print(asset1)

var anos = [ 
  '1985',
  '1986',
  '1987','1988',
  '1989',
  '1990','1991','1992',
  '1993',
  '1994',
  '1995','1996','1997','1998','1999',
  '2000','2001','2002', '2003','2004',
  '2005','2006','2007','2008','2009',
  '2010','2011','2012',
  '2013','2014','2015','2016','2017', 
  '2018','2019','2020','2021'
            ];
            
anos.forEach(
  // tiene que ser una funcion necesariamente
function (year) {
       
      //print(asset1 + '/samples-'+ param.Pais + '-' + param.Region + '-' + year + '-' + param.paso + '-'+ param.version)
      var a = ee.FeatureCollection(asset1 + '/samples-'+ param.Pais + '-' + param.Region + '-' + year + '-' + param.paso + '-'+ param.version);
      print(a.limit(1));
      
    }
 )
//*************************************************************************************************

 
//************************************************************************************************************

// ACTIVAR SI SE ESTÁ SEGURO DE ELIMINAR LOS ASSETS SAMPLES


// anos.forEach(
// function (year) {
//         ee.data.deleteAsset(asset1 + '/samples-'+ param.Pais + '-' + param.Region + '-' + year + '-' + param.paso + '-'+ param.version);
//         print('/samples-'+ param.Pais + '-' + param.Region + '-' + year + '-' + param.paso + '-'+ param.version, 'Fue eliminado')
//     }
// )


//************************************************************************************************************
