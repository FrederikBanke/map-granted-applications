from gensim.models.doc2vec import TaggedDocument, Doc2Vec
import preprocessing as pp


def train_model(train_corpus, delete_model=False):
    '''Trains a model on the given data set. If there already exists a model on disk, load model from disk.\n

    Parameters:\n
    `train_corpus` - data to train a new model on if it could note be \n
    `delete_model` - Boolean. Delete model even if it exists
    '''
    if delete_model:
        return train_new_model(train_corpus)
    try:
        print("Loading model...") # FIXME: May print before finding exception
        model_loaded = Doc2Vec.load('saved_model.doc2vec')
        return model_loaded
    except FileNotFoundError as identifier:
        print("No model exists. Making new model...")
        return train_new_model(train_corpus)

def train_new_model(train_corpus):
    ''' Trains the model based on the parameter given.\n
    Builds a vector from a document, builds a vocabulary (frequency of words), and then train.\n
    It saves the model at the end.
    '''
    # Train the model on the training data
    model = Doc2Vec(vector_size=100, min_count=2, epochs=30)

    print('Built vector from document')

    model.build_vocab(train_corpus)

    print('Built vocabulary')

    # Train the model (corpus_count is the number of )
    model.train(train_corpus, total_examples=model.corpus_count,
                epochs=model.epochs)

    print('Trained model')

    model.save('saved_model.doc2vec')

    return model

def create_tag_doc(df):
    # Extract abstracts from data set
    abstracts = df["objective"]
    # Create list of abstracts, where each entry is a list of the words (tokens) in the abstract
    # NOTE: When using project id as tag for document, it must be converted to a string, otherwise they may change.
    td = [TaggedDocument(pp.abstract_to_clean_list(abstracts[i]), [str(df["id"][i])]
                               ) for i in range(len(df)) if isinstance(abstracts[i], str)]
    print('Created TaggedDocument')
    return td
