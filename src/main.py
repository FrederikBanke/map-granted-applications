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
import preprocessing as pre_pro

top_n = int(input("Top n similar: "))

mpl.use('TkAgg')  # Change backend

df = ul.load_data("/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv")
print("Data set shape: {}x{}".format(df.shape[1], df.shape[0])) 

# Get path for the user's project FIXME
new_project_path = ''

# Create a new dataframe with the users project
new_project = ul.create_project(new_project_path)

# train TFIDF
abstracts = df['objective']
TFIDF_model = pre_pro.train_TFIDF(abstracts,new_project['objective'][0])

# Create a corpus for the training data, which is a "tagged document"
train_corpus = train.create_tag_doc(df, TFIDF_model)

# Train the doc2vec model
model = train.train_model(train_corpus)

# Creating a vector from the user's abstract using the trained doc2vec model
new_project_vector = ul.abstract_to_vector(model=model, abstract=new_project['objective'][0], TFIDF_model=TFIDF_model)

# Making top n list of most similar abstract
x_top = sml.topn_similar(top_n=top_n, abstract=new_project_vector, model=model, dataset= df) #set top_n to len(model.docvecs) for all abstracts
top_vectors = x_top[0] # Extract abstract vectors
top_labels = x_top[1] # Extract abstract id as labels

# Adding the user's abstract vector to the list of other vectors
top_vectors = np.append(top_vectors, [new_project_vector], axis=0)
top_labels = np.append(top_labels, [1], axis=0)

# Creating abstract of top_labels mapping to the corrospinding index in the dataframe
abstract_dict = post_pro.create_abstract_dict_top(df, new_project, top_labels)

# Adding the user's abstract-dataframe to the rest of the dataframe, so it can be plotted
df = ul.add_project(original_dataframe=df, new_project=new_project)

print("Started plotting")

# Creating a list of the top ecMaxContributions
contributions = []
for i in range(len(top_labels)): # the last element is 1, which maps to 25 in the dictionary, but the dataset does not have 25 entries
    contributions.append(df['ecMaxContribution'][abstract_dict[top_labels[i]]])

# Plotting the top abstracts including the user's
plot.plot_abstracts(vectors=top_vectors, contributions=contributions, three_d=False)
print("Plot done")

# No artist passed so all can be selected
cursor_hover = mplcursors.cursor(hover=True, highlight=False)
cursor_click = mplcursors.cursor(hover=False, highlight=False)

# Creating the window for printing abstracts
T = pl.setup_box()

# On the event 'add', run the function `on_click_point` and `on_hover_point`.
cursor_click.connect("add", lambda sel: pl.on_click_point(sel, labels=top_labels, data=df, abstract_dict=abstract_dict, T=T))
cursor_hover.connect("add", lambda sel: pl.on_hover_point(sel, labels=top_labels, data=df, abstract_dict=abstract_dict))

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