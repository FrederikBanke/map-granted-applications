import re
from functools import partial


def filter_words(stop_words, word):
    """
    Filter function.
    Remove words that are in a given list of words.

    Parameters
    ----------
    stop_words : `list`. List of words not to include.\n
    word : `string`. Word to compare.

    Returns
    -------
    `bool` : 
    """
    if (word not in stop_words):
        return True
    return False


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
    # remove ' followed by some letters
    string = re.sub(r'(\w)\'[a-z]+\s', r'\g<1> ', string)
    # removes all but the listed symbols
    string = re.sub(r'[^\w\n\-—/. ]', '',
                    string)
    # removes dash, mdash and forward slash
    string = re.sub(r'[\-\—/.]', ' ', string)
    # removes double space
    string = re.sub(r'(\s\s+)|\n', ' ', string)
    # Removes newlines
    string = re.sub(r'^ | $', '', string)

    return string


def abstract_to_clean_list(abstract, TFIDF_model):
    """Creates a list containing the words of an abstract.
    It makes all words lower case and removes function words.

    Returns:\n
    List with words from an abstract
    """
    # filter stopwords

    abstracts_wout_symbols = remove_symbols(abstract)

    clean_list = list(
        filter(
            partial(filter_words, TFIDF_model.get_stop_words()),
            abstracts_wout_symbols.lower().split()
        )
    )

    return clean_list
