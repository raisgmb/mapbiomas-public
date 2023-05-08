# ----------------------------------------------
# PASO 03_0 SELECCIONAR VARIABLES TOP
# ----------------------------------------------
# Basado en: https://github.com/mapbiomas-brazil/cerrado (Instituto de Pesquisa Ambiental da Amazônia - IPAM) 
#            Dhemerson Conciani (dhemerson.costa@ipam.org.br)
# Adaptado para Mapbiomas Amazonia
# Ajuste: EYTC-IBC-PERU (07/10/2021)

## select feature space
# setwd('E:/4_4_MapbiomasPERU_Pacifico/Importancia_Variables/P02_txt')
dir()
rm(list=ls())
## load libraries
library (ggplot2)

## load table
data <- read.table ('2-txt/importance.txt')

## calc statistics
## mediana
stat <- aggregate(x= data$MeanDecreaseGini,
                  by=list(variable= data$variable, level= data$level),
                  FUN="mean")
# write.table(stat, "P03_TopV_plot/importance_general.txt")

## Extrae 50 variables mas importantes para cada nível de experimento
recipe <- as.data.frame(NULL)
for (i in 1:length(unique(stat$level))) {
  print (unique(stat$level)[i])
  temp <- subset(stat, level==unique(stat$level)[i])
  temp <- as.data.frame(temp[order(-temp$x),][1:50,]$variable)
  temp$level <- unique(stat$level)[i]
  recipe <- rbind (temp, recipe)
}
recipe
## calcular quantas vezes cada variavel aparece no top50
sum_importance <- as.data.frame(table(recipe))
colnames(sum_importance)[1] <- "variable"
sum_importance$level <- factor(sum_importance$level,
                               levels = c("Mosaico_de_Agricultura","OFNNF", "forest", "native", "geral")) #"florestal", "savanica", "campestre", "native", 

## exportar variaveis selecionadas
write.table(unique(sum_importance$variable), "3-topV-plot/pre_selected_variables.txt")
# write.table(unique(recipe$`temp[order(-temp$x), ][1:50, ]$variable`), "P03_TopV_plot/pre_selected_variables.txt")
## Exportar top
top50 <- aggregate(sum_importance$Freq, by=list(sum_importance$variable), FUN="sum")

write.table(top50$Group.1[order(top50$x, decreasing=TRUE)][1:50], "3-topV-plot/top50.txt")
write.table(top50$Group.1[order(top50$x, decreasing=TRUE)][1:40], "3-topV-plot/top40.txt")
write.table(top50$Group.1[order(top50$x, decreasing=TRUE)][1:30], "3-topV-plot/top30.txt")
write.table(top50$Group.1[order(top50$x, decreasing=TRUE)][1:20], "3-topV-plot/top20.txt")
write.table(top50$Group.1[order(top50$x, decreasing=TRUE)][1:10], "3-topV-plot/top10.txt")
write.table(top50$Group.1[order(top50$x, decreasing=TRUE)][1:5], "3-topV-plot/top5.txt")

