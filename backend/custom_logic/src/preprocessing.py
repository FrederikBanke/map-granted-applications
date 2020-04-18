from sklearn.feature_extraction.text import TfidfVectorizer
import operator
import re
from functools import partial
import pickle
import numpy as np
import custom_logic.src.utils
import custom_logic.src.user_logic as ul

function_words = "i|we|you|he|she|it|they|me|us|him|her|them|myself|ourselves|yourself|yourselves|herself|himself|itself|themselves|someone|anyone|noone|everyone|nobody|something|anything|nothing|everything|whoever|whatever|others|mine|ours|yours|hers|theirs|my|our|your|his|its|their|one|first|second|third|once|this|these|that|those|a|an|the|all|alone|another|any|both|each|either|enough|every|few|former|latter|last|least|less|lot|lots|many|more|most|much|neither|next|none|only|other|several|same|some|such|top|whole|and|but|or|nor|although|as|because|if|while|however|whenever|wherever|whether|whyever|thereby|therein|thereupon|thereafter|whereafter|whereas|whereby|wherein|whereupon|again|also|besides|moreover|namely|furthermore|hence|so|therefore|thus|else|instead|otherwise|after|afterwards|before|meanwhile|now|then|until|anyhow|anyway|despite|even|nevertheless|though|yet|eg|ie|per|re|etc|about|above|across|against|along|among|amongst|amoungst|around|at|behind|below|beside|between|beyond|by|down|during|except|for|from|in|inside|into|near|of|off|on|onto|outside|over|since|than|thence|to|toward|towards|under|up|upon|through|thru|throughout|via|with|within|without|am|are|is|was|were|be|been|being|became|have|has|had|do|does|did|done|will|shall|may|can|cannot|would|could|should|might|ought|need|must|used|dare|yes|no|not|already|always|anywhere|beforehand|elsewhere|ever|everywhere|formerly|further|here|hereafter|hereabouts|hereinafter|heretofore|herewith|hereunder|hereby|herein|hereupon|indeed|latterly|mostly|never|nowhere|often|oftentimes|out|perhaps|somehow|sometime|sometimes|somewhat|somewhere|still|there|thereabouts|thereof|thereon|together|well|almost|rather|too|very|who|whom|whose|what|which|when|where|why|how|whither|whence"


def filter_words(word):
    '''
    Helper function for filtering. Returns false if a word is in our list of filler words.
    Returns true otherwise.
    '''

    stoplist = set(function_words.split('|'))
    if word in stoplist:
        return False
    return True


def filter_words_TFIDF(word, list_of_weigths):
    '''
    Helper function for filtering. Returns true if a word makes the threshold.
    Returns false otherwise.
    '''
    # print("List of weights: {}".format(list_of_weigths))

    for word_tuple in list_of_weigths:
        # change threshhold later
        if (word == word_tuple[0]) and (word_tuple[1] > 0.05):
            return True
    return False


def TFIDF_list_of_weigths(TFIDF_model, abstract):
    """
    Uses the TFIDF model on a given text, to weight words of importance.
    
    Parameters
    ----------
    TFIDF_model : 

    abstract : 
    
    Returns
    -------
    list : A list of tuples of words with their weight
    """
    # remove symbols from abstract
    abstract = remove_symbols(abstract.lower())

    score = {}
    # Transform the abstract into TfIdf coordinates
    # FIXME: Måske opdaterer den ikke, men den erstatter
    X = TFIDF_model.transform([abstract])
    # get the score/weight from each word in the abstract
    # and create a list of tuples with word and score, in order, with the most importent word first
    for word in abstract.split(sep=" "):
        try: # FIXME: May skip new words introduced by our own abstract
            score[word] = X[0, TFIDF_model.vocabulary_[word]]
        except KeyError as identifier:
            # print("Key error, word was {}".format(word))
            pass
    sortedscore = sorted(
        score.items(), key=operator.itemgetter(1), reverse=True)

    return sortedscore


def train_TFIDF(abstract=None, delete_model=False):
    if delete_model:
        return train_new_TFIDF(abstract)
    try:
        # FIXME: May print before finding exception
        print("Loading TFIDF model...")
        model_loaded = pickle.load(open("custom_logic/src/models/tfidf_model.sav", 'rb'))
        return model_loaded
    except FileNotFoundError as identifier:
        print("No TFIDF model exists. Making new model...")
        return train_new_TFIDF(abstract)


def train_new_TFIDF(abstracts, abstract=None):
    projects = ul.get_projects_as_df()
    abstracts = projects['objective']
    with_user_project = False
    print("Started training TFIDF")
    # casting abstracts to a simple list
    abstracts = list(abstracts)

    # adding the user's abstract to the others, so the words in the abstract become a part of the vocab when training
    if abstract != None:
        with_user_project = True
        abstracts.append(abstract)

    # removing symbols and simple stop words from all abstracts
    # abstracts = [" ".join(list(filter(filter_words, re.sub(r'[^\w]', ' ', str(x).lower()).split()))) for x in abstracts]
    abstracts = [remove_symbols(str(x).lower()) for x in abstracts]

    # create vocabolary

    # tfidf = TfidfVectorizer() # token_pattern to include single letter words

    # Fit the TfIdf model

    # vocabulary = set()
    # for doc in abstracts:
    #     vocabulary.update(doc.split())

    # vocabulary = list(vocabulary)
    # word_index = {w: idx for idx, w in enumerate(vocabulary)}

    tfidf = TfidfVectorizer(token_pattern=r"(?u)\b\w+\b", max_df=0.7)

    tfidf.fit_transform(abstracts)

    # print("TFIDF: ", tfidf.vocabulary_)
    # for i in range(10):
        # print("{} : {}".format(tfidf.vocabulary_[i], tfidf.idf_[i]))

    print("Finished training TFIDF")

    if with_user_project:
        pickle.dump(tfidf, open("custom_logic/src/models/tfidf_model_with_user_project.sav", 'wb'))
    else:
        pickle.dump(tfidf, open("custom_logic/src/models/tfidf_model.sav", 'wb'))

    return tfidf


def validate_data():
    '''Validate that the data has the right properties.
    '''
    # TODO: Check if the data has the rigth properties
    pass


def abstract_to_clean_list(abstract, TFIDF_model):
    """Creates a list containing the words of an abstract. It makes all words lower case and removes function words.

    Returns:\n
    List with words from an abstract
    """
    # create an ordered list of tuples, with the word and its score, with the most important word first, for this abstract
    list_of_weigths = TFIDF_list_of_weigths(TFIDF_model, abstract)

    # filter out each word not making the threshold in filter_words_TFIDF
    clean_list = list(filter(partial(
        filter_words_TFIDF, list_of_weigths=list_of_weigths), abstract.lower().split()))

    return clean_list


def remove_symbols(string):
    """
    Remove symbols from a string.

    Parameters
    ----------
    `string` : The string to remove symbols from

    Returns
    -------
    `string` : The string without symbols
    """
    string = re.sub(r'[^\w\n\-— ]', '', string)
    string = re.sub(r'[\-\—]', ' ', string)
    string = re.sub(r'(\s\s+)|\n', ' ', string)
    string = re.sub(r'^ | $', '', string)

    return string

def topn_vocabulary(document, TFIDF_model, topn=100):
    """
    Find the top n most important words in a document.
    
    Parameters
    ----------
    `document` : The document to find important words in.
    
    `TFIDF_model` : The TF-IDF model that will be used.

    `topn`: Default = 100. Amount of top words.

    Returns
    -------
    `dictionary` : A dictionary containing words and their importance as a `float`.
    """
    if type(document) == list:
        document = " ".join(document)

    weight_list = TFIDF_list_of_weigths(TFIDF_model=TFIDF_model, abstract=document)
    temp_dict = utils.tuples_to_dict(weight_list[:topn])
    return temp_dict

# string = """To address the emerging and future challenges in the field of energy as well as to meet the expectations of the Council of the European Union (EU), and consequently of the EU Ministries of Defence (MoDs), the Consultation Forum for Sustainable Energy in the Defence and Security Sector (CF SEDSS) will continue pursuing in Phase III the implementation of the EU legal framework on energy and will reaffirm the Consultation Forum as an appropriate vehicle for sharing information and best practices on improving energy management, energy efficiency, the use of renewable energy by the defence sector as well increasing the protection and resilience of defence energy-related critical energy infrastructures. 
 
# Building on the achievements of the previous phases (CF SEDSS phase I and II), the European Defence Agency (EDA) with the support of the European Commission (Directorate General Energy -DG ENER and Executive Agency for Small and Medium-sized Enterprises - EASME), looks forward to continuing assisting the MoDs to move towards more affordable, greener, sustainable and secure energy models. In this context, Phase III will contribute in preparing the defence sector to welcome and accommodate new trends in technology and to address challenges ranging from technical and human factors to hybrid threats and other risks. Overall, Phase III is expected to present the defence and security sectors with an economic, operational, and strategic opportunity to reduce reliance on fossil fuel and natural gas, to progressively minimise energy costs and carbon footprint and to enhance the operational effectiveness and energy resilience of their functions."""

# new_string = remove_symbols(string)

# print(new_string)

# string_arr = new_string.split(sep=" ")
# print(string_arr)
# print('' in string_arr)