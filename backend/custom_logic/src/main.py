import sys

import matplotlib as mpl
import matplotlib.pyplot as plt
import mplcursors
import numpy as np
import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

import plot
import plot_logic as pl
import similar as sml
import train
import postprocessing as post_pro
import preprocessing as pre_pro
import time
import user_logic as ul
from cluster import cluster_abstracts
import co_occurrence as co

mpl.use('TkAgg')  # Change backend

try:
    data_size = int(sys.argv[1])
except IndexError as identifier:
    data_size = 0

delete_model = input("Delete model if it exists (write nothing for 'no'): ")
if delete_model == '1' or delete_model == 'yes':
    delete_model = True
else:
    delete_model = False

top_n = input("Top n similar (write nothing for 50): ")
if top_n == '':
    top_n = 50
else:
    top_n = int(top_n)

start = time.time()

df = ul.load_data(
    "/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv", subset=data_size)
print("Data set shape: {}x{}".format(df.shape[1], df.shape[0]))

# Get path for the user's project FIXME

new_project_path = ''

# Create a new dataframe with the users project
new_project = ul.create_project(new_project_path)

# train TFIDF
abstracts = df['objective']
TFIDF_model = pre_pro.train_new_TFIDF(
    abstracts, abstract=new_project['objective'][0])

# Train the doc2vec model
model = train.train_model(df, TFIDF_model=TFIDF_model,
                          delete_model=delete_model)

# Creating a vector from the user's abstract using the trained doc2vec model
new_project_vector = ul.abstract_to_vector(
    model=model, abstract=new_project['objective'][0], TFIDF_model=TFIDF_model)

# Making top n list of most similar abstract
# set top_n to len(model.docvecs) for all abstracts
x_top = sml.topn_similar(
    top_n=top_n, abstract=new_project_vector, model=model, dataset=df)
top_vectors = x_top[0]  # Extract abstract vectors
top_labels = x_top[1]  # Extract abstract id as labels

# Adding the user's abstract vector to the list of other vectors
top_vectors = np.append(top_vectors, [new_project_vector], axis=0)
top_labels = np.append(top_labels, [1], axis=0)

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
plt.show()

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