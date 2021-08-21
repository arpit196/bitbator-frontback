from .. models import *
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

import numpy as np
import matplotlib.pyplot as plt

import tensorflow as tf
from tensorflow import keras

import tensorflow_hub as hub

#tfds.disable_progress_bar()

import gensim.downloader as api
from gensim.models import TfidfModel
from gensim.corpora import Dictionary
import tensorflow_text as text
import re
#import model from modelTrain
import math

# Load the required submodules
#import official.nlp.optimization
#import official.nlp.bert.bert_models
#import official.nlp.bert.configs
#import official.nlp.bert.run_classifier
#import official.nlp.bert.tokenization
#import official.nlp.data.classifier_data_lib
#import official.nlp.modeling.losses
#import official.nlp.modeling.models
#import official.nlp.modeling.networks

'''
preprocess = hub.load('https://tfhub.dev/tensorflow/bert_en_uncased_preprocess/1')
encoder = hub.load('https://tfhub.dev/tensorflow/small_bert/bert_en_uncased_L-4_H-256_A-4/2')

'''
dataset = api.load("text8")
dct = Dictionary(dataset)
corpus = [dct.doc2bow(line, allow_update=True) for line in dataset]
model = TfidfModel(corpus)
tag_dict = {}

prototype_embeds = {}

def encode_sentence(s):
   tokens = list(tokenizer.tokenize(s.numpy()))
   tokens.append('[SEP]')
   return tokenizer.convert_tokens_to_ids(tokens)

def pre_process(text):
    
    # lowercase
    text=text.lower()
    
    #remove tags
    text=re.sub("","",text)
    
    # remove special characters and digits
    text=re.sub("(\\d|\\W)+"," ",text)
    
    return text

def few_shot(input, project):
    for project2 in project:
        if (project2.tags and not set(project2.tags).isDisjoint(project.tags)) :
            project_det = preprocess([project+" "+description])
            project2_det = preprocess([project2+" "+description])

            pooled_project = encoder(project_det)["pooled_output"]
            pooled_project2 = encoder(project2_det)["pooled_output"]

            for tag in prototype_embeds.keys():
                if tag in project.tags:
                    prototype_embeds[tag][0] = (prototype_embeds[tag][0]*prototype_embeds[tag][1] + pooled_project)/(prototype_embeds[tag][1]+1)
                    prototype_embeds[tag][1] +=1

def compareUser(input, user, tags, interests):
    print(user)
    input2_matrix = dct.doc2bow(pre_process(input).split())

    user_name = dct.doc2bow(pre_process(user["name"]).split())
    #description = dct.doc2bow(pre_process(user["description"]).split())

    maxScoreProject = 0
    maxScoreInterest = 0

    #compare Projects
    for project in user["projects"] :
        project_name = dct.doc2bow(pre_process(project["name"]).split())
        #description = dct.doc2bow(pre_process(project["description"]).split())
        score = 0
        
        '''for (word, val) in input2_matrix:
            for (word2, val2) in description:
                if(word == word2):
                    score = score + val*val2'''
        
        for (word, val) in input2_matrix:
            for (word2, val2) in project_name:
                if(word == word2):
                    score = score + val*val2
        
        tfscoreInput = 0
        for (word, val) in input2_matrix:
            tfscoreInput = tfscoreInput + val*val
        
        tfscoreInput = math.sqrt(tfscoreInput)
        
        '''
        pooled_input = encoder(input2)["pooled_output"]
        pooled_project = encoder(project)["pooled_output"]
        '''

        #MLscore = cosine_similarity(pooled_input, pooled_project)
        
        if(score>maxScoreInterest):
            maxScoreInterest = score #+ MLscore
    
    #compare Interests
    for collab in user["interests"] :
        description = dct.doc2bow(pre_process(collab['interests']).split())
        tfscoreInput = 0
        for (word, val) in input2_matrix:
            tfscoreInput = tfscoreInput + val*val
        
        tfscoreInput = math.sqrt(tfscoreInput)
        
        for (word, val) in input2_matrix:
            for (word2, val2) in description:
                if(word == word2):
                    score = score + val*val2

        '''
        for tag in tags:
            if tag in user.tags:
                score=score+1
        '''
        
        '''
        pooled_input = encoder(input2)["pooled_output"]
        pooled_project = encoder(description)["pooled_output"]

        MLscore = cosine_similarity(pooled_input, pooled_project)
        '''

        if(score>maxScoreInterest):
            maxScoreInterest = score #+ MLscore
    
    return maxScoreProject + maxScoreInterest

'''def compareAll(input, projects, tags):
    scores = []
    for project in projects:
        score = compare(input, project, tags)
        scores.append({"project": project, "score" : score})
'''

def hasTag(projectTags, tag):
    contains = False
    for ptag in projectTags:
        if tag.lower() == ptag["name"].lower():
            contains = True

    return contains

def compare(input, project, tags):
    #vectorizer = TfidfVectorizer()
    #X = vectorizer.fit_transform(corpus)
    
    #input2 = pre_process(input.name).split()
    tag_score = 0
    all_tags = []

    for tag in tags:
        if tag not in all_tags:
            all_tags.append(tag)
    
    if("tags" in project.keys()):
        for tag in project["tags"]:
            if tag not in all_tags:
                all_tags.append(tag)

    for tag in tags:
        if hasTag(project["tags"], tag):
            tag_score = tag_score + 1.0

    #tag_score = tag_score/(len(all_tags) if len(all_tags)>0 else 1)

    project_name = dct.doc2bow(pre_process(project["name"]).split())
    description = dct.doc2bow(pre_process(project["detail"]).split())

    input2 = dct.doc2bow(pre_process(input).split())

    input2_word = pre_process(input).split()
    project_name_word = pre_process(project["name"]).split()
    
    project_matrix = model[project_name]
    #description_matrix = vectorizer.transform(description)
    description_matrix = model[description]
    input_matrix = model[input2]

    score = 0
    for (word, val) in input_matrix:
        for (word2, val2) in description_matrix:
            if(word == word2):
                score = score + val*val2
    
    tfscoreInput = 0
    for (word, val) in input_matrix:
        tfscoreInput = tfscoreInput + val*val
    
    tfscoreInput = math.sqrt(tfscoreInput)
    
    '''for (word, val) in input_matrix:
        for (word2, val2) in project_matrix:
            if(word == word2):
                score = score + val*val2'''
    for word in input2_word:
        if word in project_name_word:
            #if(word.lower() == word2.lower()):
            score = score + 1

    score = score/(tfscoreInput + 1.0)
    if(score > 0.8):
        return score + tag_score

    input2 = preprocess([input])
    project = preprocess([project["name"]+" "+project["detail"]])

    #tags_match = predict_tags(project, filtered_tags)

    '''
    pooled_input = encoder(input2)["pooled_output"]
    pooled_project = encoder(project)["pooled_output"]
    '''

    #score = score + cosine_similarity(pooled_input, pooled_project) + tag_score
    score = score + tag_score

    '''sentence1 = tf.ragged.constant([
        encode_sentence(project.name+" "+project.description)])
    sentence2 = tf.ragged.constant([
        encode_sentence(input.name+" "+input.description)])'''

    return score

def predict_tags(project, tags):
    pred = model.predict(project)
    tag_num = tag_dict[tags]



