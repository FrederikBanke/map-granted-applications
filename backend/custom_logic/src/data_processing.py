import pandas as pd
import os
import custom_logic.src.api as api
import custom_logic.src.main as main


def add_project(original_dataframe, new_project):
    """Adds a new project to a given `dataframe`.
    
    Returns:\n
    `dataframe` containing old projects and the new project.
    """
    return original_dataframe.append(new_project, ignore_index=True)

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
    print(type(json))
    if type(json) != list:
        json = [json]
        print("Not a list")
    print("Number of projects ", len(json))
    try:
        df = pd.DataFrame(json, [i for i in range(0, len(json))])
    except KeyError as identifier:
        print("There was an error")
        # raise identifier

    if subset == 0:
        return df
    return df.head(subset)

def create_abstract_dict_all(df, new_project):
    """Create a full dictionary for abstract index where the key is the project id.\n
    Parameters:\n
    `df` - Full data set
    `new_project` - The project to be added to the dataset
    
    Returns:\n
    `abstract_dict` - A dictionary where the key is the projekt id 
    and the value is the index for the corrosponding abstract.
    """

    df = ul.add_project(original_dataframe=df, new_project=new_project)
    abstract_dict = {}
    for i in range(df.shape[0]):
        project_id = df['id'][i]
        abstract_dict[str(project_id)] = i # this has to be cast to string for some reason
    
    return abstract_dict

def create_abstract_dict_top(df, new_project, labels):
    """Create a top dictionary for abstract index where the key is the project id.\n
    Parameters:\n
    `df` - Full data set
    `new_project` - The project to be added to the dataset
    `labels` - The labels of which the index will be found and added to the dict
    
    Returns:\n
    `abstract_dict` - A dictionary where the key is the projekt id 
    and the value is the index for the corrosponding abstract.
    """
    df = ul.add_project(original_dataframe=df, new_project=new_project)
    abstract_dict = {}
    for i in range(len(labels)):
        project_id = labels[i]
        abstract_dict[str(project_id)] = df[df['id']==int(project_id)].index[0] # this has to be cast to string for some reason
    
    return abstract_dict