import sys

import matplotlib as mpl
import matplotlib.pyplot as plt
# import mplcursors
import numpy as np
import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

# import plot
# import custom_logic.src.plot_logic as pl
import custom_logic.src.similar as sml
import custom_logic.src.train as train
import custom_logic.src.postprocessing as post_pro
import custom_logic.src.preprocessing as pre_pro
import time
import custom_logic.src.user_logic as ul
from custom_logic.src.cluster import cluster_abstracts
# import custom_logic.src.co_occurrence as co
import custom_logic.src.api as api

mpl.use('TkAgg')  # Change backend

def get_tfidf(user_project=None):
    # Create a new dataframe with the users project
    if user_project != None:
        new_project = ul.json_to_dataframe(user_project)
        TFIDF_model = pre_pro.train_TFIDF(abstract=new_project['objective'][0], delete_model=True)
    else:
        TFIDF_model = pre_pro.train_TFIDF(delete_model=True)
    
    # train TFIDF

    return TFIDF_model

def get_doc2vec(user_project=None):
    # Train the doc2vec model
    doc2vec_model = train.train_doc2vec_model(delete_model=True)
    
    return doc2vec_model

def setup_with_user_project(parameter_list):
    pass

def unused():
    # Creating abstract of top_labels mapping to the corresponding index in the dataframe
    abstract_dict = post_pro.create_abstract_dict_top(df, new_project, top_labels)

    # Adding the user's abstract-dataframe to the rest of the dataframe, so it can be plotted
    df = ul.add_project(original_dataframe=df, new_project=new_project)

    # Creating a list of the top ecMaxContributions
    contributions = []
    # the last element is 1, which maps to 25 in the dictionary, but the dataset does not have 25 entries
    for i in range(len(top_labels)):
        contributions.append(df['ecMaxContribution'][abstract_dict[top_labels[i]]])

    # Plotting the top abstracts including the user's
    abstract_plot = plot.plot_abstracts(
        vectors=top_vectors, contributions=contributions, three_d=False)

    # Artist (figures) to add logic to
    artists = [abstract_plot]
    cursor_hover = mplcursors.cursor(artists, hover=True, highlight=False)
    cursor_click = mplcursors.cursor(artists, hover=False, highlight=False)

    # Creating the window for printing abstracts
    T = pl.setup_box()

    # On the event 'add', run the function `on_click_point` and `on_hover_point`.
    cursor_click.connect("add", lambda sel: pl.on_click_point(
        sel, labels=top_labels, data=df, abstract_dict=abstract_dict, T=T))
    cursor_hover.connect("add", lambda sel: pl.on_hover_point(
        sel, labels=top_labels, data=df, abstract_dict=abstract_dict))


    # The projects without the newly added one
    abstracts = x_top[0]  # Extract abstract vectors
    labels = x_top[1]  # Extract abstract id as labels
    n_clusters = 4
    cluster = cluster_abstracts(data=abstracts, n=n_clusters)

    centers_project = np.append(cluster.centers, [new_project_vector], axis=0)
    colormap = list(range(0, n_clusters + 1))
    cluster_fig, cluster_ax = plot.plot_scatter(
        centers_project, color=colormap, cmap='viridis')

    # Setup plot logic for plot with clusters
    cluster_cursor_hover = mplcursors.cursor(
        [cluster_fig], hover=True, highlight=False)
    cluster_cursor_click = mplcursors.cursor(
        [cluster_fig], hover=False, highlight=False)

    # On the event 'add', run the function `on_click_point`.
    cluster_cursor_click.connect("add", lambda sel: pl.on_click_cluster(
        sel, cluster.predicted_cluster, abstract_dict, labels=labels, data=df, tfidf_model=TFIDF_model))
    cluster_cursor_hover.connect("add", lambda sel: pl.on_hover_cluster(sel))


    cooc_matrix, cooc_vocab = co.co_occurrences_in_abstracts(
        abstract_dict=abstract_dict, data=df, TFIDF_model=TFIDF_model, unique_occurrences=True)
    cooc_labels = {index: word for index, word in enumerate(cooc_vocab)}
    co.create_map(cooc_matrix, cooc_labels)


    end = time.time()
    print("Time:", end-start, "seconds")
    # show the plot
    # plt.show()

"""
# Make "sanity check" on the model. Use training data as test data, to see if abstracts are most similar to themselves
ranks = []
second_ranks = []
for doc_id in range(len(train_corpus)):
    inferred_vector = model.infer_vector(train_corpus[doc_id].words)
    sims = model.docvecs.most_similar(
        [inferred_vector], topn=len(model.docvecs))
    rank = [docid for docid, sim in sims].index(doc_id)
    ranks.append(rank)

    second_ranks.append(sims[1])

counter = collections.Counter(ranks)
print("Counter {}".format(counter))

# Show the most, second most and least similar abstracts to an abstract
print('Document ({}): «{}»\n'.format(
    doc_id, ' '.join(train_corpus[doc_id].words)))
print(u'SIMILAR/DISSIMILAR DOCS PER MODEL %s:\n' % model)
for label, index in [('MOST', 0), ('SECOND-MOST', 1), ('MEDIAN', len(sims)//2), ('LEAST', len(sims) - 1)]:
    print(u'%s %s: «%s»\n' %
          (label, sims[index], ' '.join(train_corpus[sims[index][0]].words)))
"""
