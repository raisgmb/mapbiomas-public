# ----------------------------------------------
# PASO 04_2 PLOTEAR ACCURACY
# ----------------------------------------------
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
data <- read.table ('5-accuracy-Ntree/accuracy.txt')

## rename classes aesthetic
data$level <- gsub('tree120', 'tree 120', data$level)
data$level <- gsub('tree100', 'tree 100', data$level)
data$level <- gsub('tree80', 'tree 80', data$level)
data$level <- gsub('tree70', 'tree 70', data$level)
data$level <- gsub('tree60', 'tree 60', data$level)
data$level <- gsub('tree50', 'tree 50', data$level)
data$level <- gsub('tree40', 'tree 40', data$level)
data$level <- gsub('tree30', 'tree 30', data$level)
data$level <- gsub('tree20', 'tree 20', data$level)
data$level <- gsub('tree10', 'tree 10', data$level)

## plotar
# x11()
dev.new()
png(file=paste('5-accuracy-Ntree/','plot_Accuracy_#_Tree','.png', sep=""),
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
