from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
import operator
import re
# from functools import partial
import pickle
import numpy as np
import custom_logic.src.text_processing as tp
import time
import custom_logic.src.api as api


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
    objective_wout_symbls = tp.remove_symbols(objective.lower())

    score = {}
    # Transform the abstract into TfIdf coordinates
    # TODO: test if fit_transform adds the abstract to the TFIDF vocab,
    # and stop retraining the model
    X = TFIDF_model.transform([objective_wout_symbls])
    # get the score/weight from each word in the abstract
    # and create a list of tuples with word and score, in order,
    # with the most importent word first

    term_list = get_term_list([objective_wout_symbls])

    for term in term_list:
        try:
            score[term] = X[0, TFIDF_model.vocabulary_[term]]
        except KeyError:
            if term not in TFIDF_model.stop_words:
                print("max_df term", term, " (Ignored)")
                score[term] = 0.0  # TODO: Find better value
            # print("Key error, word was {}".format(word))
            pass
    sortedscore = sorted(
        score.items(), key=operator.itemgetter(1), reverse=True)

    return sortedscore


def train_TFIDF(delete_model=False):
    if delete_model:
        return train_new_TFIDF()
    try:
        # FIXME: May print before finding exception
        print("Loading TFIDF model...")
        model_loaded = pickle.load(
            open("custom_logic/src/models/tfidf_model.sav", 'rb'))
        return model_loaded
    except FileNotFoundError as identifier:
        print("No TFIDF model exists. Making new model...")
        return train_new_TFIDF()


def train_new_TFIDF():
    """
    Trains a new TFIDF model.\n
    If a user abstract is given, it is used for the training.

    Parameters
    ----------
    abstract : A user abstract

    Returns
    -------
    `TfidfVectorizer : The newly trained TFIDF model
    """
    print("Started training TFIDF")

    projects = api.get_projects_as_df()
    objectives = list(projects['objective'])

    objectives = prepare_documents_for_tfidf(objectives)

    # creating tfidf model with given parameters (not trained yet)
    tfidf = init_tfidf_model()

    # Fit the TfIdf model. Learn vocab and IDF
    tfidf.fit(objectives)

    print("Finished training TFIDF")

    pickle.dump(tfidf, open("custom_logic/src/models/tfidf_model.sav", 'wb'))

    return tfidf


def refit_tfidf(project_objective):
    """
    @deprecated\n
    Refit a TFIDF model using a new user project.\n
    Does not save the refitted model.

    Parameters
    ----------
    `project_objective` : The user project to refit on. Must be a `string`.

    Returns
    -------
    `TfidfVectorizer` : The new `TfidfVectorizer`
    refitted on the project objevtive.
    """
    print("Refitting TFIDF model with new doc")
    tfidf_new = init_tfidf_model()

    # tfidf_new.fit_transform(project_objective)
    projects = api.get_projects_as_df()
    objectives = list(projects['objective'])
    starttime = time.time()
    objectives = prepare_documents_for_tfidf(objectives, [project_objective])
    endtime = time.time()
    print(endtime-starttime, " seconds to prepare docs for refitting")

    starttime = time.time()
    tfidf_new.fit(objectives)
    endtime = time.time()
    print(endtime-starttime, " seconds to refit model")

    return tfidf_new


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


def init_tfidf_model():
    """
    Initialize TFIDF model.

    Returns
    -------
    `TfidfVectorizer` : The initialized tfidf model.
    """
    return TfidfVectorizer(
        max_df=0.4, ngram_range=(1, 2), lowercase=True,
        stop_words="english"
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
