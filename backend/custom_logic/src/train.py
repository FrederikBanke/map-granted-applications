from gensim.models.doc2vec import TaggedDocument, Doc2Vec
import custom_logic.src.preprocessing as pp
from custom_logic.src.utils import print_done, print_progress
import custom_logic.src.api as api
import custom_logic.src.user_logic as ul
import custom_logic.src.main as main

def train_doc2vec_model(delete_model=False):
    '''Trains a model on the given data set. If there already exists a model on disk, load model from disk.\n

    Parameters:\n
    `delete_model` - Boolean. Delete model even if it exists \n
    '''
    if delete_model:
        return train_new_doc2vec_model()
    try:
        print("Loading model...") # FIXME: May print before finding exception
        model_loaded = Doc2Vec.load('custom_logic/src/models/doc2vec_model.doc2vec')
        return model_loaded
    except FileNotFoundError as identifier:
        print("No model exists. Making new model...")
        return train_new_doc2vec_model()

def train_new_doc2vec_model():
    ''' Trains the model based on the parameter given.\n
    Builds a vector from a document, builds a vocabulary (frequency of words), and then train.\n
    It saves the model at the end.

    Parameters:\n
    '''
    TFIDF_model = main.get_tfidf()
    projects = ul.get_projects_as_df()
    # Create a corpus for the training data, which is a "tagged document"
    train_corpus = create_tag_doc(projects, TFIDF_model)

    # print("Train corpus: ", train_corpus)

    # Train the model on the training data
    print_progress('Setup doc2vec model')
    doc2vec_model = Doc2Vec(vector_size=100, min_count=2, epochs=30)
    print_done('Setup doc2vec model')

    print_progress('Build doc2vec vocabulary')
    doc2vec_model.build_vocab(train_corpus)
    print_done('Build doc2vec vocabulary')

    print_progress("Train doc2vec model")
    # Train the model (corpus_count is the number of )
    doc2vec_model.train(train_corpus, total_examples=doc2vec_model.corpus_count,
                epochs=doc2vec_model.epochs)
    print_done('Train doc2vec model')

    doc2vec_model.save('custom_logic/src/models/doc2vec_model.doc2vec')

    return doc2vec_model

def create_tag_doc(projects, TFIDF_model):
    # Extract abstracts from data set
    abstracts = projects["objective"]
    print_progress("Create TaggedDocument")
    # Create list of abstracts, where each entry is a list of the words (tokens) in the abstract
    # Each abstracts is "cleaned" to remove stop words
    # NOTE: When using project id as tag for document, it must be converted to a string, otherwise they may change.

    td = [TaggedDocument(pp.abstract_to_clean_list(abstracts[i], TFIDF_model), [str(projects["id"][i])]
                               ) for i in range(len(projects)) if isinstance(abstracts[i], str)]
    print_done("Create TaggedDocument")
    
    return td
