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
    'objective': ["""ESCAPE will break down health care silos that impede integrated care impacting the management of elderly patients with multimorbidity and therefore decrease disease burden both for patients, informal carers and ultimately society. ESCAPE develops a holistic, patient-centred intervention based on the ‘blended’ collaborative care (BCC) approach. BCC involves care coordinators who work closely together with the

patient’s general practitioner under the weekly supervision of a specialty team. Care coordinators will use a meta-algorithm to customize patients’ treatment to their individual needs and preferences and liaise among care providers. As part of the intervention, patients and informal carers will be empowered by social innovation (i.e., the interactive imergo® e-health Integrated Care Platform) to increase their intrinsic capacities.

ESCAPE will conduct for the first time a randomized controlled trial (RCT) embedded in a comprehensive cohort study design to compare BCC and usual care. We will include patients with heart failure, two or more somatic comorbidities and psychological distress. The primary effectiveness endpoint will be patients’ quality of life (QoL). We chose QoL as the primary endpoint, since (i) it is the most important treatment goal for patients, (ii) management of multi-morbidity is focused on improving symptoms and QoL, (iii) the European Society of Cardiology and the American Heart Association recommend it as endpoint in clinical trials as an important target for intervention, and (iv) it is suitable as an endpoint for a comprehensive intervention like ESCAPE, as all components are known to increase QoL.

Cost-effectiveness, cost-utility together with several other patient-relevant outcomes will be used as secondary endpoints. ESCAPE will rethink current practice for the treatment of multimorbidity to reduce fragmentation and optimize care, prioritizing integration of treatment for psychological distress and mental disorders in the treatment of somatic comorbidities.

For the design, conduct, and evaluation of the intervention, our consortium comprises an interdisciplinary team of experts from nine countries spanning from general and hospital medical practice and psychology to health economy and social health innovation as well as patient and informal carer representatives to address the complexity of the health care issues linked to multimorbidity."""],
    'title': ['EVALUATION OF A PATIENT-CENTRED BIOPSYCHOSOCIAL BLENDED COLLABORATIVE CARE PATHWAY FOR THE TREATMENT OF MULTIMORBID ELDERLY PATIENTS']
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

