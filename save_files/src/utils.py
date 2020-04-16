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

def merge_dicts(dict1 = {}, dict2 = {}):
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

def filter_dict(dictionary = {}, threshold = 0):
    newDict = dict()
    # Iterate over all the items in dictionary and filter items which has even keys
    for (key, value) in dictionary.items():
        # print("Filtering <{}> with value <{}>".format(key, value))
        # Check if key is even then add pair to new dictionary
        if value > threshold:
            newDict[key] = value
    return newDict