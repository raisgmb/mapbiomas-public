# ----------------------------------------------
# PASO 03_1 PLOTEAR IMPORTANCIA DE VARIABLES
# ----------------------------------------------
# Basado en: https://github.com/mapbiomas-brazil/cerrado (Instituto de Pesquisa Ambiental da Amazônia - IPAM) 
#            Dhemerson Conciani (dhemerson.costa@ipam.org.br)
# Adaptado para Mapbiomas Amazonia
# Ajuste: EYTC-IBC-PERU (07/10/2021)

## select feature space
## Dhemerson Conciani (dhemerson.costa@ipam.org.br)
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

## extrair 50 variaveis mais importates para cada nível do experimento
recipe <- as.data.frame(NULL)
for (i in 1:length(unique(stat$level))) {
  print (unique(stat$level)[i])
  temp <- subset(stat, level==unique(stat$level)[i])
  temp <- as.data.frame(temp[order(-temp$x),][1:50,]$variable)
  temp$level <- unique(stat$level)[i]
  recipe <- rbind (temp, recipe)
}

## calcular quantas vezes cada variavel aparece no top30
sum_importance <- as.data.frame(table(recipe))
colnames(sum_importance)[1] <- "variable"
sum_importance$level <- factor(sum_importance$level,
                               levels = c("Mosaico_de_Agricultura","OFNNF", "forest", "native", "geral"))

## exportar variaveis selecionadas
#write.table(unique(sum_importance$variable), "../_txt/pre_selected_variables.txt")
## Exportar top
#top30 <- aggregate(sum_importance$Freq, by=list(sum_importance$variable), FUN="sum")
#write.table(top30$Group.1[order(top30$x, decreasing=TRUE)][1:30], "../_txt/top30.txt")
#write.table(top30$Group.1[order(top30$x, decreasing=TRUE)][1:20], "../_txt/top20.txt")
#write.table(top30$Group.1[order(top30$x, decreasing=TRUE)][1:10], "../_txt/top10.txt")
#write.table(top30$Group.1[order(top30$x, decreasing=TRUE)][1:5], "../_txt/top5.txt")


## plot 
# x11()
dev.new()
png(file=paste('3-topV-plot/','plot_importance_geral','.png', sep=""),
    width=2000, height=5000,  # tamaño
    res = 350,  # nominal resoluction ppi
)
## geral
ggplot (data=subset(data, level== "geral"), 
        aes (x=reorder(variable, MeanDecreaseGini), y=MeanDecreaseGini)) +
  geom_boxplot(outlier.size=-1, colour="gray20") +
  geom_vline(xintercept=75.6, color="red", size=1) +
  coord_flip() +
  theme_classic() +
  ggtitle('General (Native + Mos-Agr., Wat., Pas., Oth.)') + 
  xlab ('Predictor')

dev.off()

dev.new()
png(file=paste('3-topV-plot/','plot_importance_native','.png', sep=""),
    width=2000, height=5000,  # tamaño
    res = 350,  # nominal resoluction ppi
)
## apenas nativas
ggplot (data=subset(data, level== "native"), 
        aes (x=reorder(variable, MeanDecreaseGini), y=MeanDecreaseGini)) +
  geom_boxplot(outlier.size=-1, colour= "tomato") +
  geom_vline(xintercept=75.6, color="red", size=1) +
  coord_flip() +
  theme_classic() +
  ggtitle('Native (Fo., Sa., Gr.)') + 
  xlab ('Predictor')

dev.off()

dev.new()
png(file=paste('3-topV-plot/','plot_importance_forest','.png', sep=""),
    width=2000, height=5000,  # tamaño
    res = 350,  # nominal resoluction ppi
)
## forest
ggplot (data=subset(data, level== "forest"), 
        aes (x=reorder(variable, MeanDecreaseGini), y=MeanDecreaseGini)) +
  geom_boxplot(outlier.size=-1, col="darkgreen") +
  geom_vline(xintercept=75.6, color="red", size=1) +
  coord_flip() +
  theme_classic() +
  ggtitle('Forest vs. all') + 
  xlab ('Predictor')

dev.off()

dev.new()
png(file=paste('3-topV-plot/','plot_importance_OFNNF','.png', sep=""),
    width=2000, height=5000,  # tamaño
    res = 350,  # nominal resoluction ppi
)
## OFNNF
ggplot (data=subset(data, level== "OFNNF"), 
        aes (x=reorder(variable, MeanDecreaseGini), y=MeanDecreaseGini)) +
  geom_boxplot(outlier.size=-1, col="#2C9B1C") +
  geom_vline(xintercept=75.6, color="red", size=1) +
  coord_flip() +
  theme_classic() +
  ggtitle('OFNNF vs. all') + 
  xlab ('Predictor')

dev.off()

dev.new()
png(file=paste('3-topV-plot/','plot_importance_Mosaico_de_Agricultura','.png', sep=""),
    width=2000, height=5000,  # tamaño
    res = 350,  # nominal resoluction ppi
)
## Mosaico_de_Agricultura
ggplot (data=subset(data, level== "Mosaico_de_Agricultura"), 
        aes (x=reorder(variable, MeanDecreaseGini), y=MeanDecreaseGini)) +
  geom_boxplot(outlier.size=-1, col="#888766") +
  geom_vline(xintercept=75.6, color="red", size=1) +
  coord_flip() +
  theme_classic() +
  ggtitle('Mosaico_de_Agricultura vs. all') + 
  xlab ('Predictor')

dev.off()


dev.new()
png(file=paste('3-topV-plot/','plot_sum_importance_50top','.png', sep=""),
    width=2000, height=5000,  # tamaño
    res = 350,  # nominal resoluction ppi
)
## numero de vezes que uma variavel apareceu no top 50
ggplot (data= sum_importance, aes(x= reorder(variable, Freq), y= Freq)) +
  geom_bar(stat="identity", aes(fill=level)) +
  scale_fill_manual("Models", values=c("#ff7bc4", "#2C9B1C", "darkgreen", "#ffae1b", "gray20"),
                    labels=c("Mosaico_de_Agricultura vs. all", "OFNNF vs. all", "forest vs all", 
                             "Native (Fo., Sa., Gr.)", "All classes (+Mos_Agr., Wat., Pas., Oth.)")) +
  coord_flip() +
  xlab ("Predictor") + 
  theme_classic()

dev.off()

