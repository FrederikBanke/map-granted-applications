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
    # print(i)
    sel.annotation.set_text("id: {}\nprice: {} €".format(labels[i], data['ecMaxContribution'][abstract_dict[labels[i]]]))
    # print("Abstract for project {}: <<{}>>\n\n\n".format(labels[i], abstract))


def on_click_point(sel, labels, data, abstract_dict, T):
    i = sel.target.index
    sel.annotation.set_text("")
    abstract = data['objective'][abstract_dict[labels[i]]]
    
    # x.y  x is line number, y is character index
    T.delete(1.0, tk.END)
    T.insert(tk.END, abstract)
    #tk.mainloop()

def setup_box():
    root = tk.Tk()
    S = tk.Scrollbar(root)
    T = tk.Text(root, height=20, width=80)
    S.pack(side=tk.RIGHT, fill=tk.Y)
    T.pack(side=tk.LEFT, fill=tk.Y)
    S.config(command=T.yview)
    T.config(yscrollcommand=S.set)
    return T