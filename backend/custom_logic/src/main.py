import sys

import numpy as np
import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

import custom_logic.src.similar as sml
import custom_logic.src.doc2vec as doc2vec
import custom_logic.src.tfidf as tfidf
import time
from custom_logic.src.cluster import cluster_abstracts
# import custom_logic.src.co_occurrence as co
import custom_logic.src.api as api
import custom_logic.src.utils as utils
import pickle

# Used to store all projects locally, so we do not have to
# get from database every time.
all_projects = pd.DataFrame()
all_term_scores = None


def get_projects():
    start = time.time()
    global all_projects
    if all_projects.empty:
        all_projects = api.get_projects_as_df()
    end = time.time()
    print("Time to get all projects: ", end-start, " sek")
    print("Number of projects: ", len(list(all_projects['objective'])))
    return all_projects


def get_tfidf(
    name="tfidf_model", extra_docs=None,
    delete_model=False, refit=False
):
    """
    Gets the TFIDF model. Trains a new one if none exists.\n
    If a new project is given, it will return a refitted model.

    Parameters
    ----------
    project_objective : `string`. Document to refit on. Default is `None`.\n
    delete_model : `boolean`. Should it force delete model.

    Returns
    -------
    `TfidfVectorizer` : The TFIDF model
    """
    # Create a new dataframe with the users project

    start = time.time()
    if not isinstance(extra_docs, type(None)):
        if refit:
            TFIDF_model = tfidf.train_TFIDF(
                load_model=name, delete_model=delete_model
            )
            TFIDF_model = tfidf.refit_tfidf(TFIDF_model, extra_docs)
        else:
            TFIDF_model = tfidf.train_new_TFIDF(extra_docs)
    else:
        TFIDF_model = tfidf.train_TFIDF(
            load_model=name, delete_model=delete_model
        )
    end = time.time()

    print("Time to get TFIDF: ", end-start, " sek")
    return TFIDF_model


def get_doc2vec(user_project=None):
    """
    Get the doc2vec model. Trains a new one if none exists.

    Parameters
    ----------
    user_project : `dataframe`. Must be a Pandas `dataframe`.
    Default is `None`.

    Returns
    -------
    `Doc2Vec` : The doc2vec.
    """
    # Train the doc2vec model
    start = time.time()
    doc2vec_model = doc2vec.train_doc2vec_model(delete_model=False)
    end = time.time()
    print("Time to get doc2vec: ", end-start, " sek")

    return doc2vec_model


def setup_with_user_project(parameter_list):
    pass


def get_weights_for_each_year():
    try:
        with open("custom_logic/src/models/word_weights_by_year.sav", 'rb') as f:
            weights_for_each_year = pickle.load(f)
            f.close()
    except FileNotFoundError:
        print("Making new weights by year")
        projects = get_projects()
        objectives_divided = utils.divide_objectives_by_year(projects)
        weights_for_each_year = utils.save_weights_for_each_year(
            objectives_divided, 10000)
    return weights_for_each_year


def get_all_terms():
    global all_term_scores
    if isinstance(all_term_scores, type(None)):
        try:
            with open("custom_logic/src/models/all_terms.sav", 'rb') as f:
                all_term_scores = pickle.load(f)
                f.close()
            print("Loading scores from disk")

        except FileNotFoundError:
            print("Creating and saving all terms")
            weigths = get_weights_for_each_year()
            all_term_scores = utils.save_all_terms(weigths)
    return all_term_scores


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
