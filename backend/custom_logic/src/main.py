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

all_projects = pd.DataFrame()
print("In main outside of functions")

def get_projects():
    global all_projects
    if all_projects.empty:
        print("Getting all projects from database")
        all_projects = api.get_projects_as_df()

    return all_projects

def get_tfidf(project_objective=None, delete_model=False):
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
    if type(project_objective) != type(None):
        TFIDF_model = tfidf.train_TFIDF(delete_model=delete_model)
        TFIDF_model = tfidf.refit_tfidf(TFIDF_model, project_objective)
    else:
        TFIDF_model = tfidf.train_TFIDF(delete_model=delete_model)
    
    return TFIDF_model

def get_doc2vec(user_project=None):
    """
    Get the doc2vec model. Trains a new one if none exists.
    
    Parameters
    ----------
    user_project : `dataframe`. Must be a Pandas `dataframe`. Default is `None`.
    
    Returns
    -------
    `Doc2Vec` : The doc2vec.
    """
    # Train the doc2vec model
    doc2vec_model = doc2vec.train_doc2vec_model(delete_model=False)
    
    return doc2vec_model

def setup_with_user_project(parameter_list):
    pass

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
