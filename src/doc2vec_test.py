from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import collections
import pandas as pd
from gensim.models.doc2vec import TaggedDocument, Doc2Vec
import os
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np

mpl.use('TkAgg')  # Change backend

# Load data into dataframe
workdir = os.getcwd()
df = pd.read_csv(
    workdir + "/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv")
print(df.shape[1])
print(df.shape[0])

# Choose subset of data
abstracts = df["objective"]
subDf = df.head(400)

# Create list of abstracts, where each entry is a list of the words (tokens) in the abstract
train_corpus = [TaggedDocument(abstracts[i].split(), [
                               i]) for i in range(len(subDf)) if isinstance(abstracts[i], str)]

# Train the model on the training data
model = Doc2Vec(train_corpus, vector_size=25, min_count=2, epochs=40)

# Create a list of "inferred vectors" for each abstract. (Make each abstract a dot)
x = [np.array(model.infer_vector(train_corpus[0][0]))]
for i in range(len(train_corpus)-1):
    x = np.append(x, [np.array(model.infer_vector(train_corpus[i+1][0]))], axis=0)

# Use principal component analysis to transform the multidimensional array into a 3-dimensional
pca = PCA(n_components=3) #3-dimensional PCA
transformed = pd.DataFrame(pca.fit_transform(x))

# Plot the 3-dimensional array
plt.scatter(transformed[0],transformed[1],transformed[2])
plt.show()

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
print(counter)

# Show the most, second most and least similar abstracts to an abstract
print('Document ({}): «{}»\n'.format(
    doc_id, ' '.join(train_corpus[doc_id].words)))
print(u'SIMILAR/DISSIMILAR DOCS PER MODEL %s:\n' % model)
for label, index in [('MOST', 0), ('SECOND-MOST', 1), ('MEDIAN', len(sims)//2), ('LEAST', len(sims) - 1)]:
    print(u'%s %s: «%s»\n' %
          (label, sims[index], ' '.join(train_corpus[sims[index][0]].words)))

