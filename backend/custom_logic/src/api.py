import requests
import json
import custom_logic.src.preprocessing as preprocessing
import custom_logic.src.utils as utils
import custom_logic.src.main as main
import custom_logic.src.train as train
import custom_logic.src.user_logic as ul
import custom_logic.src.similar as sml
import custom_logic.src.co_occurrence as cooc
import pandas as pd
import time


def get_projects():
    response = requests.get("http://localhost:8000/api/projects/")
    return response.json()

def fill_database_with_data():
    with open('/home/banke/Projects/BachelorProject/map-granted-applications/backend/custom_logic/src/2007-2013-projects.json', 'r') as f:
        decoded_data=f.read().encode().decode('utf-8-sig') 
        data = json.loads(decoded_data)
    for project in data:
        requests.post("http://localhost:8000/api/projects/", project)
    return


def word_weights(data, user_project=None):
    """
    Create a `dict` of {term: weight} for each term in a document, using TFIDF, if the term's weight passed a certain threshold.

    Parameters
    ----------
    data : a `string` or a `list` of `strings` whose terms are to be scored
    userproject : optional parameter, if given, TFIDF model is retrained with the user project

    Returns
    -------
    `dict` : A `dict` of {term: weight} for each term in a document
    """

    tfidf_model = main.get_tfidf(user_project)
    texts = []
    if type(data) == str:
        texts.append(data)
    elif type(data) == list:
        texts = data
    else:
        raise TypeError("word weight API given wrong data type")
    
    weight_dict = dict()
    for text in texts:
        # create word weight dictionary for each abstract
        weight_list = preprocessing.TFIDF_list_of_weigths(TFIDF_model=tfidf_model, abstract=text)
        temp_dict = utils.tuples_to_dict(weight_list)
        print(temp_dict)
        temp_dict = utils.filter_dict(dictionary=temp_dict, threshold=0.05)
        print(temp_dict)
        weight_dict = utils.merge_dicts(weight_dict, temp_dict)

    return weight_dict

def filter_objectives_on_weights(objectives_list, weight_dict=None):
    """
    Filter project objectives (or others strings) using a dictionary of word weights. 
    If a word in the objevtive is not in the weight dictionary, 
    it will be removed from the filtered objective.
    
    Parameters
    ----------
    objective_list : A `list` of `strings`

    weight_dict : A `dict` that needs to have the format that `word_weights` function returns.
    
    Returns
    -------
    `list` : A `list` of documents with the necessary words removed
    """
    texts = []
    if type(objectives_list) == str:
        objectives_list = [objectives_list]
    elif type(objectives_list) == list:
        pass
    else:
        raise TypeError("filter_objectives_on_weights API given wrong data type")

    if weight_dict == None:
        weight_dict = word_weights(" ".join(objectives_list))
    
    word_list = weight_dict.keys()

    filtered_objective_list = []

    for objective in objectives_list:
        trimmed_objective = preprocessing.remove_symbols(objective)
        list_of_words = trimmed_objective.split(' ')
        filtered_list_of_words = list(filter(lambda word: word in word_list, list_of_words))
        filtered_objective = " ".join(filtered_list_of_words)
        filtered_objective_list.append(filtered_objective)


    return {"filteredObjectives": filtered_objective_list, "wordWeights": weight_dict}

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

def co_occurrence_matrix(texts):
    """
    Create co-occurrunce matrix from a `list` of strings
    
    Parameters
    ----------
     : 
    
    Returns
    -------
     : 
    """
    sorted_vocab, binary_occurrence_matrix =  cooc.create_binary_occurrence_matrix(texts)
    cooccurrence_matrix = cooc.create_coocurrence_matrix(binary_occurrence_matrix)
    norm_cooccurrence_matrix = cooc.normalize_coocurrence_matrix(cooccurrence_matrix)
    return (sorted_vocab, norm_cooccurrence_matrix)