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
    # pass options for the word cloud here
    # print("Generating word cloud...")
    print_progress("Generating word cloud")
    wordcloud = WordCloud(background_color="white",
                          max_words=100).generate(text=text)
    # print("Word cloud generated")
    print_done("Generating word cloud")
    figure, axes = plt.subplots()  # create figure and axes

    # show and image on the figure
    print_progress("Put word cloud on figure")
    axes.imshow(wordcloud, interpolation='bilinear')
    print_done("Put word cloud on figure")

    axes.axis("off")  # remove the axis from the figure

