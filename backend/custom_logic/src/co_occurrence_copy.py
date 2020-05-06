# coding=utf-8
import matplotlib as mpl
import matplotlib.pyplot as plt
# import networkx as nx
import numpy as np
import utils
from preprocessing import filter_words_TFIDF, abstract_to_clean_list, topn_vocabulary
from functools import partial
from sklearn.feature_extraction.text import CountVectorizer

test_docs = ["woop, skru skru op for den lyd", "og lad bassen komme tæt på vi pumper", "det lige meget bla bla bla", "vi pumper musikken woop woop"]

mpl.use('TkAgg')

# TODO: Optimize by using csr_matrix instead of array_matrix?
def create_binary_occurence_matrix(documents):
    counter = CountVectorizer()

    # make vocab and create document-term matrix with term frequnecies
    csr_occurence_matrix = counter.fit_transform(raw_documents=documents)

    # transform csr_matrix to "regular" array matrix
    occurence_matrix = csr_occurence_matrix.toarray()

    # decresing positive frequencies to 1, making 0 = false and 1 = true, as to whether the term occured in the document
    for i in range(occurence_matrix.shape[0]):
        for j in range(occurence_matrix.shape[1]):
            if(occurence_matrix[i][j] > 1):
                occurence_matrix[i][j] = 1

    # sort vocabulary to match matrix columns
    sorted_vocab = [item[0] for item in sorted(counter.vocabulary_.items())]
                
    return (sorted_vocab, occurence_matrix)

def create_coocurence_matrix(occurence_matrix):
    OT = occurence_matrix.transpose()
    cooc_matrix = np.matmul(OT, occurence_matrix)
    
    return cooc_matrix

def normalize_coocurence_matrix(cooc_matrix):   
    norm_coop = np.zeros((cooc_matrix.shape[0], cooc_matrix.shape[1]))
    for i in range (cooc_matrix.shape[0]):
        for j in range (cooc_matrix.shape[1]):
            # using the formula for association strength to normalize
            cij = cooc_matrix[i][j]
            si = cooc_matrix[i][i]
            sj = cooc_matrix[j][j]
            if (cij != 0 and si != 0 and sj != 0):
                norm_coop[i][j] = cij/(si*sj)

    return norm_coop