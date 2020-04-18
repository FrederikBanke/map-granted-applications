import requests
import json
import custom_logic.src.preprocessing as preprocessing
import custom_logic.src.utils as utils
import custom_logic.src.main as main

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
        temp_dict = utils.filter_dict(dictionary=temp_dict, threshold=0.01)
        weight_dict = utils.merge_dicts(weight_dict, temp_dict)

    # print("{} abstracts in cluser".format(len(abstracts_list)))
    # combined_abstracts = " ".join(abstracts_list)
    # weight_list = preprocessing.TFIDF_list_of_weigths(TFIDF_model=tfidf_model, abstract=combined_abstracts)
    # weight_dict = utils.tuples_to_dict(weight_list)
    
    # word_cloud.create_word_cloud(weight_dict)
    # Return word weight dictionary
    return weight_dict