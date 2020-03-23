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
    'objective': ["""In neuronal networks of the brain, synapses are the connection points between neurons. The dynamics (or plasticity) of these synapses allow us to think, learn and memorize. A deeper understanding of these phenomena requires investigations of single synapses. Synapses have been intensively studied in vivo but in such studies the physiological complexity limits the investigations at the single synapses level.  
 Despite tremendous technical and conceptual advances of in vivo studies, we miss (1) a better understanding of the mechanics of synapses formation; (2) observing directly the chemical activity at single synapses; (3) investigating the role of neuronal network topology in synaptic plasticity. These classical limitations can now be overcome by alternative in vitro approaches, using recent technological advances in microfluidics and nano-technologies.  
 The aim of NANOSYNNETS is to use vertical arrays of NANOwires (aNWs) to study in vitro the formation and plasticity of single SYnapses in Neuronal NETworkS with controlled topologies.
 With my expertise in growing controlled neuronal networks in microfluidic chips, I decided to join the one of the leading group in bio-nanotechnologies, lead by Karen Martinez (KM) and based at the NanoScience Center (NSC) of the University of Copenhagen (UCPH), to exploit novel technologies for the investigation of in vitro single synapse formation, activity and plasticity. This novel approach will give a complementary and cutting-edge point of view to classical in vivo studies of synapses and will thereby provide unmatched insights into neurobiology and will shed new lights on unanswered questions in learning mechanisms or neuronal communication
"""],
    'title': ['Nanowires to study single synapses in patterned neuronal networks.']
    } 
  
    # Create DataFrame 
    df = pd.DataFrame(data) 
    return df

def abstract_to_vector(model, abstract, TFIDF_model):
    """Transform an abstract to a vector, using the model.\n
    Parameters:\n
    `model` - The model used for the rest of the data\n
    `abstract` - String containing abstract

    Returns:\n
    Abstract as vector based on the given model
    """
    
    # Current abstract as inferred vector
    abstract_clean = pp.abstract_to_clean_list(abstract, TFIDF_model)
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

