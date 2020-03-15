import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from mpl_toolkits.mplot3d import Axes3D
import os
from gensim.models.doc2vec import TaggedDocument, Doc2Vec
import pandas as pd
import collections
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
functionWords = "i|we|you|he|she|it|they|me|us|him|her|them|myself|ourselves|yourself|yourselves|herself|himself|itself|themselves|someone|anyone|noone|everyone|nobody|something|anything|nothing|everything|whoever|whatever|others|mine|ours|yours|hers|theirs|my|our|your|his|its|their|one|first|second|third|once|this|these|that|those|a|an|the|all|alone|another|any|both|each|either|enough|every|few|former|latter|last|least|less|lot|lots|many|more|most|much|neither|next|none|only|other|several|same|some|such|top|whole|and|but|or|nor|although|as|because|if|while|however|whenever|wherever|whether|whyever|thereby|therein|thereupon|thereafter|whereafter|whereas|whereby|wherein|whereupon|again|also|besides|moreover|namely|furthermore|hence|so|therefore|thus|else|instead|otherwise|after|afterwards|before|meanwhile|now|then|until|anyhow|anyway|despite|even|nevertheless|though|yet|eg|ie|per|re|etc|about|above|across|against|along|among|amongst|amoungst|around|at|behind|below|beside|between|beyond|by|down|during|except|for|from|in|inside|into|near|of|off|on|onto|outside|over|since|than|thence|to|toward|towards|under|up|upon|through|thru|throughout|via|with|within|without|am|are|is|was|were|be|been|being|became|have|has|had|do|does|did|done|will|shall|may|can|cannot|would|could|should|might|ought|need|must|used|dare|yes|no|not|already|always|anywhere|beforehand|elsewhere|ever|everywhere|formerly|further|here|hereafter|hereabouts|hereinafter|heretofore|herewith|hereunder|hereby|herein|hereupon|indeed|latterly|mostly|never|nowhere|often|oftentimes|out|perhaps|somehow|sometime|sometimes|somewhat|somewhere|still|there|thereabouts|thereof|thereon|together|well|almost|rather|too|very|who|whom|whose|what|which|when|where|why|how|whither|whence"


mpl.use('TkAgg')  # Change backend

# Load data into dataframe
workdir = os.getcwd()
df = pd.read_csv(
    workdir + "/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv")
print(df.shape[1])
print(df.shape[0])

# Choose subset of data
abstracts = df["objective"]
subDf = df.head(df.shape[0])

stoplist = set(functionWords.split('|'))


def filterWords(word):
    '''
    Helper function for filtering. Returns false if a word is in our list of filler words.
    Returns true otherwise.
    '''
    if word in stoplist:
        return False
    return True


# Create list of abstracts, where each entry is a list of the words (tokens) in the abstract
train_corpus = [TaggedDocument(list(filter(filterWords, abstracts[i].lower().split())), [
                               df["id"][i]]) for i in range(len(subDf)) if isinstance(abstracts[i], str)]  # FIXME: Use project id for tag

print(train_corpus[0])

# Train the model on the training data
model = Doc2Vec(train_corpus, vector_size=25, min_count=2, epochs=40)

# Create a list of "inferred vectors" for each abstract. (Make each abstract a dot)
x = [np.array(model.infer_vector(train_corpus[0][0]))]
for i in range(len(train_corpus)-1):
    x = np.append(
        x, [np.array(model.infer_vector(train_corpus[i+1][0]))], axis=0)

# Use principal component analysis to transform the multidimensional array into a 3-dimensional
pca = PCA(n_components=3)  # 3-dimensional PCA
transformed = pd.DataFrame(pca.fit_transform(x))

# Plot the 3-dimensional array
fig = plt.figure()
ax = Axes3D(fig)
ax.scatter(transformed[0], transformed[1], transformed[2])
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
