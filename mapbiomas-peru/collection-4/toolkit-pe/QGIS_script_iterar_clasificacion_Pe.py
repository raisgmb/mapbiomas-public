import ee
from ee_plugin import Map

years = []
for x in range(37):
    years.append(x+1985)
print(years)

for num in years:
    
    image = ee.Image("projects/mapbiomas-public/assets/peru/collection1/mapbiomas_peru_collection1_integration_v1")\
              .select('classification_'+str(num))

    descrip = 'Clasif'+str(num)
    Map.addLayer(image, {'palette': 
        ['ffffff', '129912', '1f4423', '006400', '00ff00', '687537', '76a5af', '29eee4', '77a605', '935132',
        'bbfcac', '45c2a5', 'b8af4f', 'f1c232', 'ffffb2', 'ffd966', 'f6b26b', 'f99f40', 'e974ed', 'd5a6bd',
        'c27ba0', 'fff3bf', 'ea9999', 'dd7e6b', 'aa0000', 'ff99ff', '0000ff', 'd5d5e5', 'dd497f', 'b2ae7c',
        'ff02eb', '8a2be2', '968c46', '0000ff', '4fd3ff'], 'min': 0, 'max': 34},descrip,False)
    


