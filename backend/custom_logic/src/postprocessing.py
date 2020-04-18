import custom_logic.src.user_logic as ul

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