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
import mplcursors
functionWords = "i|we|you|he|she|it|they|me|us|him|her|them|myself|ourselves|yourself|yourselves|herself|himself|itself|themselves|someone|anyone|noone|everyone|nobody|something|anything|nothing|everything|whoever|whatever|others|mine|ours|yours|hers|theirs|my|our|your|his|its|their|one|first|second|third|once|this|these|that|those|a|an|the|all|alone|another|any|both|each|either|enough|every|few|former|latter|last|least|less|lot|lots|many|more|most|much|neither|next|none|only|other|several|same|some|such|top|whole|and|but|or|nor|although|as|because|if|while|however|whenever|wherever|whether|whyever|thereby|therein|thereupon|thereafter|whereafter|whereas|whereby|wherein|whereupon|again|also|besides|moreover|namely|furthermore|hence|so|therefore|thus|else|instead|otherwise|after|afterwards|before|meanwhile|now|then|until|anyhow|anyway|despite|even|nevertheless|though|yet|eg|ie|per|re|etc|about|above|across|against|along|among|amongst|amoungst|around|at|behind|below|beside|between|beyond|by|down|during|except|for|from|in|inside|into|near|of|off|on|onto|outside|over|since|than|thence|to|toward|towards|under|up|upon|through|thru|throughout|via|with|within|without|am|are|is|was|were|be|been|being|became|have|has|had|do|does|did|done|will|shall|may|can|cannot|would|could|should|might|ought|need|must|used|dare|yes|no|not|already|always|anywhere|beforehand|elsewhere|ever|everywhere|formerly|further|here|hereafter|hereabouts|hereinafter|heretofore|herewith|hereunder|hereby|herein|hereupon|indeed|latterly|mostly|never|nowhere|often|oftentimes|out|perhaps|somehow|sometime|sometimes|somewhat|somewhere|still|there|thereabouts|thereof|thereon|together|well|almost|rather|too|very|who|whom|whose|what|which|when|where|why|how|whither|whence"


def filterWords(word):
    '''
    Helper function for filtering. Returns false if a word is in our list of filler words.
    Returns true otherwise.
    '''
    if word in stoplist:
        return False
    return True


def load_model(train_corpus):
    '''Load model from disk.\n
    If there is no model saved on the drive, it will train a new one.

    Parameters:\n
    `train_corpus` - data to train a new model on if it could note be loaded
    '''
    try:
        model_loaded = Doc2Vec.load('saved_model.doc2vec')
        print("Model loaded")
        return model_loaded
    except FileNotFoundError as identifier:
        print("Making new model...")
        return train_model(train_corpus)


def train_model(train_corpus):
    ''' Trains the model based on the parameter given.\n
        Builds a vector from a document, builds a vocabulary (frequency of words), and then train.\n
        It saves the model at the end.
    '''
    # Train the model on the training data
    model = Doc2Vec(vector_size=25, min_count=2, epochs=10)

    print('Built vector from document')

    model.build_vocab(train_corpus)

    print('Built vocabulary')

    # Train the model (corpus_count is the number of )
    model.train(train_corpus, total_examples=model.corpus_count,
                epochs=model.epochs)

    print('Trained model')

    model.save('saved_model.doc2vec')
    return model


def validate_data():
    '''Validate that the data has the right properties.
    '''
    # TODO: Check if the data has the rigth properties
    pass


def on_click_point(sel):
    """Logic for what happens when the user clicks on a point.

    Parameters:\n
    `sel` - is the selected point
    """
    i = sel.target.index
    print(i)
    sel.annotation.set_text(labels[i])
    print("Abstract for project {}: <<{}>>\n\n\n".format(labels[i], abstracts[i]))

def topn_similar(top_n):
    """Creating a top n list of most similar abstracts

    Parameters:\n
    `top_n` - is the amount of most similar abstracts

    Returns:\n
    A list of "inferred vectors" of the top n most similar abstracts
    """
    sims = model.docvecs.most_similar([curAbstractVec], topn=top_n)
    print(sims)

    print(model.docvecs[sims[0][0]])

    x_top = [np.array(model.docvecs[sims[0][0]])]
    for i in range(len(sims)-1):
        x_top = np.append(
            x_top, [np.array(model.docvecs[sims[i+1][0]])], axis=0)
    return x_top
mpl.use('TkAgg')  # Change backend

# Load data into dataframe
workdir = os.getcwd()
df = pd.read_csv(
    workdir + "/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv")  # FIXME: Make it so the user can load any data set
print("Full data set shape: {}x{}".format(df.shape[1], df.shape[0]))

# Choose subset of data
abstracts = df["objective"]
subDf = df.head(200)
validate_data()

# Choose subset of data
#subDf = df
print("Subset data shape: {}x{}".format(subDf.shape[1], subDf.shape[0]))

# Extract abstracts from data set
abstracts = subDf["objective"]

stoplist = set(functionWords.split('|'))


# Create list of abstracts, where each entry is a list of the words (tokens) in the abstract
train_corpus = [TaggedDocument(list(filter(filterWords, abstracts[i].lower().split())), [
                               subDf["id"][i]]) for i in range(len(subDf)) if isinstance(abstracts[i], str)]  # FIXME: Use project id for tag

print('Created TaggedDocument')
print(abstracts[0])
model = load_model(train_corpus)

# Current abstract as inferred vector
curAbstract = """To address the emerging and future challenges in the field of energy as well as to meet the expectations of the Council of the European Union (EU), and consequently of the EU Ministries of Defence (MoDs), the Consultation Forum for Sustainable Energy in the Defence and Security Sector (CF SEDSS) will continue pursuing in Phase III the implementation of the EU legal framework on energy and will reaffirm the Consultation Forum as an appropriate 
vehicle for sharing information and best practices on improving energy management, energy efficiency, the use of renewable energy by the defence sector as well increasing the protection and resilience of defence energy-related critical energy infrastructures.

Building on the achievements of the previous phases (CF SEDSS phase I and II), the European Defence Agency (EDA) with the support of the European Commission (Directorate General Energy -DG ENER and Executive Agency for Small and Medium-sized Enterprises - EASME), looks forward to continuing assisting the MoDs to move towards more affordable, greener, sustainable and secure energy models. In this context, Phase III will contribute in preparing 
the defence sector to welcome and accommodate new trends in technology and to address challenges ranging from technical and human factors to hybrid threats and other risks. Overall, Phase III is expected to present the defence and security sectors with an economic, operational, and strategic opportunity to reduce reliance on fossil fuel and natural gas, to progressively minimise energy costs and carbon footprint and to enhance the operational 
effectiveness and energy resilience of their functions."""
curAbstractClean = list(filter(filterWords, curAbstract.lower().split()))
curAbstractVec = model.infer_vector(curAbstractClean)

# Making top n list of most similar abstract
x_top = topn_similar(top_n=50) #set top_n to len(model.docvecs) for all abstracts

# Adding the current abstract vector to the list of other vectors
x_top = np.append(x_top, [np.array(curAbstractVec)], axis=0)

print('Created inferred vectors')


# Use principal component analysis to transform the multidimensional array into a 3-dimensional
pca = PCA(n_components=3)  # 3-dimensional PCA. 
transformed = pd.DataFrame(pca.fit_transform(x_top))

print('Ran PCA on vectors')

# Splitting the PCA-transformed abstract from the rest of the transformed abstracts
curAbstractTransformed = transformed[len(transformed)-1:]
restTransformed = transformed[:len(transformed)-1]
print(curAbstractTransformed)

# Create figure
fig, ax = plt.subplots()
ax = Axes3D(fig)

# Plot the 3-dimensional array
ax.scatter(restTransformed[0], restTransformed[1], restTransformed[2], c='red')
ax.scatter(curAbstractTransformed[0], curAbstractTransformed[1], curAbstractTransformed[2], c='green')
ax.set_title('Figure title')

# No artist passed so all can be selected
cursor = mplcursors.cursor(hover=False, highlight=True)

# Extract project ids to be used as labels later
labels = subDf['id']

# On the event 'add', run the function `on_click_point`.
cursor.connect("add", on_click_point)

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