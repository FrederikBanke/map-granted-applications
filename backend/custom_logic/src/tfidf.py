from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
import operator
import re
# from functools import partial
import pickle
import numpy as np
import custom_logic.src.text_processing as tp

def filter_words_TFIDF(word, list_of_weigths):
    '''
    Helper function for filtering. Returns true if a word makes the threshold.
    Returns false otherwise.
    '''
    # print("List of weights: {}".format(list_of_weigths))

    for word_tuple in list_of_weigths:
        # change threshhold later
        if (word == word_tuple[0]) and (word_tuple[1] > 0.05):
            return True
    return False


def TFIDF_list_of_weigths(TFIDF_model, abstract):
    """
    Uses the TFIDF model on a given text, to weight words of importance.
    
    Parameters
    ----------
    TFIDF_model : A trained TF-IDF model 

    abstract : The abstract, whose words should be calculated
    
    Returns
    -------
    list : A list of tuples of words with their weight
    """
    # remove symbols from abstract
    abstract = tp.remove_symbols(abstract.lower())

    score = {}
    # Transform the abstract into TfIdf coordinates
    # TODO: test if fit_transform adds the abstract to the TFIDF vocab, and stop retraining the model
    X = TFIDF_model.transform([abstract])
    # get the score/weight from each word in the abstract
    # and create a list of tuples with word and score, in order, with the most importent word first

    counter = CountVectorizer(ngram_range=(1,2), stop_words='english') 
    counter.fit([abstract]) # There is probably a faster way to get this vocab
    term_list = list(counter.vocabulary_.keys())
    
    for term in term_list:
        try: # FIXME: May skip new words introduced by our own abstract
            score[term] = X[0, TFIDF_model.vocabulary_[term]]
        except KeyError as identifier:
            # print("Key error, word was {}".format(word))
            pass
    sortedscore = sorted(
        score.items(), key=operator.itemgetter(1), reverse=True)

    return sortedscore


def train_TFIDF(abstract=None, delete_model=False):
    if delete_model:
        return train_new_TFIDF(abstract)
    try:
        # FIXME: May print before finding exception
        print("Loading TFIDF model...")
        model_loaded = pickle.load(open("custom_logic/src/models/tfidf_model.sav", 'rb'))
        return model_loaded
    except FileNotFoundError as identifier:
        print("No TFIDF model exists. Making new model...")
        return train_new_TFIDF(abstract)


def train_new_TFIDF(abstract=None):
    import custom_logic.src.api as api
    projects = api.get_projects_as_df()
    abstracts = projects['objective']
    with_user_project = False
    print("Started training TFIDF")
    # casting abstracts to a simple list
    abstracts = list(abstracts)

    # adding the user's abstract to the others, so the words in the abstract become a part of the vocab when training
    if abstract != None:
        with_user_project = True
        abstracts.append(abstract)

    # removing symbols and simple stop words from all abstracts
    # abstracts = [" ".join(list(filter(filter_words, re.sub(r'[^\w]', ' ', str(x).lower()).split()))) for x in abstracts]
    abstracts = [tp.remove_symbols(str(x).lower()) for x in abstracts]

    # choosing tfidf model parameters
    tfidf = TfidfVectorizer(max_df=0.7, ngram_range=(1,2), stop_words='english')

    # Fit the TfIdf model
    tfidf.fit_transform(abstracts)

    print("Finished training TFIDF")

    if with_user_project:
        pickle.dump(tfidf, open("custom_logic/src/models/tfidf_model_with_user_project.sav", 'wb'))
    else:
        pickle.dump(tfidf, open("custom_logic/src/models/tfidf_model.sav", 'wb'))

    return tfidf