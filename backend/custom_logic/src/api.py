import requests
import json
import custom_logic.src.preprocessing as preprocessing
import custom_logic.src.utils as utils
import custom_logic.src.main as main
import custom_logic.src.train as train
import custom_logic.src.user_logic as ul
import custom_logic.src.similar as sml
import pandas as pd
import time


def get_projects():
    response = requests.get("http://localhost:8000/api/projects/")
    return response.json()

def fill_database_with_data():
    with open('/home/banke/Projects/BachelorProject/map-granted-applications/backend/custom_logic/src/Project-2020-02-07.json') as f:
        data = json.load(f)
    for project in data:
        requests.post("http://localhost:8000/api/projects/", project)
    return

def word_weights(data, user_project=None):
    tfidf_model = main.get_tfidf(user_project)
    texts = []
    if type(data) == str:
        texts.append(data)
    elif type(data) == list:
        texts = data
    
    abstracts_list = []
    weight_dict = dict()
    for text in texts:
        # create word weight dictionary for each abstract
        weight_list = preprocessing.TFIDF_list_of_weigths(TFIDF_model=tfidf_model, abstract=text)
        temp_dict = utils.tuples_to_dict(weight_list)
        temp_dict = utils.filter_dict(dictionary=temp_dict, threshold=0.05)
        weight_dict = utils.merge_dicts(weight_dict, temp_dict)

    return weight_dict

def closest_vectors(user_project):
    """
    Find the closest projects to a given project. Makes the documents into vectors.
    Returns a list of the closest projects.
    
    Parameters
    ----------
    user_project : `dataframe`. The user's project. Must be formatted as a Pandas `dataframe`.
    
    Returns
    -------
    `tuple` : A tuple containing 2 `lists`. Index 0 is the vectors and index 1 the tags. ([vectors], [tags])
    """
    TFIDF_model = main.get_tfidf(user_project)
    doc2vec_model = main.get_doc2vec()

    # print(user_project)

    #FIXME: Maybe move this into `sml.topn_similar()`
    # Creating a vector from the user's abstract using the trained doc2vec model
    user_project_vector = ul.abstract_to_vector(
        doc2vec_model=doc2vec_model, abstract=user_project['objective'][0], TFIDF_model=TFIDF_model)

    # Making top n list of most similar abstract
    # set top_n to len(model.docvecs) for all abstracts
    top_vecs_tags = sml.topn_similar(
        top_n=1000, abstract=user_project_vector, dec2vec_model=doc2vec_model)
    # top_vectors = top_vecs_tags[0]  # Extract abstract vectors from tuple
    # top_tags = top_vecs_tags[1]  # Extract abstract tags from tuple

    # Adding the user's abstract vector to the list of other vectors
    # top_vectors = np.append(top_vectors, [user_project_vector], axis=0)
    # top_tags = np.append(top_tags, [1], axis=0)

    return top_vecs_tags

def closest_projects(user_project):
    """
    Find the closest projects to the given project. Converts the given project to a vector, and finds the closest vectors.
    
    Parameters
    ----------
    user_project : The user project to find the closest other projects to.
    
    Returns
    -------
    `list` : A list containing the closest projects to the `text`, where each element is a json string.
    """
    # Get the closest projects, and extract only the ids directly.
    closest_ids = closest_vectors(user_project)[1]
    
    # make a list of closest projects (sorted)
    all_projects = main.get_projects()

    closest_projects_df = pd.concat([all_projects[all_projects['id']==i] for i in closest_ids])

    project_list = closest_projects_df.to_dict(orient="records")

    # Find top n closest
    return project_list

def co_occurrence_matrix():
    pass