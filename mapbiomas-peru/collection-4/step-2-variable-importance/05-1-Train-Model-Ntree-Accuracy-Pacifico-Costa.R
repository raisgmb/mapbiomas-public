# ----------------------------------------------
# PASO 04_1 CORRER MODELO RF PARA CALCULAR ACCURACY
# ----------------------------------------------
# Adaptado para Mapbiomas Amazonia
# Ajuste: EYTC-IBC-PERU (07/10/2021)

## select feature space
dir()
rm(list=ls())
## carregar bibliotecas
library (AppliedPredictiveModeling)
library (caret)
library (ggplot2)
library (pROC)
library (doParallel)
library (dplyr)
library (randomForest)
library (reshape2)

## configure parallel processing
cl <- makePSOCKcluster(5)
registerDoParallel(cl)

## parametros de treinamento
n_models <- 400  #  400
n_samples <- 195 #  500

## read spectral signatures library
data <- na.omit(read.table("2-txt/spectral_signatures.txt"))

## read predictors selecitons tables
pred <- read.table("3-topV-plot/pre_selected_variables.txt")
sr50 <- read.table("3-topV-plot/top50.txt")
# sr40 <- read.table("P03_TopV_plot/top40.txt")
# sr30 <- read.table("P03_TopV_plot/top30.txt")
# sr20 <- read.table("P03_TopV_plot/top20.txt")
# sr10 <- read.table("P03_TopV_plot/top10.txt")
# sr5 <-  read.table("P03_TopV_plot/top5.txt")
# toa <-  read.table("P03_TopV_plot/toa_predictors.txt", header= TRUE)
######################################
# sr <- c("class", pred$x)
# sr2 <- c("year", pred$x)
######################################
class<-factor("class")

sr50 <- c(as.character(class), as.character(sr50$x))
# sr40 <- c(as.character(class), as.character(sr40$x))
# sr30 <- c(as.character(class), as.character(sr30$x))
# sr20 <- c(as.character(class), as.character(sr20$x))
# sr10 <- c(as.character(class), as.character(sr10$x))
# sr5  <- c(as.character(class), as.character(sr5$x))
######################################
# toa <- c("class", toa$SR)
#####################################

## renomear classes
# data$class <- gsub ("Apicum", "Outros", data$class)
# data$class <- gsub ("Mangue", "Outros", data$class)
# data$class <- gsub ("Aquicultura", "Outros", data$class)
# data$class <- gsub ("MineraÃ§Ã£o", "Outros", data$class)
# data$class <- gsub ("Praia e Duna", "Outros", data$class)
# data$class <- gsub ("Cultura Anual", "Agricultura", data$class)
# data$class <- gsub ("Cultura Semi-Perene", "Agricultura", data$class)
# data$class <- gsub ("Pastagem Cultivada", "Pastagem", data$class)
# data$class <- gsub ("Cultura Perene", "Agricultura", data$class)
# data$class <- gsub ("Floresta Plantada", "Outros", data$class)
# data$class <- gsub ("FormaÃ§Ã£o SavÃ¢nica", "Formação savânica", data$class)
# data$class <- gsub ("FormaÃ§Ã£o Florestal", "Formação florestal", data$class)
# data$class <- gsub ("Rio, Lago e Oceano", "Água", data$class)
# data$class <- gsub ("Afloramento Rochoso", "Outros", data$class)
# data$class <- gsub ("FormaÃ§Ã£o Campestre", "Formação campestre", data$class)
# data$class <- gsub ("Infraestrutura Urbana", "Outros", data$class)
# data$class <- gsub ("Outra Ã\u0081rea NÃ£o Vegetada", "OANV", data$class)
# data$class <- gsub ("Ã\u0081rea Ãšmida Natural NÃ£o Florestal", "Outros", data$class)
# data$class <- gsub ("Outra FormaÃ§Ã£o Natural NÃ£o Florestal", "Outros", data$class)
# data$class <- gsub ("NÃ£o Observado", "Outros", data$class)

## exlcluir classe "outros"
# data  <- subset (data, class != "Outros")

## criar um dataset por classe
if(TRUE){
  Bosque <- subset (data, class== "Bosque")
  Manglar <- subset (data, class== "Manglar")
  Bosque_Inundable <- subset (data, class== "Bosque_Inundable")
  Formación_Natural_No_Forestal_Inundable <- subset (data, class== "Formación_Natural_No_Forestal_Inundable")
  Formación_Campestre <- subset (data, class== "Formación_Campestre")
  Afloramiento_Rocoso <- subset (data, class== "Afloramiento_Rocoso")
  Otra_Formación_Natural_No_Forestal <- subset (data, class== "Otra_Formación_Natural_No_Forestal")
  Uso_agropecuario <- subset (data, class== "Uso_agropecuario")
  Pastos <- subset (data, class== "Pastos")
  Agricultura <- subset (data, class== "Agricultura")
  Mosaico_de_Agricultura <- subset (data, class== "Mosaico_de_Agricultura")
  Area_sin_vegetacion <- subset (data, class== "Area_sin_vegetacion")
  Urbana <- subset (data, class== "Urbana")
  Otras_areas_sin_vegetacion <- subset (data, class== "Otras_areas_sin_vegetacion")
  Mineria <- subset (data, class== "Mineria")
  Cuerpo_de_agua <- subset (data, class== "Cuerpo_de_agua")
  Glaciar <- subset (data, class== "Glaciar")
}


if(TRUE){
## loop for vai começar daqui (treinar multilpos modelos e extrair acurácia)
  ## calcular com os 120 preditores selecionados
  ## criar recipe vazio
  recipe <- as.data.frame(NULL)
  
  for (i in 1:n_models) {
    print (paste0("only 50 from 120 tree - ", i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
    sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
    
    sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
    sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
    # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
    # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
    # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
    # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
    # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
    # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
    
    sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
    sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
    
    sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
    sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
    
    # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
    # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
    
    sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
    sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
    
    sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
    sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
    # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
    
    ## preparar dataset para treino
    samples <- rbind (sample_Bosque,
                      sample_Manglar,
                      # sample_Bosque_Inundable,
                      sample_Formación_Natural_No_Forestal_Inundable,
                      # sample_Formación_Campestre,
                      # sample_Afloramiento_Rocoso,
                      sample_Otra_Formación_Natural_No_Forestal,
                      # sample_Uso_agropecuario,
                      # sample_Pastos,
                      # sample_Agricultura,
                      sample_Mosaico_de_Agricultura,
                      sample_Area_sin_vegetacion,
                      sample_Urbana,
                      # sample_Otras_areas_sin_vegetacion,
                      sample_Mineria,
                      sample_Cuerpo_de_agua
                      # sample_Glaciar
    )
    
    ## separar variaveis de labels
    dataValues <- samples[2:50]
    dataClass <- samples[1]
    
    ## converter em numerico
    dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
    
    ## control
    control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
    
    ## treinar modelo
    rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                            ntree= 120,
                            mtry= 4,
                            trControl=control,
                            preProc = c ("center", "scale"),
                            allowParallel = TRUE)
    
    
    temp <- as.data.frame(1-rfModel$err.rate[120]); colnames(temp)[1] <- "accuracy"
    temp$run <- i
    temp$level <- "tree120"
    recipe <- rbind (temp, recipe)
  }
  
## calcular com os 100 preditores selecionados
## criar recipe vazio
  recipe2 <- as.data.frame(NULL)
  
  for (i in 1:n_models) {
    print (paste0("only 50 from 100 tree - ", i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
    sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
    
    sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
    sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
    # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
    # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
    # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
    # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
    # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
    # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
    
    sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
    sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
    
    sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
    sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
    
    # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
    # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
    
    sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
    sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
    
    sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
    sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
    # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
    
    ## preparar dataset para treino
    samples <- rbind (sample_Bosque,
                      sample_Manglar,
                      # sample_Bosque_Inundable,
                      sample_Formación_Natural_No_Forestal_Inundable,
                      # sample_Formación_Campestre,
                      # sample_Afloramiento_Rocoso,
                      sample_Otra_Formación_Natural_No_Forestal,
                      # sample_Uso_agropecuario,
                      # sample_Pastos,
                      # sample_Agricultura,
                      sample_Mosaico_de_Agricultura,
                      sample_Area_sin_vegetacion,
                      sample_Urbana,
                      # sample_Otras_areas_sin_vegetacion,
                      sample_Mineria,
                      sample_Cuerpo_de_agua
                      # sample_Glaciar
    )
    
    ## separar variaveis de labels
    dataValues <- samples[2:50]
    dataClass <- samples[1]
    
    ## converter em numerico
    dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
    
    ## control
    control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
    
    ## treinar modelo
    rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                            ntree= 100,
                            mtry= 4,
                            trControl=control,
                            preProc = c ("center", "scale"),
                            allowParallel = TRUE)
    
    
    temp <- as.data.frame(1-rfModel$err.rate[100]); colnames(temp)[1] <- "accuracy"
    temp$run <- i
    temp$level <- "tree100"
    recipe2 <- rbind (temp, recipe2)
  }


## calcular com os 80 preditores selecionados
## criar recipe vazio
  recipe3 <- as.data.frame(NULL)
  
  for (i in 1:n_models) {
    print (paste0("only 50 from 80 tree - ", i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
    sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
    
    sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
    sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
    # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
    # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
    # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
    # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
    # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
    # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
    
    sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
    sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
    
    sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
    sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
    
    # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
    # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
    
    sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
    sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
    
    sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
    sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
    # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
    
    ## preparar dataset para treino
    samples <- rbind (sample_Bosque,
                      sample_Manglar,
                      # sample_Bosque_Inundable,
                      sample_Formación_Natural_No_Forestal_Inundable,
                      # sample_Formación_Campestre,
                      # sample_Afloramiento_Rocoso,
                      sample_Otra_Formación_Natural_No_Forestal,
                      # sample_Uso_agropecuario,
                      # sample_Pastos,
                      # sample_Agricultura,
                      sample_Mosaico_de_Agricultura,
                      sample_Area_sin_vegetacion,
                      sample_Urbana,
                      # sample_Otras_areas_sin_vegetacion,
                      sample_Mineria,
                      sample_Cuerpo_de_agua
                      # sample_Glaciar
    )
    
    ## separar variaveis de labels
    dataValues <- samples[2:50]
    dataClass <- samples[1]
    
    ## converter em numerico
    dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
    
    ## control
    control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
    
    ## treinar modelo
    rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                            ntree= 80,
                            mtry= 4,
                            trControl=control,
                            preProc = c ("center", "scale"),
                            allowParallel = TRUE)
    
    
    temp <- as.data.frame(1-rfModel$err.rate[80]); colnames(temp)[1] <- "accuracy"
    temp$run <- i
    temp$level <- "tree80"
    recipe3 <- rbind (temp, recipe3)
  }
  


## calcular com os 70 preditores selecionados
## criar recipe vazio
  recipe4 <- as.data.frame(NULL)

  for (i in 1:n_models) {
    print (paste0("only 50 from 70 tree - ", i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
    sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
    
    sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
    sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
    # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
    # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
    # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
    # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
    # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
    # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
    
    sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
    sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
    
    sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
    sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
    
    # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
    # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
    
    sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
    sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
    
    sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
    sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
    # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
    
    ## preparar dataset para treino
    samples <- rbind (sample_Bosque,
                      sample_Manglar,
                      # sample_Bosque_Inundable,
                      sample_Formación_Natural_No_Forestal_Inundable,
                      # sample_Formación_Campestre,
                      # sample_Afloramiento_Rocoso,
                      sample_Otra_Formación_Natural_No_Forestal,
                      # sample_Uso_agropecuario,
                      # sample_Pastos,
                      # sample_Agricultura,
                      sample_Mosaico_de_Agricultura,
                      sample_Area_sin_vegetacion,
                      sample_Urbana,
                      # sample_Otras_areas_sin_vegetacion,
                      sample_Mineria,
                      sample_Cuerpo_de_agua
                      # sample_Glaciar
    )
    
    ## separar variaveis de labels
    dataValues <- samples[2:50]
    dataClass <- samples[1]
    
    ## converter em numerico
    dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
    
    ## control
    control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
    
    ## treinar modelo
    rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                            ntree= 70,
                            mtry= 4,
                            trControl=control,
                            preProc = c ("center", "scale"),
                            allowParallel = TRUE)
    
    
    temp <- as.data.frame(1-rfModel$err.rate[70]); colnames(temp)[1] <- "accuracy"
    temp$run <- i
    temp$level <- "tree70"
    recipe4 <- rbind (temp, recipe4)
  }

## calcular com os 60 preditores selecionados
## criar recipe vazio
recipe5 <- as.data.frame(NULL)

for (i in 1:n_models) {
  print (paste0("only 50 from 60 tree - ", i/n_models*100, " %"))
  ## sortear amostras (400 por classe)
  sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
  sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
  
  sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
  sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
  # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
  # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
  # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
  # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
  # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
  # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
  
  sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
  sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
  
  sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
  sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
  
  # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
  # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
  
  sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
  sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
  
  sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
  sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
  # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
  
  ## preparar dataset para treino
  samples <- rbind (sample_Bosque,
                    sample_Manglar,
                    # sample_Bosque_Inundable,
                    sample_Formación_Natural_No_Forestal_Inundable,
                    # sample_Formación_Campestre,
                    # sample_Afloramiento_Rocoso,
                    sample_Otra_Formación_Natural_No_Forestal,
                    # sample_Uso_agropecuario,
                    # sample_Pastos,
                    # sample_Agricultura,
                    sample_Mosaico_de_Agricultura,
                    sample_Area_sin_vegetacion,
                    sample_Urbana,
                    # sample_Otras_areas_sin_vegetacion,
                    sample_Mineria,
                    sample_Cuerpo_de_agua
                    # sample_Glaciar
  )
  
  ## separar variaveis de labels
  dataValues <- samples[2:50]
  dataClass <- samples[1]
  
  ## converter em numerico
  dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
  
  ## control
  control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
  
  ## treinar modelo
  rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                          ntree= 60,
                          mtry= 4,
                          trControl=control,
                          preProc = c ("center", "scale"),
                          allowParallel = TRUE)
  
  
  temp <- as.data.frame(1-rfModel$err.rate[60]); colnames(temp)[1] <- "accuracy"
  temp$run <- i
  temp$level <- "tree50"
  recipe5 <- rbind (temp, recipe5)
}

## calcular com os 50 preditores selecionados
## criar recipe vazio
recipe6 <- as.data.frame(NULL)

for (i in 1:n_models) {
  print (paste0("only 50 from 50 tree - ", i/n_models*100, " %"))
  ## sortear amostras (400 por classe)
  sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
  sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
  
  sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
  sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
  # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
  # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
  # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
  # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
  # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
  # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
  
  sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
  sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
  
  sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
  sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
  
  # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
  # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
  
  sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
  sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
  
  sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
  sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
  # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
  
  ## preparar dataset para treino
  samples <- rbind (sample_Bosque,
                    sample_Manglar,
                    # sample_Bosque_Inundable,
                    sample_Formación_Natural_No_Forestal_Inundable,
                    # sample_Formación_Campestre,
                    # sample_Afloramiento_Rocoso,
                    sample_Otra_Formación_Natural_No_Forestal,
                    # sample_Uso_agropecuario,
                    # sample_Pastos,
                    # sample_Agricultura,
                    sample_Mosaico_de_Agricultura,
                    sample_Area_sin_vegetacion,
                    sample_Urbana,
                    # sample_Otras_areas_sin_vegetacion,
                    sample_Mineria,
                    sample_Cuerpo_de_agua
                    # sample_Glaciar
  )
  
  ## separar variaveis de labels
  dataValues <- samples[2:50]
  dataClass <- samples[1]
  
  ## converter em numerico
  dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
  
  ## control
  control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
  
  ## treinar modelo
  rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                          ntree= 50,
                          mtry= 4,
                          trControl=control,
                          preProc = c ("center", "scale"),
                          allowParallel = TRUE)
  
  
  temp <- as.data.frame(1-rfModel$err.rate[50]); colnames(temp)[1] <- "accuracy"
  temp$run <- i
  temp$level <- "tree50"
  recipe6 <- rbind (temp, recipe6)
}

## calcular com os 40 preditores selecionados
## criar recipe vazio
recipe7 <- as.data.frame(NULL)

for (i in 1:n_models) {
  print (paste0("only 50 from 40 tree - ", i/n_models*100, " %"))
  ## sortear amostras (400 por classe)
  sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
  sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
  
  sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
  sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
  # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
  # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
  # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
  # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
  # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
  # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
  
  sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
  sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
  
  sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
  sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
  
  # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
  # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
  
  sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
  sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
  
  sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
  sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
  # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
  
  ## preparar dataset para treino
  samples <- rbind (sample_Bosque,
                    sample_Manglar,
                    # sample_Bosque_Inundable,
                    sample_Formación_Natural_No_Forestal_Inundable,
                    # sample_Formación_Campestre,
                    # sample_Afloramiento_Rocoso,
                    sample_Otra_Formación_Natural_No_Forestal,
                    # sample_Uso_agropecuario,
                    # sample_Pastos,
                    # sample_Agricultura,
                    sample_Mosaico_de_Agricultura,
                    sample_Area_sin_vegetacion,
                    sample_Urbana,
                    # sample_Otras_areas_sin_vegetacion,
                    sample_Mineria,
                    sample_Cuerpo_de_agua
                    # sample_Glaciar
  )
  
  ## separar variaveis de labels
  dataValues <- samples[2:50]
  dataClass <- samples[1]
  
  ## converter em numerico
  dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
  
  ## control
  control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
  
  ## treinar modelo
  rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                          ntree= 40,
                          mtry= 4,
                          trControl=control,
                          preProc = c ("center", "scale"),
                          allowParallel = TRUE)
  
  
  temp <- as.data.frame(1-rfModel$err.rate[40]); colnames(temp)[1] <- "accuracy"
  temp$run <- i
  temp$level <- "tree40"
  recipe7 <- rbind (temp, recipe7)
}

## calcular com os 30 preditores selecionados
## criar recipe vazio
recipe8 <- as.data.frame(NULL)

for (i in 1:n_models) {
  print (paste0("only 50 from 30 tree - ", i/n_models*100, " %"))
  ## sortear amostras (400 por classe)
  sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
  sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
  
  sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
  sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
  # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
  # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
  # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
  # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
  # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
  # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
  
  sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
  sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
  
  sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
  sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
  
  # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
  # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
  
  sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
  sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
  
  sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
  sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
  # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
  
  ## preparar dataset para treino
  samples <- rbind (sample_Bosque,
                    sample_Manglar,
                    # sample_Bosque_Inundable,
                    sample_Formación_Natural_No_Forestal_Inundable,
                    # sample_Formación_Campestre,
                    # sample_Afloramiento_Rocoso,
                    sample_Otra_Formación_Natural_No_Forestal,
                    # sample_Uso_agropecuario,
                    # sample_Pastos,
                    # sample_Agricultura,
                    sample_Mosaico_de_Agricultura,
                    sample_Area_sin_vegetacion,
                    sample_Urbana,
                    # sample_Otras_areas_sin_vegetacion,
                    sample_Mineria,
                    sample_Cuerpo_de_agua
                    # sample_Glaciar
  )
  
  ## separar variaveis de labels
  dataValues <- samples[2:50]
  dataClass <- samples[1]
  
  ## converter em numerico
  dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
  
  ## control
  control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
  
  ## treinar modelo
  rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                          ntree= 30,
                          mtry= 4,
                          trControl=control,
                          preProc = c ("center", "scale"),
                          allowParallel = TRUE)
  
  
  temp <- as.data.frame(1-rfModel$err.rate[30]); colnames(temp)[1] <- "accuracy"
  temp$run <- i
  temp$level <- "tree30"
  recipe8 <- rbind (temp, recipe8)
}

## calcular com os 20 preditores selecionados
## criar recipe vazio
recipe9 <- as.data.frame(NULL)

for (i in 1:n_models) {
  print (paste0("only 50 from 20 tree - ", i/n_models*100, " %"))
  ## sortear amostras (400 por classe)
  sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
  sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
  
  sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
  sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
  # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
  # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
  # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
  # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
  # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
  # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
  
  sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
  sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
  
  sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
  sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
  
  # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
  # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
  
  sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
  sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
  
  sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
  sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
  # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
  
  ## preparar dataset para treino
  samples <- rbind (sample_Bosque,
                    sample_Manglar,
                    # sample_Bosque_Inundable,
                    sample_Formación_Natural_No_Forestal_Inundable,
                    # sample_Formación_Campestre,
                    # sample_Afloramiento_Rocoso,
                    sample_Otra_Formación_Natural_No_Forestal,
                    # sample_Uso_agropecuario,
                    # sample_Pastos,
                    # sample_Agricultura,
                    sample_Mosaico_de_Agricultura,
                    sample_Area_sin_vegetacion,
                    sample_Urbana,
                    # sample_Otras_areas_sin_vegetacion,
                    sample_Mineria,
                    sample_Cuerpo_de_agua
                    # sample_Glaciar
  )
  
  ## separar variaveis de labels
  dataValues <- samples[2:50]
  dataClass <- samples[1]
  
  ## converter em numerico
  dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
  
  ## control
  control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
  
  ## treinar modelo
  rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                          ntree= 20,
                          mtry= 4,
                          trControl=control,
                          preProc = c ("center", "scale"),
                          allowParallel = TRUE)
  
  
  temp <- as.data.frame(1-rfModel$err.rate[20]); colnames(temp)[1] <- "accuracy"
  temp$run <- i
  temp$level <- "tree20"
  recipe9 <- rbind (temp, recipe9)
}

## calcular com os 10 preditores selecionados
## criar recipe vazio
recipe10 <- as.data.frame(NULL)

for (i in 1:n_models) {
  print (paste0("only 50 from 10 tree - ", i/n_models*100, " %"))
  ## sortear amostras (400 por classe)
  sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
  sample_Bosque <- sample_Bosque[, which(names(sample_Bosque) %in% sr50)]
  
  sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
  sample_Manglar <- sample_Manglar[, which(names(sample_Manglar) %in% sr50)]
  # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
  sample_Formación_Natural_No_Forestal_Inundable <- sample_Formación_Natural_No_Forestal_Inundable[, which(names(sample_Formación_Natural_No_Forestal_Inundable) %in% sr50)]
  # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
  # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
  sample_Otra_Formación_Natural_No_Forestal <- sample_Otra_Formación_Natural_No_Forestal[, which(names(sample_Otra_Formación_Natural_No_Forestal) %in% sr50)]
  # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
  # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
  # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
  sample_Mosaico_de_Agricultura <- sample_Mosaico_de_Agricultura[, which(names(sample_Mosaico_de_Agricultura) %in% sr50)]
  
  sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
  sample_Area_sin_vegetacion <- sample_Area_sin_vegetacion[, which(names(sample_Area_sin_vegetacion) %in% sr50)]
  
  sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
  sample_Urbana <- sample_Urbana[, which(names(sample_Urbana) %in% sr50)]
  
  # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
  # sample_Otras_areas_sin_vegetacion <- sample_Otras_areas_sin_vegetacion[, which(names(sample_Otras_areas_sin_vegetacion) %in% sr50)]
  
  sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
  sample_Mineria <- sample_Mineria[, which(names(sample_Mineria) %in% sr50)]
  
  sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
  sample_Cuerpo_de_agua <- sample_Cuerpo_de_agua[, which(names(sample_Cuerpo_de_agua) %in% sr50)]
  # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
  
  ## preparar dataset para treino
  samples <- rbind (sample_Bosque,
                    sample_Manglar,
                    # sample_Bosque_Inundable,
                    sample_Formación_Natural_No_Forestal_Inundable,
                    # sample_Formación_Campestre,
                    # sample_Afloramiento_Rocoso,
                    sample_Otra_Formación_Natural_No_Forestal,
                    # sample_Uso_agropecuario,
                    # sample_Pastos,
                    # sample_Agricultura,
                    sample_Mosaico_de_Agricultura,
                    sample_Area_sin_vegetacion,
                    sample_Urbana,
                    # sample_Otras_areas_sin_vegetacion,
                    sample_Mineria,
                    sample_Cuerpo_de_agua
                    # sample_Glaciar
  )
  
  ## separar variaveis de labels
  dataValues <- samples[2:50]
  dataClass <- samples[1]
  
  ## converter em numerico
  dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
  
  ## control
  control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE) 
  
  ## treinar modelo
  rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                          ntree= 10,
                          mtry= 4,
                          trControl=control,
                          preProc = c ("center", "scale"),
                          allowParallel = TRUE)
  
  
  temp <- as.data.frame(1-rfModel$err.rate[10]); colnames(temp)[1] <- "accuracy"
  temp$run <- i
  temp$level <- "tree10"
  recipe10 <- rbind (temp, recipe10)
}

##
print ("done!! =)")
final <- rbind (recipe, recipe2, recipe3, recipe4, recipe5, recipe6, recipe7, recipe8, recipe9, recipe10)
write.table(final, "5-accuracy-Ntree/accuracy.txt")
}

