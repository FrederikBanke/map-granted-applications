import pandas as pd
import pickle
import custom_logic.src.api as api
from sklearn.decomposition import PCA
import custom_logic.src.main as main
from sklearn.feature_extraction.text import CountVectorizer


def print_progress(string):
    whitespace = ' ' * (40-len(string))
    print('\r{}: In progress{}'.format(string, whitespace), end='', flush=True)
    # sys.stdout.flush()
    # time.sleep(1)


def print_done(string):
    whitespace = ' ' * (40-len(string))
    print('\r{}: Done{}'.format(string, whitespace), flush=True)


def tuples_to_dict(tuple_list):
    if type(tuple_list) != list:
        raise ValueError("Parameter `tuple_list` was not a list.")
    dic = {}
    for tup in tuple_list:
        dic[tup[0]] = tup[1]
    return dic


def sum_dicts(dict1={}, dict2={}):
    """
    Merges to dictionaries. If they share keys, their values will be summed.\n
    Values should be numbers, otherwise results might be weird.

    Parameters
    ----------
    dict1 : \n
    dict2 : 

    Returns
    -------
    `dict` : Merged dictionary with all keys and summed values.
    """
    new_dict = dict1.copy()
    dict1_keys = dict1.keys()
    # merge dictionaries
    new_dict.update(dict2)
    all_keys = new_dict.keys()
    dict2_keys = dict2.keys()

    for key in all_keys:
        if key in dict1_keys and key in dict2_keys:
            new_dict[key] = dict1[key] + dict2[key]
    return new_dict


def filter_dict_weight(dictionary={}, threshold=0):
    """
    Filter a dictionary with word weights. It will be filtered by the threshold set for the weights.

    Parameters
    ----------
    dictionary : A `dict` to filter\n
    threshold : Weight threshold to filter by. Default is 0.

    Returns
    -------
    `dict` : New dictionary with only words that surpass the weight threshold.
    """
    newDict = dict()
    # Iterate over all the items in dictionary and filter items which has even keys
    for (key, value) in dictionary.items():
        # print("Filtering <{}> with value <{}>".format(key, value))
        # Check if key is even then add pair to new dictionary
        if value > threshold:
            newDict[key] = value
    return newDict


def subset_dict(dictionary={}, subset_size=1):
    """
    Make a subset of a dictionary.

    Parameters
    ----------
    dictionary : A `dict` to filter\n
    subset_size : Size of new dictionary. Default is 1.

    Returns
    -------
    `dict` : New dictionary with only words that surpass the weight threshold.
    """
    newDict = {k: v for k, v in list(dictionary.items())[:subset_size]}
    return newDict


def sort_dict_by_value(_dict):
    # Set reverse to True to get descending order
    return {k: v for k, v in sorted(_dict.items(), key=lambda item: item[1], reverse=True)}


def transform_pca(vectors, dimensions=2):
    """Helper function for PCA. Reduces vector to given dimensions.\n
    Paramters:\n
    `vectors` - the vectors to run PCA on\n
    `dimensions` - how many dimensions the PCA should reduce to

    Returns:\n
    The new reduced vectors
    """
    pca = PCA(n_components=dimensions)  # n-dimensional PCA.
    return pd.DataFrame(pca.fit_transform(vectors))


def divide_objectives_by_year(projects):
    noDates = 0  # FIXME: Remove
    objectives_by_year = {}
    dates = list(projects['startDate'])
    objectives = list(projects['objective'])
    for i in range(len(dates)):
        try:
            year = dates[i].split("-")[0]
            if (year not in list(objectives_by_year.keys())):
                objectives_by_year[year] = []
            objectives_by_year[year].append(
                objectives[i]
            )
        except AttributeError:
            noDates = noDates + 1  # FIXME: Remove

    return objectives_by_year


def save_weights_for_each_year(objectives_by_year, subset):
    word_weights_by_year = {}
    for year in objectives_by_year:
        word_weights = api.word_weights(objectives_by_year[year])
        sorted_word_weights = sort_dict_by_value(word_weights)
        subset_sorted = subset_dict(sorted_word_weights, subset)
        word_weights_by_year[year] = subset_sorted
    with open("custom_logic/src/models/word_weights_by_year.sav", 'wb') as f:
        pickle.dump(word_weights_by_year, f)
        f.close()

    return word_weights_by_year


def save_all_terms(word_weights_by_year):
    union_of_words = set()
    for year in word_weights_by_year:
        union_of_words = union_of_words.union(
            set(word_weights_by_year[year].keys())
        )

    all_terms = list(union_of_words)
    print("Saving ", len(all_terms), " terms")
    with open("custom_logic/src/models/all_terms.sav", 'wb') as f:
        pickle.dump(all_terms, f)
        f.close()

    return all_terms


def load_all_terms():
    with open("custom_logic/src/models/all_terms.sav", 'rb') as f:
        all_terms = pickle.load(f)
        f.close()

    return all_terms


def load_weights_for_each_year():
    with open("custom_logic/src/models/word_weights_by_year.sav", 'rb') as f:
        word_weights = pickle.load(f)
        f.close()

    return word_weights
