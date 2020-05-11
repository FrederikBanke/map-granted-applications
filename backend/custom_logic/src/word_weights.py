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
    import custom_logic.src.utils

    if type(document) == list:
        document = " ".join(document)

    weight_list = TFIDF_list_of_weigths(TFIDF_model=TFIDF_model, abstract=document)
    temp_dict = utils.tuples_to_dict(weight_list[:topn])
    return temp_dict