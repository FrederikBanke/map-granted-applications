import numpy as np
import pandas as pd
from os import path
from PIL import Image
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from utils import print_done, print_progress

mpl.use('TkAgg')


def create_word_cloud(data):
    """
    Parameters:\n
    `data` - The text to make a word cloud of. Can be a `string` or a `list` of strings.
    """
    text = ""
    if type(data) == list:
        text = " ".join(str(doc) for doc in data)
    elif type(data) != str:
        raise TypeError(
            "data should be a string or a list of strings, it was of type {}".format(type(data)))
    print_progress("Generating word cloud")
    # pass options for the word cloud here
    wordcloud = WordCloud(background_color="white",
                          max_words=100)
    # Generate word cloud from text
    # wordcloud.generate(text=text)
    # Generate word cloud from dectionary
    mydict = {
        "cat": 10.0,
        "mouse": 5.0,
        "house": 1.0,
    }
    wordcloud.generate_from_frequencies(mydict)

    print_done("Generating word cloud")
    figure, axes = plt.subplots()  # create figure and axes

    # show and image on the figure
    print_progress("Put word cloud on figure")
    axes.imshow(wordcloud, interpolation='bilinear')
    print_done("Put word cloud on figure")

    axes.axis("off")  # remove the axis from the figure

