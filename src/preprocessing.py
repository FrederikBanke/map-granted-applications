from sklearn.feature_extraction.text import TfidfVectorizer 
import operator
import re
from functools import partial

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
    for word_tuple in list_of_weigths:
        if (word == word_tuple[0]) and (word_tuple[1] > 0.05): # change threshhold later
            return True
    return False


def TFIDF_list_of_weigths(TFIDF_model, abstract):
    # remving symbols and simple stop words from the abstract
    abstract = " ".join(list(filter(filter_words, re.sub(r'[^\w]', ' ', abstract.lower()).split())))

    score={}

    # Transform the abstract into TfIdf coordinates
    X = TFIDF_model.transform([abstract])

    # get the score/weight from each word in the abstract
    # and create a list of tuples with word and score, in order, with the most importent word first
    for word in abstract.split():
        score[word] = X[0, TFIDF_model.vocabulary_[word]]
    sortedscore = sorted(score.items(), key=operator.itemgetter(1), reverse=True)
    return sortedscore

def train_TFIDF(abstracts, abstract):
    print("Started training TFIDF")
    # casting abstracts to a simple list
    abstracts = list(abstracts)

    # adding the user's abstract to the others, so the words in the abstract become a part of the vocab when training
    abstracts.append(abstract)

    # remving symbols and simple stop words from all abstracts
    abstracts = [" ".join(list(filter(filter_words, re.sub(r'[^\w]', ' ', str(x).lower()).split()))) for x in abstracts]

    # create vocabolary
    vocabulary = set()
    for doc in abstracts:
        vocabulary.update(doc.split())
    
    vocabulary = list(vocabulary)
    word_index = {w: idx for idx, w in enumerate(vocabulary)}
    
    tfidf = TfidfVectorizer(vocabulary=vocabulary)
    
    # Fit the TfIdf model
    tfidf.fit(abstracts)
    tfidf.transform(abstracts)

    print("Finished training TFIDF")

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
    clean_list = list(filter(partial(filter_words_TFIDF, list_of_weigths=list_of_weigths), abstract.lower().split()))
    
    return clean_list

