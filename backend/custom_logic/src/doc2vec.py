from gensim.models.doc2vec import TaggedDocument, Doc2Vec
from custom_logic.src.utils import print_done, print_progress
import custom_logic.src.api as api
import custom_logic.src.text_processing as tp
import custom_logic.src.main as main
import collections


def train_doc2vec_model(delete_model=False):
    '''Trains a model on the given data set.
    If there already exists a model on disk, load model from disk.\n

    Parameters:\n
    `delete_model` - Boolean. Delete model even if it exists \n
    '''
    if delete_model:
        return train_new_doc2vec_model()
    try:
        print("Loading doc2vec model...")
        # FIXME: May print before finding exception
        model_loaded = Doc2Vec.load(
            'custom_logic/src/models/doc2vec_model.doc2vec'
        )
        return model_loaded
    except FileNotFoundError:
        print("No model exists. Making new model...")
        return train_new_doc2vec_model()


def train_new_doc2vec_model():
    ''' Trains the model.\n
    Builds a vector from a document, builds a vocabulary (frequency of words), and then train.\n
    It saves the model at the end.

    Parameters:\n
    '''
    import custom_logic.src.main as main
    TFIDF_model = main.get_tfidf()

    import custom_logic.src.api as api
    projects = main.get_projects()
    # Create a corpus for the training data, which is a "tagged document"
    train_corpus = create_tag_doc(projects, TFIDF_model)

    # print("Train corpus: ", train_corpus)

    # Train the model on the training data
    print_progress('Setup doc2vec model')
    doc2vec_model = Doc2Vec(vector_size=100, min_count=5, epochs=30)
    print_done('Setup doc2vec model')

    print_progress('Build doc2vec vocabulary')
    doc2vec_model.build_vocab(train_corpus)
    print_done('Build doc2vec vocabulary')

    print_progress("Train doc2vec model")
    # Train the model (corpus_count is the number of )
    doc2vec_model.train(train_corpus,
                        total_examples=doc2vec_model.corpus_count,
                        epochs=doc2vec_model.epochs)
    print_done('Train doc2vec model')

    doc2vec_model.save('custom_logic/src/models/doc2vec_model.doc2vec')

    # sanity_check(train_corpus, doc2vec_model)

    return doc2vec_model


def create_tag_doc(projects, TFIDF_model):
    # Extract abstracts from data set
    abstracts = projects["objective"]
    print_progress("Create TaggedDocument")
    # Create list of abstracts, where each entry is a list of the words (tokens) in the abstract
    # Each abstracts is "cleaned" to remove stop words
    # NOTE: When using project id as tag for document, it must be converted to a string, otherwise they may change.

    # import custom_logic.src.text_processing as tp
    td = [TaggedDocument(tp.abstract_to_clean_list(abstracts[i], TFIDF_model),[str(projects["id"][i])]) 
    # td = [TaggedDocument(tp.abstract_to_clean_list(abstracts[i], TFIDF_model),[i]) # used for sanity check
    for i in range(len(projects)) if isinstance(abstracts[i], str)]
    print_done("Create TaggedDocument")

    return td


def abstract_to_vector(doc2vec_model, abstract, TFIDF_model):
    """Transform an abstract to a vector, using the model.\n
    Parameters:\n
    `model` - The model used for the rest of the data\n
    `abstract` - String containing abstract\n

    Returns:\n
    Abstract as vector based on the given model
    """
    # FIXME: Maybe we do not need to use `abstract_to_clean_list()`.
    # Current abstract as inferred vector
    abstract_clean = tp.abstract_to_clean_list(abstract, TFIDF_model)
    abstract_vec = doc2vec_model.infer_vector(abstract_clean)
    return abstract_vec

def sanity_check(train_corpus, model):
    print("Checking sanity...")
    # Make "sanity check" on the model. Use training data as test data, to see if abstracts are most similar to themselves
    ranks = []
    second_ranks = []
    for doc_id in range(len(train_corpus)):
        if (doc_id % 200 == 0):
            print(doc_id)
        inferred_vector = model.infer_vector(train_corpus[doc_id].words)
        sims = model.docvecs.most_similar([inferred_vector], topn=len(model.docvecs))
        rank = [docid for docid, sim in sims].index(doc_id)
        ranks.append(rank)

        second_ranks.append(sims[1])

    counter = collections.Counter(ranks)
    print("Counter {}".format(dict(sorted(list(counter.items()))[0:10])))
