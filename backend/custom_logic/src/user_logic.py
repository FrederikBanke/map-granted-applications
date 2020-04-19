import pandas as pd
import os
import custom_logic.src.preprocessing as pp
import custom_logic.src.api as api
import custom_logic.src.main as main


def add_project(original_dataframe, new_project):
    """Adds a new project to a given `dataframe`.
    
    Returns:\n
    `dataframe` containing old projects and the new project.
    """
    return original_dataframe.append(new_project, ignore_index=True)

def abstract_to_vector(doc2vec_model, abstract, TFIDF_model):
    """Transform an abstract to a vector, using the model.\n
    Parameters:\n
    `model` - The model used for the rest of the data\n
    `abstract` - String containing abstract\n

    Returns:\n
    Abstract as vector based on the given model
    """
    # FIXME: Maybe we do not need to use `abstract_to_clean_list()`.
    # Current abstract as inferred vector
    abstract_clean = pp.abstract_to_clean_list(abstract, main.get_tfidf())
    abstract_vec = doc2vec_model.infer_vector(abstract_clean)
    return abstract_vec

def load_data(path, subset=0):
    """Load data from path. The file needs to be a .csv

    Returns:\n
    Dataframe
    """
    # Load data into dataframe
    workdir = os.getcwd()
    df = pd.read_csv(
    workdir + path)  # FIXME: Make it so the user can load any data set

    if subset == 0:
        return df
    return df.head(subset)

def json_to_dataframe(json, subset=0):
    """Load data from path. The file needs to be a .csv

    Returns:\n
    Dataframe
    """
    # This is to make sure it has the right format when passed to pandas
    if type(json) != list:
        json = [json]
        print("Not a list")
    df = pd.DataFrame(json, [i for i in range(0, len(json))])

    if subset == 0:
        return df
    return df.head(subset)

def get_projects_as_df():
    return json_to_dataframe(api.get_projects())
