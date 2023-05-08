# ----------------------------------------------
# PASO 2 ENTRENA MODELO RF
# ----------------------------------------------
# Basado en: https://github.com/mapbiomas-brazil/cerrado (Instituto de Pesquisa Ambiental da Amazônia - IPAM) 
#            Dhemerson Conciani (dhemerson.costa@ipam.org.br)
# Adaptado para Mapbiomas Amazonia
# Ajuste: EYTC-IBC-PERU (07/10/2021)

# setwd('E:/4_4_MapbiomasPERU_Pacifico/Importancia_Variables/P02_txt')
dir()
rm(list=ls())
## select feature space
## Dhemerson Conciani (dhemerson.costa@ipam.org.br)
## Ajust: EYTC -IBC-PERU
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
n_models <- 400  ## 400
n_samples <- 195

## read table
data <- na.omit(read.table("2-txt/spectral_signatures.txt"))

# ## renombrar classes
# data$class <- gsub ("Glaciar", "Outros", data$class)
# 
# ## Excluye clases "outros"
# data  <- subset (data, class != "Outros")

## plot frequencies
x11()
ggplot(data.frame(data$class), aes(x=data$class)) +
  geom_bar() + coord_flip() + theme_classic()
count(data, class)

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
  ## loop for vai começar daqui (treinar multilpos modelos e extrair importancia)
  ## criar recipe vazio
  recipe <- as.data.frame(NULL)
  
  for (i in 1:n_models) {
    print (paste0(i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
    sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
    # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
    # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
    # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
    # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
    # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
    # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
    sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
    sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
    sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
    # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
    sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
    sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
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
    dataValues <- samples[2:153]
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
    
    
    temp <- as.data.frame(importance(rfModel))
    temp$run <- i
    temp$variable <- row.names(temp)
    row.names(temp) <- 1:152
    recipe <- rbind (temp, recipe)
  }
  
  recipe$level <- "geral"
  
  ## treinar modelos apenas com variaveis nativas
  ## criar recipe vazio
  recipe2 <- as.data.frame(NULL)
  
  for (i in 1:n_models) {
    print (paste0(i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
    # sample_Manglar <- Manglar[sample(1:nrow(Manglar), n_samples),]
    # sample_Bosque_Inundable <- Bosque_Inundable[sample(1:nrow(Bosque_Inundable), n_samples),]
    sample_Formación_Natural_No_Forestal_Inundable <- Formación_Natural_No_Forestal_Inundable[sample(1:nrow(Formación_Natural_No_Forestal_Inundable), n_samples),]
    # sample_Formación_Campestre <- Formación_Campestre[sample(1:nrow(Formación_Campestre), n_samples),]
    # sample_Afloramiento_Rocoso <- Afloramiento_Rocoso[sample(1:nrow(Afloramiento_Rocoso), n_samples),]
    sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
    # sample_Uso_agropecuario <- Uso_agropecuario[sample(1:nrow(Uso_agropecuario), n_samples),]
    # sample_Pastos <- Pastos[sample(1:nrow(Pastos), n_samples),]
    # sample_Agricultura <- Agricultura[sample(1:nrow(Agricultura), n_samples),]
    # sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
    # sample_Area_sin_vegetacion <- Area_sin_vegetacion[sample(1:nrow(Area_sin_vegetacion), n_samples),]
    # sample_Urbana <- Urbana[sample(1:nrow(Urbana), n_samples),]
    # sample_Otras_areas_sin_vegetacion <- Otras_areas_sin_vegetacion[sample(1:nrow(Otras_areas_sin_vegetacion), n_samples),]
    # sample_Mineria <- Mineria[sample(1:nrow(Mineria), n_samples),]
    # sample_Cuerpo_de_agua <- Cuerpo_de_agua[sample(1:nrow(Cuerpo_de_agua), n_samples),]
    # sample_Glaciar <- Glaciar[sample(1:nrow(Glaciar), n_samples),]
    
    ## preparar dataset para treino
    samples <- rbind (sample_Bosque,
                      # sample_Manglar,
                      # sample_Bosque_Inundable,
                      sample_Formación_Natural_No_Forestal_Inundable,
                      # sample_Formación_Campestre,
                      # sample_Afloramiento_Rocoso,
                      sample_Otra_Formación_Natural_No_Forestal
                      # sample_Uso_agropecuario,
                      # sample_Pastos,
                      # sample_Agricultura,
                      # sample_Mosaico_de_Agricultura,
                      # sample_Area_sin_vegetacion,
                      # sample_Urbana,
                      # sample_Otras_areas_sin_vegetacion
                      # sample_Mineria,
                      # sample_Cuerpo_de_agua
                      # sample_Glaciar
    )
    # write.table(samples, "P02_txt/samples.csv")
    ## separar variaveis de labels
    dataValues <- samples[2:153]
    dataClass <- samples[1]
    
    ## converter em numerico
    dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
    
    ## control
    control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE)
    
    dataValues <- droplevels (dataValues)  #aqui  eytc
    dataClass <- droplevels (dataClass)    #aqui  eytc
    ## treinar modelo
    rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                            ntree= 100,
                            mtry= 4,
                            trControl=control,
                            preProc = c ("center", "scale"),
                            allowParallel = TRUE)
    
    
    temp <- as.data.frame(importance(rfModel))
    temp$run <- i
    temp$variable <- row.names(temp)
    row.names(temp) <- 1:152
    recipe2 <- rbind (temp, recipe2)
  }
  
  recipe2$level <- "native"
  
  ## Floresta vs. all 
  recipe3 <- as.data.frame(NULL)
  
  data2 <- rbind (Mosaico_de_Agricultura, Formación_Natural_No_Forestal_Inundable, Formación_Campestre, Otra_Formación_Natural_No_Forestal)
  data2$class <- "Outros"
  
  for (i in 1:n_models) {
    print (paste0(i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Bosque <- Bosque[sample(1:nrow(Bosque), n_samples),]
    sample_outros <- data2[sample(1:nrow(data2), n_samples),]
    
    ## preparar dataset para treino
    samples <- rbind (sample_Bosque,
                      sample_outros
    )
    # write.table(samples, "P02_txt/samples.csv")
    ## separar variaveis de labels
    dataValues <- samples[2:153]
    dataClass <- samples[1]
    
    ## converter em numerico
    dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
    
    ## control
    control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE)
    
    dataValues <- droplevels (dataValues)  #aqui  eytc
    dataClass <- droplevels (dataClass)    #aqui  eytc
    ## treinar modelo
    rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                            ntree= 100,
                            mtry= 4,
                            trControl=control,
                            preProc = c ("center", "scale"),
                            allowParallel = TRUE)
    
    
    temp <- as.data.frame(importance(rfModel))
    temp$run <- i
    temp$variable <- row.names(temp)
    row.names(temp) <- 1:152
    recipe3 <- rbind (temp, recipe3)
  }
  
  recipe3$level <- "forest"
  
  
  ## Otra_Formación_Natural_No_Forestal vs. all 
  recipe4 <- as.data.frame(NULL)
  
  data3 <- rbind (Mosaico_de_Agricultura, Formación_Natural_No_Forestal_Inundable, Formación_Campestre)
  data3$class <- "Outros"
  
  for (i in 1:n_models) {
    print (paste0(i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Otra_Formación_Natural_No_Forestal <- Otra_Formación_Natural_No_Forestal[sample(1:nrow(Otra_Formación_Natural_No_Forestal), n_samples),]
    sample_outros <- data3[sample(1:nrow(data3), n_samples),]
    
    ## preparar dataset para treino
    samples <- rbind (sample_Otra_Formación_Natural_No_Forestal,
                      sample_outros
    )
    # write.table(samples, "P02_txt/samples.csv")
    ## separar variaveis de labels
    dataValues <- samples[2:153]
    dataClass <- samples[1]
    
    ## converter em numerico
    dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
    
    ## control
    control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE)
    
    dataValues <- droplevels (dataValues)  #aqui  eytc
    dataClass <- droplevels (dataClass)    #aqui  eytc
    ## treinar modelo
    rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                            ntree= 100,
                            mtry= 4,
                            trControl=control,
                            preProc = c ("center", "scale"),
                            allowParallel = TRUE)
    
    
    temp <- as.data.frame(importance(rfModel))
    temp$run <- i
    temp$variable <- row.names(temp)
    row.names(temp) <- 1:152
    recipe4 <- rbind (temp, recipe4)
  }
  ## exportar
  recipe4$level <- "OFNNF"
  
  ## Mosaico_de_Agricultura vs. all 
  recipe5 <- as.data.frame(NULL)
  
  data4 <- rbind (Bosque, Formación_Natural_No_Forestal_Inundable, Formación_Campestre, Otra_Formación_Natural_No_Forestal)
  data4$class <- "Outros"
  
  
  for (i in 1:n_models) {
    print (paste0(i/n_models*100, " %"))
    ## sortear amostras (400 por classe)
    sample_Mosaico_de_Agricultura <- Mosaico_de_Agricultura[sample(1:nrow(Mosaico_de_Agricultura), n_samples),]
    sample_outros <- data4[sample(1:nrow(data4), n_samples),]
    
    ## preparar dataset para treino
    samples <- rbind (sample_Mosaico_de_Agricultura,
                      sample_outros
    )
    # write.table(samples, "P02_txt/samples.csv")
    ## separar variaveis de labels
    dataValues <- samples[2:153]
    dataClass <- samples[1]
    
    ## converter em numerico
    dataValues <- mutate_all(dataValues, function(x) as.numeric(as.character(x)))
    
    ## control
    control <- trainControl(method="repeatedcv", number=5, repeats=3, classProbs=TRUE)
    
    dataValues <- droplevels (dataValues)  #aqui  eytc
    dataClass <- droplevels (dataClass)    #aqui  eytc
    ## treinar modelo
    rfModel <- randomForest(dataValues, as.factor(dataClass[,1]),
                            ntree= 100,
                            mtry= 4,
                            trControl=control,
                            preProc = c ("center", "scale"),
                            allowParallel = TRUE)
    
    
    temp <- as.data.frame(importance(rfModel))
    temp$run <- i
    temp$variable <- row.names(temp)
    row.names(temp) <- 1:152
    recipe5 <- rbind (temp, recipe5)
  }
  ## exportar
  recipe5$level <- "Mosaico_de_Agricultura"
  
  recipe_final <- rbind (recipe, recipe2, recipe3, recipe4, recipe5)
  # write.table(recipe, "P02_txt/geral_models.txt")
  write.table(recipe_final, "2-txt/importance.txt")
}
