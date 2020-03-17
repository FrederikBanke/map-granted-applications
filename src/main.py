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

top_n = int(input("Top n similar: "))

mpl.use('TkAgg')  # Change backend

df = ul.load_data("/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv", 1000)
print("Data set shape: {}x{}".format(df.shape[1], df.shape[0]))

train_corpus = train.create_tag_doc(df)
model = train.train_model(train_corpus)

# model.delete_temporary_training_data(keep_doctags_vectors=True, keep_inference=True)

new_project_path = ''

# currentAbstract = ul.create_test_abstract(model=model, dataframe=df) # return an inferred vector from current abstract 
new_project = ul.create_project(new_project_path)
df = ul.add_project(original_dataframe=df, new_project=new_project)

new_project_vector = ul.abstract_to_vector(model=model, abstract=new_project['objective'][0])

abstract_dict = post_pro.create_abstract_dict(df)

# Making top n list of most similar abstract
x_top = sml.topn_similar(top_n=top_n, abstract=new_project_vector, model=model, dataset= df) #set top_n to len(model.docvecs) for all abstracts

top_vectors = x_top[0] # Extract abstract vectors
top_labels = x_top[1] # Extract abstract id as labels

# Adding the current abstract vector to the list of other vectors
top_vectors = np.append(top_vectors, [new_project_vector], axis=0)
top_labels = np.append(top_labels, [1], axis=0)

print("Started plotting")

contributions = []
for i in range(len(top_labels)):
    contributions.append(df['ecMaxContribution'][abstract_dict[top_labels[i]]])
print(contributions)

plot.plot_abstracts(vectors=top_vectors, contributions=contributions, three_d=False)
print("Plot done")
# No artist passed so all can be selected
cursor_hover = mplcursors.cursor(hover=True, highlight=False)
cursor_click = mplcursors.cursor(hover=False, highlight=False)

# Extract project ids to be used as labels later
#labels = df['id']


T = pl.setup_box()
# On the event 'add', run the function `on_click_point`.
cursor_click.connect("add", lambda sel: pl.on_click_point(sel, labels=top_labels, data=df, abstract_dict=abstract_dict, T=T))
cursor_hover.connect("add", lambda sel: pl.on_hover_point(sel, labels=top_labels, data=df, abstract_dict=abstract_dict))



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