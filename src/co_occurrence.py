import matplotlib as mpl
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
import utils
from preprocessing import filter_words_TFIDF, abstract_to_clean_list, topn_vocabulary
from functools import partial

# TODO: Lav co occurrence
# Se om vi kan bruge de ord vi har fået fra tf-idf
# TODO: Lav co-occurrence map/network

mpl.use('TkAgg')


# G = nx.Graph()
# G.add_node(1)

# edge from 1 to 2
# G.add_edge('where', 'to', weight=3.0)
# G.add_edge('to', 'best', weight=3.0)
# G.add_edge('where', 'some', weight=3.0)
# G.add_edge('best', 'some', weight=3.0)

def create_map(A, labels):
    """
    Create co-occurrence map.

    Parameters
    ----------
     : 

    Returns
    -------
     : 
    """
    fig, ax = plt.subplots()
    G = nx.from_numpy_matrix(A)
    # nx.draw_networkx_labels(G, pos=nx.spring_layout(G), font_color='r')
    nx.relabel_nodes(G, labels, copy=False)  # Change in place
    nx.draw(G, with_labels=True, ax=ax)


def co_occurrences_in_abstracts(abstract_dict, data, TFIDF_model, unique_occurrences=False):
    """
    Count occurrences of words in abstracts.

    Parameters
    ----------
     : 

    Returns
    -------
     : 
    """
    list_of_top_abstracts = [data['objective'][x]
                             for x in list(abstract_dict.values())]

    vocabulary = topn_vocabulary(list_of_top_abstracts, TFIDF_model=TFIDF_model)
    vocabulary = list(vocabulary.keys())
    print("Vocab")
    print(vocabulary)
    word_index = {w: idx for idx, w in enumerate(vocabulary)}

    voc_length = len(vocabulary)
    mat_shape = (voc_length, voc_length)
    print("started going through array")
    if unique_occurrences:
        return (count_unique_co_occurrences(list_of_top_abstracts, mat_shape, word_index=word_index, vocabulary=vocabulary, zero_diagonal=True), vocabulary)
    else:
        return (count_co_occurrences(
            list_of_top_abstracts, mat_shape, word_index=word_index, zero_diagonal=True), vocabulary)

    # utils.print_done("d")
    # X[X > 0] = 1 # run this line if you don't want extra within-text cooccurence (see below)
    # Xc = (X.T * X) # this is co-occurrence matrix in sparse csr format
    # Xc.setdiag(0) # sometimes you want to fill same word cooccurence to 0
    # print(Xc.todense()) # print out matrix in dense format
    # print(Xc[0])
    # print(Xc)


def count_co_occurrences(list_of_strings, shape=(), word_index=dict(), zero_diagonal=False):
    matrix = np.empty(shape, np.int)
    for words in list_of_strings:
        # utils.print_progress(str(i))
        length = len(words)
        for i in range(length):
            for j in range(i, length):
                matrix[word_index[words[i]]][word_index[words[j]]] += 1
                matrix[word_index[words[j]]][word_index[words[i]]] += 1
    if zero_diagonal:
        np.fill_diagonal(matrix, 0)
    return matrix


def count_unique_co_occurrences(list_of_strings, shape=(), word_index=dict(), vocabulary=list(), zero_diagonal=False):
    """
    Count unique co occurrences in a list of strings.
    
    Parameters
    ----------
    list_of_strings : 

    shape : 

    word_index : 

    vocabulary : 

    zero_diagonal : 
    
    Returns
    -------
     : 
    """
    matrix = np.empty(shape, np.int)
    for string in list_of_strings:
        words = list(set(string.split())) # remove duplicates
        length = len(vocabulary)
        # FIXME: Checks the same word twice, even when it know that it is not in the string
        for i in range(length):
            if vocabulary[i] in words:
                for j in range(i, length):
                    if vocabulary[j] in words:
                        matrix[word_index[vocabulary[i]]][word_index[vocabulary[j]]] += 1
                        matrix[word_index[vocabulary[j]]][word_index[vocabulary[i]]] += 1
    if zero_diagonal:
        np.fill_diagonal(matrix, 0)
    return matrix

# abstract1 = "en hurtig bil kører hurtigt"
# abstract2 = "en langsom bil kører ikke hurtigt"
# abstract3 = "en bil kører hurtigere end en cykel"
# abstract4 = "en cykel kører ikke lige så hurtigt som en bil"

# abstract_list=[abstract1, abstract2, abstract3, abstract4]

# vocabulary = set()
# for doc in abstract_list:
#     vocabulary.update(doc.split())

# vocabulary = list(vocabulary)

# print(vocabulary)

# word_index = {w: idx for idx, w in enumerate(vocabulary)}

# voc_length = len(vocabulary)


# new_matrix = count_unique_co_occurrences(abstract_list, shape=(voc_length, voc_length), word_index=word_index, zero_diagonal=True, vocabulary=vocabulary)

# print(new_matrix)

# labels = {index: word for index, word in enumerate(vocabulary)}

# create_map(new_matrix, labels=labels)

# plt.show()