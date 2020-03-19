def create_abstract_dict(df):
    """Create a dictionary for abstract index where the key is the project id.\n
    Parameters:\n
    `df` - Full data set
    
    Returns:\n
    `abstract_dict` - A dictionary where the key is the projekt id 
    and the value is the index for the corrosponding abstract.
    """
    abstract_dict = {}
    for i in range(df.shape[0]):
        project_id = df['id'][i]
        abstract_dict[str(project_id)] = i # this has to be cast to string for some reason
    
    #print(abstract_dict)
    return abstract_dict