import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from gensim.models.doc2vec import TaggedDocument, Doc2Vec
import pandas as pd
import mplcursors
import user_logic as ul
import plot
import plot_logic as pl
import similar as sml
import train
import postprocessing as post_pro
import word_cloud as wc
import sys

mpl.use('TkAgg')  # Change backend

try:
    data_size = int(sys.argv[1])
except IndexError as identifier:
    data_size = 0

delete_model = input("Delete model if it exists (write nothing for 'no'): ")
if delete_model == 1 or delete_model == 'yes':
    delete_model = True
else:
    delete_model = False

top_n = input("Top n similar (write nothing for 50): ")
if top_n == '':
    top_n = 50
else:
    top_n = int(top_n)


df = ul.load_data(
    "/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv", subset=data_size)
print("Data set shape: {}x{}".format(df.shape[1], df.shape[0]))

obj = df['objective'].tolist()

# print("Objectives: {}".format(obj))
wc.create_word_cloud(obj)

train_corpus = train.create_tag_doc(df)
model = train.train_model(train_corpus, delete_model=delete_model)

# model.delete_temporary_training_data(keep_doctags_vectors=True, keep_inference=True)

new_project_path = ''

# currentAbstract = ul.create_test_abstract(model=model, dataframe=df) # return an inferred vector from current abstract
new_project = ul.create_project(new_project_path)
df = ul.add_project(original_dataframe=df, new_project=new_project)

new_project_vector = ul.abstract_to_vector(
    model=model, abstract=new_project['objective'][0])

abstract_dict = post_pro.create_abstract_dict(df)

# Making top n list of most similar abstract
# set top_n to len(model.docvecs) for all abstracts
x_top = sml.topn_similar(
    top_n=top_n, abstract=new_project_vector, model=model, dataset=df)

top_vectors = x_top[0]  # Extract abstract vectors
top_labels = x_top[1]  # Extract abstract id as labels

# Adding the current abstract vector to the list of other vectors
top_vectors = np.append(top_vectors, [new_project_vector], axis=0)
top_labels = np.append(top_labels, [1], axis=0)

print("Started plotting")

contributions = []
for i in range(len(top_labels)):
    contributions.append(df['ecMaxContribution'][abstract_dict[top_labels[i]]])
# print(contributions)

abstract_plot = plot.plot_abstracts(
    vectors=top_vectors, contributions=contributions, three_d=False)
print("Plot done")
# No artist passed so all can be selected
artists = [abstract_plot]
cursor_hover = mplcursors.cursor(artists, hover=True, highlight=False)
cursor_click = mplcursors.cursor(artists, hover=False, highlight=False)

# Extract project ids to be used as labels later
#labels = df['id']


T = pl.setup_box()
# On the event 'add', run the function `on_click_point`.
cursor_click.connect("add", lambda sel: pl.on_click_point(
    sel, labels=top_labels, data=df, abstract_dict=abstract_dict, T=T))
cursor_hover.connect("add", lambda sel: pl.on_hover_point(
    sel, labels=top_labels, data=df, abstract_dict=abstract_dict))


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
