import numpy as np

def topn_similar(top_n, model, abstract, dataset):
    """Creating a top n list of most similar abstracts

    Parameters:\n
    `top_n` - is the amount of most similar abstracts\n
    `model` - the model on the data\n
    `abstract` - the abstract to find similar abstracts to\n
    `dataset` - the whole data set

    Returns:\n
    A 2-tuple with list of "inferred vectors" of the top n most similar abstracts, 
    and a list of the corrosponding labels
    """
    if (top_n > len(dataset)):
        print("Cannot choose a top_n larger than the dataset")
        return
    
    # using the doc2vec model, to find "abstract's" top_n most similar abstracts
    sims = model.docvecs.most_similar([abstract], topn=top_n)

     # initialising a ranked list of top_n most similar abstracts as their vector representation
    x_top = [np.array(model.docvecs[sims[0][0]])]

     # initialising a ranked list of top_n most similar abstracts as their labels
    labels_top = np.array([(sims[0][0])]) 

    # filling the lists with the vectors and labels
    for i in range(len(sims)-1):
        x_top = np.append(x_top, [np.array(model.docvecs[sims[i+1][0]])], axis=0)
        
        labels_top = np.append(labels_top, [np.array(sims[i+1][0])], axis=0)
    return (x_top, labels_top)