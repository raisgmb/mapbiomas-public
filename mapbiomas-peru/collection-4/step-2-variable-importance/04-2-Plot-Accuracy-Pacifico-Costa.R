# ----------------------------------------------
# PASO 04_2 PLOTEAR ACCURACY
# ----------------------------------------------
# Basado en: https://github.com/mapbiomas-brazil/cerrado (Instituto de Pesquisa Ambiental da Amazônia - IPAM) 
#            Dhemerson Conciani (dhemerson.costa@ipam.org.br)
# Adaptado para Mapbiomas Amazonia
# Ajuste: EYTC-IBC-PERU (07/10/2021)
dir()
rm(list=ls())

## load libraries
library (ggplot2)

## define functions outside packages
fun_median <- function(x){
  return(data.frame(y=round(median(x), digits=3), label=round(median(x,na.rm=T), digits=3)))
}

## load table
data <- read.table ('4-accuracy-Nvariable/accuracy.txt')

## rename classes aesthetic
data$level <- gsub('all', 'ALL 141', data$level)
data$level <- gsub('TOP50', 'TOP 50', data$level)
data$level <- gsub('TOP40', 'TOP 40', data$level)
data$level <- gsub('TOP30', 'TOP 30', data$level)
data$level <- gsub('TOP20', 'TOP 20', data$level)
data$level <- gsub('TOP10', 'TOP 10', data$level)
data$level <- gsub('TOP5', 'TOP 5', data$level)

## plotar
# x11()
dev.new()
png(file=paste('4-accuracy-Nvariable/','plot_Accuracy_#_variables','.png', sep=""),
    width=2000, height=2500,  # tamaño
    res = 350,  # nominal resoluction ppi
)
ggplot (data, aes(x=reorder(level, -accuracy), y= accuracy)) +
  stat_boxplot(geom = "errorbar", width = 0.2) +  
  geom_boxplot(outlier.size=-1, fill= "white", alpha=1) +
  geom_jitter(alpha=0.02) +
  stat_summary(fun= median, geom="line", aes(group=1), col="darkgreen", alpha=0.3, size=1) +
  stat_summary(fun= median, geom="point", aes(group=1), col="darkgreen", alpha=0.3, size=1.5) +
  stat_summary(fun.data = fun_median, geom="text", vjust=-2, col="darkgreen") +
  xlab("Design") + ylab("Accuracy") + 
  theme_classic()
dev.off()
## promover teste tukey
# What is the effect of the treatment on the value ?
model <- lm(data$accuracy ~ data$level)
anova <- aov(model)

# Tukey test to study each pair of treatment :
tukey <- TukeyHSD(x= anova, 'data$level', conf.level=0.95)

tukey
