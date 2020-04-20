import numpy as np

def topn_similar(top_n, dec2vec_model, abstract):
    """Creating a top n list of most similar abstracts

    Parameters:\n
    `top_n` - is the amount of most similar abstracts\n
    `dec2vec_model` - the dec2vec model on the data\n
    `abstract` - the abstract to find similar abstracts to. It should be vectorized before hand.\n

    Returns:\n
    A 2-tuple with list of "inferred vectors" of the top n most similar abstracts, 
    and a list of the corrosponding tags
    """
    # The parameter `docvecs` contains all of the vector documents that was used during training.
    if (top_n > len(dec2vec_model.docvecs)):
        print("Cannot choose a top_n larger than the dataset")
        return
    
    # using the doc2vec model to find the user abstract's top_n most similar abstracts
    # FIXME: most_similar is depricated 
    sims = dec2vec_model.docvecs.most_similar([abstract], topn=top_n)

    # initialising a ranked list of top_n most similar abstracts as their vector representation
    vec_top = [np.array(dec2vec_model.docvecs[sims[0][0]])]

    # initialising a ranked list of top_n most similar abstracts as their labels
    tag_top = np.array([(sims[0][0])]) 

    # filling the lists with the vectors and labels
    for i in range(len(sims)-1):
        vec_top = np.append(vec_top, [np.array(dec2vec_model.docvecs[sims[i+1][0]])], axis=0)
        
        tag_top = np.append(tag_top, [np.array(sims[i+1][0])], axis=0)
    return (vec_top, tag_top)