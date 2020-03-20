import tkinter as tk

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