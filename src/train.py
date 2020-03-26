from gensim.models.doc2vec import TaggedDocument, Doc2Vec
import preprocessing as pp
from utils import print_done, print_progress


def train_model(df, TFIDF_model, delete_model=False):
    '''Trains a model on the given data set. If there already exists a model on disk, load model from disk.\n

    Parameters:\n
    `df` - data to train a new model on if it could note be \n
    `delete_model` - Boolean. Delete model even if it exists \n
    `TFIDF_model` - Model used to filter stop words later
    '''
    if delete_model:
        return train_new_model(df, TFIDF_model)
    try:
        print("Loading model...") # FIXME: May print before finding exception
        model_loaded = Doc2Vec.load('saved_model.doc2vec')
        return model_loaded
    except FileNotFoundError as identifier:
        print("No model exists. Making new model...")
        return train_new_model(df, TFIDF_model)

def train_new_model(df, TFIDF_model):
    ''' Trains the model based on the parameter given.\n
    Builds a vector from a document, builds a vocabulary (frequency of words), and then train.\n
    It saves the model at the end.

    Parameters:\n
    `df` - data to train a new model on if it could note be \n
    `TFIDF_model` - Model used to filter stop words later
    '''

    # Create a corpus for the training data, which is a "tagged document"
    train_corpus = create_tag_doc(df, TFIDF_model)

    # print("Train corpus: ", train_corpus)

    # Train the model on the training data
    print_progress('Built vector from document')
    model = Doc2Vec(vector_size=100, min_count=2, epochs=30)
    print_done('Built vector from document')

    print_progress('Build vocabulary')
    model.build_vocab(train_corpus)
    print_done('Build vocabulary')

    print_progress("Train model")
    # Train the model (corpus_count is the number of )
    model.train(train_corpus, total_examples=model.corpus_count,
                epochs=model.epochs)

    print_done('Train model')

    model.save('saved_model.doc2vec')

    return model

def create_tag_doc(df, TFIDF_model):
    # Extract abstracts from data set
    abstracts = df["objective"]
    print_progress("Create TaggedDocument")
    # Create list of abstracts, where each entry is a list of the words (tokens) in the abstract
    # Each abstracts is "cleaned" to remove stop words
    # NOTE: When using project id as tag for document, it must be converted to a string, otherwise they may change.

    td = [TaggedDocument(pp.abstract_to_clean_list(abstracts[i], TFIDF_model), [str(df["id"][i])]
                               ) for i in range(len(df)) if isinstance(abstracts[i], str)]
    print_done("Create TaggedDocument")
    
    return td
