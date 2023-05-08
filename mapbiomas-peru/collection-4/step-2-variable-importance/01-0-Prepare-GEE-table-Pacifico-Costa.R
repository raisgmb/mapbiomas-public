## Prepara datos csv de GEE para txt
## by: EYTC-IBC-PERU (07/10/2021)
##-------------------------------------------------------------------------------
library (tools)
# setwd('E:/4_4_MapbiomasPERU_Pacifico/Importancia_Variables/P01_Sample_GEE')
rm(list=ls())
dir() 

if(TRUE){
## listar tablas
  Samples2021 <- read.csv("1-samples-GEE/samples-705-PERU-Pacifico-Costa-norte-1.csv",sep = ",")
  # wetland_107_AJUST <- read.csv('wetland-107-AJUST.csv',sep = ";")
  # wetland_109_AJUST <- read.csv('wetland-109-AJUST.csv',sep = ";")
  # wetland_116_AJUST <- read.csv('wetland-116-AJUST.csv',sep = ";")

# juntar dos tablas con todos los campos iguales
  # data_merge <- merge(x = wetland_101_AJUST, y = wetland_107_AJUST, all = TRUE)
  # data_merge <- merge(x = data_merge, y = wetland_109_AJUST, all = TRUE)
  # data_merge <- merge(x = data_merge, y = wetland_116_AJUST, all = TRUE)
  
  data_merge <- Samples2021  # temporal
  data_merge<-cbind(class = 0, data_merge)
  
# complerar campo Clase

data_merge$class[data_merge$reference == 3] <- 'Bosque'
data_merge$class[data_merge$reference == 5] <- 'Manglar'
data_merge$class[data_merge$reference == 6] <- 'Bosque_Inundable'
data_merge$class[data_merge$reference == 11] <- 'Formación_Natural_No_Forestal_Inundable'
data_merge$class[data_merge$reference == 12] <- 'Formación_Campestre'
data_merge$class[data_merge$reference == 29] <- 'Afloramiento_Rocoso'
data_merge$class[data_merge$reference == 13] <- 'Otra_Formación_Natural_No_Forestal'
data_merge$class[data_merge$reference == 14] <- 'Uso_agropecuario'
data_merge$class[data_merge$reference == 15] <- 'Pastos'
data_merge$class[data_merge$reference == 18] <- 'Agricultura'
data_merge$class[data_merge$reference == 21] <- 'Mosaico_de_Agricultura'
data_merge$class[data_merge$reference == 22] <- 'Area_sin_vegetacion'
data_merge$class[data_merge$reference == 24] <- 'Urbana'
data_merge$class[data_merge$reference == 25] <- 'Otras_areas_sin_vegetacion'
data_merge$class[data_merge$reference == 30] <- 'Mineria'
data_merge$class[data_merge$reference == 33] <- 'Cuerpo_de_agua'
data_merge$class[data_merge$reference == 34] <- 'Glaciar'

# completar id
# listN <- as.list(seq(1,nrow(data_merge),1))
# data_merge$id = seq.int(nrow(data_merge))
  
head(data_merge)

# Eliminar campos innecesarios
data_merge = subset(data_merge, select = -c(.geo) )
data_merge = subset(data_merge, select = -c(system.index) )
data_merge = subset(data_merge, select = -c(reference) )

colnames(data_merge)

write.table (data_merge, "2-txt/spectral_signatures.txt")
}
