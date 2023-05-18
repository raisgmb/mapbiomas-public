import ee
from ee_plugin import Map
Pais = "PERU"

years = []
for x in range(37):
    years.append(x+1985)
print(years)

for num in years:
    
    image = ee.ImageCollection("projects/nexgenmap/MapBiomas2/LANDSAT/PANAMAZON/mosaics-2")\
              .filterMetadata('country', 'equals', Pais)\
              .filterMetadata('year', 'equals', num)\
              .mosaic()

    descrip = 'landsat'+str(num)
    Map.addLayer(image, {'bands': ['swir1_median','nir_median','red_median'], 'min': 200, 'max': 5000},descrip,False)
    


