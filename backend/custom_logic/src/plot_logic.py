import tkinter as tk
import word_cloud
import matplotlib.pyplot as plt
import preprocessing
import utils
from functools import partial

def on_hover_point(sel, labels, data, abstract_dict):
    """Logic for what happens when the user clicks on a point.

    Parameters:\n
    `sel` - is the selected point\n
    `labels` - list of labels\n
    `data` - full dataset, it is a `dataframe`\n
    `abstract_dict` - dictionary of abstract for lookup
    """

    # FIXME: Use abstract_dict instead

    i = sel.target.index
    
    # setting the hovering annotation on each point to be the id and the contribution
    sel.annotation.set_text("id: {}\nprice: {} €".format(labels[i], data['ecMaxContribution'][abstract_dict[labels[i]]]))


def on_click_point(sel, labels, data, abstract_dict, T):
    i = sel.target.index
    sel.annotation.set_text("")

    # Creating the string, which should be printed in a window
    abstract = "Title: {}\n Abstract: {}".format(data['title'][abstract_dict[labels[i]]], data['objective'][abstract_dict[labels[i]]])
    
    # Clearing the window from any potential previous text
    T.delete(1.0, tk.END)# x.y  x is line number, y is character index

    # inserting the string into the window
    T.insert(tk.END, abstract)
    #tk.mainloop()

def setup_box():
    """
    Creating the text window
    """
    root = tk.Tk()
    S = tk.Scrollbar(root)
    T = tk.Text(root, height=20, width=80)
    S.pack(side=tk.RIGHT, fill=tk.Y)
    T.pack(side=tk.LEFT, fill=tk.Y)
    S.config(command=T.yview)
    T.config(yscrollcommand=S.set)
    return T

def on_click_cluster(sel, cluster_list, abstract_dict, labels, data, tfidf_model):
    cluster = sel.target.index
    print("Clicked on cluster {}".format(cluster))
    abstracts = find_abstracts(cluster_list, cluster)
    abstracts_list = []
    weight_dict = dict()
    for i in abstracts:
        # use `data` to acces needed information that needs to be passed to the word cloud
        abstract = data['objective'][abstract_dict[labels[i]]]

        # abstracts_list.append(abstract)

        # create word weight dictionary for each abstract
        weight_list = preprocessing.TFIDF_list_of_weigths(TFIDF_model=tfidf_model, abstract=abstract)
        temp_dict = utils.tuples_to_dict(weight_list)
        temp_dict = utils.filter_dict(dictionary=temp_dict, threshold=0.05)
        weight_dict = utils.merge_dicts(weight_dict, temp_dict)

    # print("{} abstracts in cluser".format(len(abstracts_list)))
    # combined_abstracts = " ".join(abstracts_list)
    # weight_list = preprocessing.TFIDF_list_of_weigths(TFIDF_model=tfidf_model, abstract=combined_abstracts)
    # weight_dict = utils.tuples_to_dict(weight_list)
    
    print("Words for cluster {}: <<{}>>".format(cluster, weight_dict))
    word_cloud.create_word_cloud(weight_dict)
    # plt.show()

def on_hover_cluster(sel):
    pass

def find_abstracts(abstracts, cluster):
    new_list = []
    for i in range(len(abstracts)):
        if abstracts[i] == cluster:
            new_list.append(i)
            # print("Added element {}".format(i))
    # print(new_list)
    return new_list