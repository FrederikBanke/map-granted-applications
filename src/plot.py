import pandas as pd
import numpy as np
import matplotlib as mpl
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from sklearn.decomposition import PCA
# FIXME: måske bruger PCA det, men vi gør ikke
from sklearn.preprocessing import StandardScaler
import math
from utils import print_done, print_progress

black = ([np.array([0, 0, 0])], '#000000')  # black
green = ([np.array([0, 255, 0])], '#00ff00')  # green
yellow = ([np.array([255, 255, 0])], '#ffff00')  # yellow
orange = ([np.array([255, 153, 0])], '#ff9900')  # orange
red = ([np.array([255, 0, 0])], '#ff0000')  # red
red_berry = ([np.array([152, 0, 0])], '#980000')  # red berry
blue = ([np.array([0, 0, 255])], '#0000ff')  # blue


def transform_pca(vectors, dimensions=2):
    """Helper function for PCA. Reduces vector to given dimensions.\n
    Paramters:\n
    `vectors` - the vectors to run PCA on\n
    `dimensions` - how many dimensions the PCA should reduce to

    Returns:\n
    The new reduced vectors
    """
    pca = PCA(n_components=dimensions)  # n-dimensional PCA.
    return pd.DataFrame(pca.fit_transform(vectors))


def plot_abstracts(vectors, contributions, three_d=False):
    """Plot a given set of vectors in a smaller plane using PCA.\n
    Paramters:\n
    `vectors` - the vectors to run PCA on\n
    `dimensions` - how many dimensions the PCA should reduce to
    `contributions` - 

    Returns:\n
    The figure with the new reduced vectors
    """
    if three_d:
        dimensions = 3
    else:
        dimensions = 2
    print_progress("Run PCA")
    transformed = transform_pca(vectors, dimensions=dimensions)
    print_done("Run PCA")
    # print("plot_abstracts | Data Samples: {}, Features: {}".format(transformed.shape[0], transformed.shape[1]))

    # Splitting the PCA-transformed abstract from the rest of the transformed abstracts
    curAbstractTransformed = transformed[len(transformed)-1:]
    restTransformed = transformed[:len(transformed)-1]

    # find the higest and lowest contribution in the list
    maxCost = max(contributions)
    minCost = min(contributions)

    # Go through each contribution, give it a fitting color and add it to the list of colors
    colors = np.empty((0, 3))
    for i in range(len(contributions)-1):
        colors = np.append(colors, choose_color(
            contributions[i], minCost, maxCost), axis=0)
    colors = np.append(colors, blue[0], axis=0)

    # Create figure and axis
    fig, ax = plt.subplots()

    # The colors are a tuple, hex values at index 1
    green_patch = mpatches.Patch(
        color=green[1], label="{}€ - {}€".format(0, int(minCost + ((maxCost-minCost)/5))*1))
    yellow_patch = mpatches.Patch(color=yellow[1], label="{}€ - {}€".format(
        int(minCost + ((maxCost-minCost)/5))*1, int(minCost + ((maxCost-minCost)/5))*2))
    orange_patch = mpatches.Patch(color=orange[1], label="{}€ - {}€".format(
        int(minCost + ((maxCost-minCost)/5))*2, int(minCost + ((maxCost-minCost)/5))*3))
    red_patch = mpatches.Patch(color=red[1], label="{}€ - {}€".format(
        int(minCost + ((maxCost-minCost)/5))*3, int(minCost + ((maxCost-minCost)/5))*4))
    red_berry_patch = mpatches.Patch(color=red_berry[1], label="{}€ - {}€".format(
        int(minCost + ((maxCost-minCost)/5))*4, int(minCost + ((maxCost-minCost)/5)*5)))
    blue_patch = mpatches.Patch(color=blue[1], label="Your abstract")
    black_patch = mpatches.Patch(color=black[1], label="Funding NaN")

    ax.legend(handles=[green_patch, yellow_patch, orange_patch,
                       red_patch, red_berry_patch, blue_patch, black_patch])

    if three_d:
        # Create 3-dimensional axis
        ax = Axes3D(fig)
        # Plot the 3-dimensional array
        ax.scatter(transformed[0], transformed[1],
                   transformed[2], c=colors/255)
        ax.set_title('3d PCA plot')
        return fig

    # Plot the 2-dimensional array
    ax.scatter(transformed[0], transformed[1], c=colors/255)
    ax.set_title('2d PCA plot')
    return fig


def plot_scatter(data, axis=None, dimensions=2, title="Scatter plot", color='blue', cmap=None):
    """
    Plots data to scatter. It will run PCA if dimensions are larger than 2 or 3

    Parameters
    ----------
    data : The data to plot.

    Returns
    -------
    (fig, ax) : A tuple containing the figure and the axes
    """
    print("before plot_scatter | Data Samples: {}, Features: {}".format(
        data.shape[0], data.shape[1]))
    if data.shape[1] > dimensions:
        print_progress("Run PCA")
        data = transform_pca(data, dimensions=dimensions)
        print_done("Run PCA")
    print("after plot_scatter | Data Samples: {}, Features: {}".format(
        data.shape[0], data.shape[1]))

    if axis == None:
        # Create figure and axis if not given
        fig, ax = plt.subplots()
    else:
        fig, ax = (axis.get_figure(), axis)

    if dimensions > 2:
        # Create 3-dimensional axis
        if axis == None:
            ax = Axes3D(fig)
        # Plot the 3-dimensional array
        ax.scatter(data[0], data[1], data[2], c=color, cmap=cmap)
        ax.set_title(title + " - 3d")
        return (fig, ax)
    if dimensions == 2:
        # Plot the 2-dimensional array
        ax.scatter(data[0], data[1], c=color, cmap=cmap)
        ax.set_title(title + " - 2d")
        return (fig, ax)
    if dimensions == 1:
        # Plot the 1-dimensional array
        ax.eventplot(data[0], orientation='horizontal', colors='red')
        ax.axis('off')
        ax.set_title(title + " - 1d")
        return (fig, ax)


def choose_color(cost, minCost, maxCost):
    '''
    Choose a color based on the the contribution. The colors are split in 5 intervals between minCost and maxCost
    '''
    # The colors are a tuple, rgb values at index 0
    if (math.isnan(cost)):
        return black[0]
    # print("min {} max {}".format(minCost, maxCost))
    diff = maxCost - minCost
    if (cost < minCost + diff/5):
        return green[0]
    if (cost < minCost + (diff/5)*2):
        return yellow[0]
    if (cost < minCost + (diff/5)*3):
        return orange[0]
    if (cost < minCost + (diff/5)*4):
        return red[0]
    if (cost <= round(minCost + diff, 2)):
        return red_berry[0]
    print("Cost: {}    max: {}    diff: {}".format(
        cost, maxCost, round(minCost + diff, 2)))
    print("NO COLOR CHOSEN")


def create_plot(figure=None):
    """
    Creates a new plot by creating a new figure with matplotlib and an axes for that figure.\n
    If a figure is given to the function call, a new axes will be added to that figure instead.

    Parameters
    ----------
    figure : Default is `None`. If a figure is given, this function will add an axes to that figure, instead of making a new one.

    Returns
    -------
    `tuple` : A tuple containing the figure and axes
    """
    # Only here so we get intellisense
    axes = plt.Axes
    fig = plt.Figure

    # Create figure and axis if not given a figure
    if figure == None:
        fig, ax = plt.subplots()
    else:
        fig = figure
        ax = fig.add_axes(axes)
    return (fig, ax)


def scatter_plot(x, y, axes, z=None, color=None, cmap='viridis', title="Scatter plot"):
    if len(x) != len(y):
        raise ValueError("x and y are not of the same length")
    if color == None:
        color = list(range(0, len(x)))

    if z == None:
        axes.scatter(x, y, c=color, cmap=cmap)
        axes.set_title(title + " - 2d")
    else:
        if len(x) != len(z):
            raise ValueError("z is not the same length as x and y")
        # Create 3-dimensional axis
        axes = Axes3D(axes.get_figure())
        axes.scatter(x, y, z, c=color, cmap=cmap)
        axes.set_title(title + " - 3d")



