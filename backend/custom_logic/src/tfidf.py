from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
import operator
import re
# from functools import partial
import pickle
import numpy as np
import custom_logic.src.text_processing as tp
import custom_logic.src.main as main
import time
import custom_logic.src.api as api
from collections import defaultdict
import copy


def filter_words_TFIDF(TFIDF_model, word):
    '''
    Helper function for filtering. Returns true if keep word.
    Returns false otherwise.
    '''
    # print("List of weights: {}".format(list_of_weigths))
    if (word not in TFIDF_model.get_stop_words()):
        return True
    return False


def TFIDF_list_of_weigths(TFIDF_model, objective):
    """
    Uses the TFIDF model on a given text, to weight words of importance.

    Parameters
    ----------
    `TFIDF_model` : A trained TF-IDF model. `TfidfVectorizer`\n
    `objective` : The abstract, whose words should be calculated. `string`.

    Returns
    -------
    `list` : A list of tuples of words with their weight
    """
    # remove symbols from abstract
    objective_wout_symbls = prepare_documents_for_tfidf([objective])

    score = {}
    # Transform the abstract into TfIdf coordinates
    # TODO: test if fit_transform adds the abstract to the TFIDF vocab,
    # and stop retraining the model
    X = TFIDF_model.transform(objective_wout_symbls)
    # get the score/weight from each word in the abstract
    # and create a list of tuples with word and score, in order,
    # with the most importent word first

    term_list = get_term_list(objective_wout_symbls)

    for term in term_list:
        try:
            score[term] = X[0, TFIDF_model.vocabulary_[term]]
        except KeyError:
            # if term not in TFIDF_model.get_stop_words():
            #     print("max_df term", term, " (Ignored)")
            #     score[term] = 0.0  # TODO: Find better value
            # print("Key error, word was {}".format(word))
            pass
    sortedscore = sorted(
        score.items(), key=operator.itemgetter(1), reverse=True
    )

    return sortedscore


def train_TFIDF(load_model=None, delete_model=False):
    """
    Train TFIDF on database projects

    Parameters
    ----------
     : 

    Returns
    -------
     : 
    """
    projects = main.get_projects()
    objectives = list(projects['objective'])
    if load_model:
        if delete_model:
            return train_new_TFIDF(objectives, save_as=load_model)
        try:
            # FIXME: May print before finding exception
            print("Loading TFIDF model...")
            model_loaded = pickle.load(
                open("custom_logic/src/models/" + load_model + ".sav", 'rb'))
            return model_loaded
        except FileNotFoundError:
            print("No TFIDF model exists. Making new model...")
            return train_new_TFIDF(objectives, save_as=load_model)
    else:
        return train_new_TFIDF(objectives)


def train_new_TFIDF(docs, save_as=None):
    """
    Trains a new TFIDF model.\n
    If a user abstract is given, it is used for the training.

    Parameters
    ----------
    docs : `[String]`. Documents to train on\n
    save_as : `String`. Name to save model as.

    Returns
    -------
    `TfidfVectorizer : The newly trained TFIDF model
    """
    print("Started training TFIDF")

    objectives = prepare_documents_for_tfidf(docs)

    # creating tfidf model with given parameters (not trained yet)
    if len(docs) == 1:
        tfidf = init_tfidf_model(max_df=1.0)
    else:
        tfidf = init_tfidf_model()

    # Fit the TfIdf model. Learn vocab and IDF
    tfidf.fit(objectives)

    print("Finished training TFIDF")

    if (save_as):
        pickle.dump(tfidf, open(
            "custom_logic/src/models/" + save_as + ".sav", 'wb')
        )
    return tfidf


def refit_tfidf(old_tfidf_model, new_docs):
    """
    @deprecated\n
    Refit a TFIDF model using a new user project.\n
    Does not save the refitted model.

    Parameters
    ----------
    `new_docs` : `[String]`. The user project to refit on. Must be a `string`.

    Returns
    -------
    `TfidfVectorizer` : The new `TfidfVectorizer`
    refitted on the project objevtive.
    """
    print("Refitting TFIDF model with new docs")
    starttime = time.time()

    corpus_vocabulary = defaultdict(
        None, copy.deepcopy(old_tfidf_model.vocabulary_)
    )
    corpus_vocabulary.default_factory = corpus_vocabulary.__len__

    # Let's say I got a query value from somewhere

    if len(new_docs) == 1:
        temp_tfidf = init_tfidf_model(max_df=1.0)
    else:
        temp_tfidf = init_tfidf_model()
    temp_tfidf.fit(new_docs)
    for term in temp_tfidf.get_feature_names():
        # Added with proper index if not in vocabulary
        corpus_vocabulary[term]

    refitted_tfidf = init_tfidf_model(vocabulary=corpus_vocabulary)
    refitted_tfidf = init_tfidf_model(max_df=1.0)

    database_projects = main.get_projects()

    project_objectives = list(database_projects['objective'])
    print(type(project_objectives))
    docs_wout_symbls = prepare_documents_for_tfidf(
        project_objectives, new_docs
    )

    refitted_tfidf.fit(docs_wout_symbls)

    endtime = time.time()
    print(endtime-starttime, " seconds to refit model")
    return refitted_tfidf


def prepare_documents_for_tfidf(docs, extra_docs=[]):
    """
    Prepare documents for tfidf training.\n
    Gets all documents from database and removes symbols.

    Parameters
    ----------
    `extra_docs` : `list`. A list containing extra documents to train on.

    Returns
    -------
    `list` : A list of `strings`.
    """
    # casting abstracts to a simple list
    for doc in extra_docs:
        docs.append(doc)
    # removing symbols from all documents
    documents = [tp.remove_symbols(str(x)) for x in docs]

    return documents


def init_tfidf_model(max_df=0.7, vocabulary=None):
    """
    Initialize TFIDF model.

    Parameters:
    -------
    `max_df` : `Float` or `Int`. Overwrite max_df. Default 0.7.\n
    `vocabulary`: `list` or `None`. Default `None`. Overwrite vocabulary.

    Returns
    -------
    `TfidfVectorizer` : The initialized tfidf model.
    """
    return TfidfVectorizer(
        max_df=max_df, ngram_range=(1, 2), lowercase=True,
        stop_words='english', vocabulary=vocabulary
    )  # max_df is maybe too low. Be careful


def get_term_list(docs, ngram_range=(1, 2)):
    """
    Gets a list of terms from the given documents.

    Parameters
    ----------
    `docs` : `list` of `strings`.\n
    `ngram_range` : `tuple`

    Returns
    -------
    `list` : `list` of `strings`
    """
    counter = CountVectorizer(ngram_range=ngram_range, stop_words='english')
    counter.fit(docs)
    term_list = counter.get_feature_names()
    return term_list
