# ----------------------------------------------
# PASO 01_1 PLOT EXPLORATORIO
# ----------------------------------------------
# Basado en: https://github.com/mapbiomas-brazil/cerrado (Instituto de Pesquisa Ambiental da Amazônia - IPAM) 
#            Dhemerson Conciani (dhemerson.costa@ipam.org.br)
# Adaptado para Mapbiomas Amazonia
# Ajuste: EYTC-IBC-PERU (07/10/2021)


library (tools)
# setwd('E:/4_4_MapbiomasPERU_Pacifico/Importancia_Variables/P02_txt')
dir()
rm(list=ls())
## carregar bibliotecas
library(corrplot)
library(ggplot2)
library (ggfortify)
library(dplyr)

## carregar biblioteca espectral
data <- read.table("2-txt/spectral_signatures.txt")

##collect subsample
# data2 <- subset (data, class == "Outros")
sample_data <- data[sample(1:nrow(data), 1000),]  #1988 numero de rows nrow(data2)

##
x11()
dataValues <- na.omit(mutate_all(sample_data[2:153], function(x) as.numeric(as.character(x))))
data_cor <- cor(dataValues)
corrplot(data_cor, method="color", type="upper", tl.cex=0.7, title= "Clases generales")


##########################
## Plotar PCA
sample_data <- na.omit(data[sample(1:nrow(data), 1000),]) #10000
pca_res <- prcomp(sample_data[2:153], scale. = TRUE)

autoplot(pca_res, data=sample_data, colour= "class",
         loadings= TRUE, loadings.label=TRUE, loadings.label.size=2.7, loadings.colour='gray40',
         alpha=0.4) +
  # scale_colour_manual(values=c("#E974ED", "#0000FF", "#B8AF4F", "#006400", "#32CD32", 
  #                                "red", "black", "#FFD966")) +
  theme_bw()
  

