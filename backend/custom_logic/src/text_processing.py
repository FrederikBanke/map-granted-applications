import re
from functools import partial
import custom_logic.src.tfidf as tfidf


function_words = "i|we|you|he|she|it|they|me|us|him|her|them|myself|ourselves|yourself|yourselves|herself|himself|itself|themselves|someone|anyone|noone|everyone|nobody|something|anything|nothing|everything|whoever|whatever|others|mine|ours|yours|hers|theirs|my|our|your|his|its|their|one|first|second|third|once|this|these|that|those|a|an|the|all|alone|another|any|both|each|either|enough|every|few|former|latter|last|least|less|lot|lots|many|more|most|much|neither|next|none|only|other|several|same|some|such|top|whole|and|but|or|nor|although|as|because|if|while|however|whenever|wherever|whether|whyever|thereby|therein|thereupon|thereafter|whereafter|whereas|whereby|wherein|whereupon|again|also|besides|moreover|namely|furthermore|hence|so|therefore|thus|else|instead|otherwise|after|afterwards|before|meanwhile|now|then|until|anyhow|anyway|despite|even|nevertheless|though|yet|eg|ie|per|re|etc|about|above|across|against|along|among|amongst|amoungst|around|at|behind|below|beside|between|beyond|by|down|during|except|for|from|in|inside|into|near|of|off|on|onto|outside|over|since|than|thence|to|toward|towards|under|up|upon|through|thru|throughout|via|with|within|without|am|are|is|was|were|be|been|being|became|have|has|had|do|does|did|done|will|shall|may|can|cannot|would|could|should|might|ought|need|must|used|dare|yes|no|not|already|always|anywhere|beforehand|elsewhere|ever|everywhere|formerly|further|here|hereafter|hereabouts|hereinafter|heretofore|herewith|hereunder|hereby|herein|hereupon|indeed|latterly|mostly|never|nowhere|often|oftentimes|out|perhaps|somehow|sometime|sometimes|somewhat|somewhere|still|there|thereabouts|thereof|thereon|together|well|almost|rather|too|very|who|whom|whose|what|which|when|where|why|how|whither|whence"


def filter_words(word):
    '''
    Helper function for filtering.
    Returns false if a word is in our list of filler words.
    Returns true otherwise.
    '''

    stoplist = set(function_words.split('|'))
    if word in stoplist:
        return False
    return True


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
    # FIXME: Maybe remove ('s) instead of (') to prevent making singular into plural.
    # Or maybe don't remove (') and let TF-IDF do it.
    string = re.sub(r'[^\w\n\-—/. ]', '',
                    string)  # removes all but the listed symbols
    # removes dash, mdash and forward slash
    string = re.sub(r'[\-\—/.]', ' ', string)
    string = re.sub(r'(\s\s+)|\n', ' ', string)  # removes double space
    string = re.sub(r'^ | $', '', string)  # Removes newlines

    return string


def abstract_to_clean_list(abstract, TFIDF_model):
    """Creates a list containing the words of an abstract.
    It makes all words lower case and removes function words.

    Returns:\n
    List with words from an abstract
    """
    # create an ordered list of tuples, with the word and its score,
    # with the most important word first, for this abstract

    # FIXME: May not need to filter based on word weights,
    # since we have a `max_df` when training TFIDF model
    # filter out each word not making the threshold in filter_words_TFIDF
    clean_list = list(
        filter(
            partial(tfidf.filter_words_TFIDF, TFIDF_model),
            abstract.lower().split()
        )
    )

    return clean_list
