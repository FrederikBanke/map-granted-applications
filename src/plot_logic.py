
def on_click_point(sel, labels, data, abstract_dict):
    """Logic for what happens when the user clicks on a point.

    Parameters:\n
    `sel` - is the selected point\n
    `labels` - list of labels\n
    `data` - full dataset, it is a `dataframe`\n
    `abstract_dict` - dictionary of abstract for lookup
    """

    # FIXME: Use abstract_dict instead

    i = sel.target.index
    print(i)
    sel.annotation.set_text(labels[i])
    abstract = data['objective'][abstract_dict[labels[i]]]
    print("Abstract for project {}: <<{}>>\n\n\n".format(labels[i], abstract))
