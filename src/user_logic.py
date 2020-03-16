import pandas as pd
import os
import preprocessing as pp

def add_project(original_dataframe, new_project):
    """Adds a new project to a given `dataframe`.
    
    Returns:\n
    `dataframe` containing old projects and the new project.
    """
    return original_dataframe.append(new_project, ignore_index=True)

def create_project(path):
    """Creates a new project from a given path. // Not right now\n
    The project is a `datafram`.

    Parameters:\n
    `path` - Path to csv file containing a new project

    Returns:\n
    A `dataframe` of the new project.
    """
    # TODO: Make a new dataframe for a new project

    # df = pd.read_csv(workdir + path) #FIXME: This is how it should work later on

    data = {'id': [1],
    'objective': ["""
    To address the emerging and future challenges in the field of energy as well as to meet the expectations of the Council of the European Union (EU), and consequently of the EU Ministries of Defence (MoDs), the Consultation Forum for Sustainable Energy in the Defence and Security Sector (CF SEDSS) will continue pursuing in Phase III the implementation of the EU legal framework on energy and will reaffirm the Consultation Forum as an appropriate 
    vehicle for sharing information and best practices on improving energy management, energy efficiency, the use of renewable energy by the defence sector as well increasing the protection and resilience of defence energy-related critical energy infrastructures.

    Building on the achievements of the previous phases (CF SEDSS phase I and II), the European Defence Agency (EDA) with the support of the European Commission (Directorate General Energy -DG ENER and Executive Agency for Small and Medium-sized Enterprises - EASME), looks forward to continuing assisting the MoDs to move towards more affordable, greener, sustainable and secure energy models. In this context, Phase III will contribute in preparing 
    the defence sector to welcome and accommodate new trends in technology and to address challenges ranging from technical and human factors to hybrid threats and other risks. Overall, Phase III is expected to present the defence and security sectors with an economic, operational, and strategic opportunity to reduce reliance on fossil fuel and natural gas, to progressively minimise energy costs and carbon footprint and to enhance the operational 
    effectiveness and energy resilience of their functions.
    """],
    'title': ['Our project']
    } 
  
    # Create DataFrame 
    df = pd.DataFrame(data) 
    return df

def abstract_to_vector(model, abstract):
    """Transform an abstract to a vector, using the model.\n
    Parameters:\n
    `model` - The model used for the rest of the data\n
    `abstract` - String containing abstract

    Returns:\n
    Abstract as vector based on the given model
    """
    
    # Current abstract as inferred vector
    abstract_clean = pp.abstract_to_clean_list(abstract)
    abstract_vec = model.infer_vector(abstract_clean)
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