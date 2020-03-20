import pandas as pd
import numpy as np
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler # FIXME: måske bruger PCA det, men vi gør ikke
import math
from utils import print_done, print_progress

black = ([np.array([0,0,0])], '#000000') # black
green = ([np.array([0,255,0])], '#00ff00') # green
yellow = ([np.array([255,255,0])], '#ffff00') # yellow
orange = ([np.array([255,153,0])], '#ff9900') # orange
red = ([np.array([255,0,0])], '#ff0000') # red
red_berry = ([np.array([152,0,0])], '#980000') # red berry
blue = ([np.array([0,0,255])], '#0000ff') # blue

def transform_pca(vectors, dimensions = 2):
    """Helper function for PCA. Reduces vector to given dimensions.\n
    Paramters:\n
    `vectors` - the vectors to run PCA on\n
    `dimensions` - how many dimensions the PCA should reduce to

    Returns:\n
    The new reduced vectors
    """
    pca = PCA(n_components=dimensions)  # 3-dimensional PCA. 
    return pd.DataFrame(pca.fit_transform(vectors))


def plot_abstracts(vectors, contributions, three_d=False):
    """Plot a given set of vectors in a smaller plane using PCA.\n
    Paramters:\n
    `vectors` - the vectors to run PCA on\n
    `dimensions` - how many dimensions the PCA should reduce to
    `contributions` - 

    Returns:\n
    The new reduced vectors
    """
    if three_d:
        dimensions = 3
    else:
        dimensions = 2
    print_progress("Run PCA")
    transformed = transform_pca(vectors, dimensions=dimensions)
    print_done("Run PCA")


    # print("All transformed")
    # print(transformed)

    # Splitting the PCA-transformed abstract from the rest of the transformed abstracts
    curAbstractTransformed = transformed[len(transformed)-1:]
    restTransformed = transformed[:len(transformed)-1]

    
    maxCost = max(contributions)
    minCost = min(contributions)
        
    colors = np.empty((0,3))
    for i in range(len(contributions)-1):
        colors = np.append(colors, choose_color(contributions[i], minCost, maxCost), axis=0)
    colors = np.append(colors, blue[0], axis=0)
    # print(colors)

    # Create figure and axis
    fig, ax = plt.subplots()

    # The colors are a tuple, hex values at index 1
    green_patch = mpatches.Patch(color=green[1], label="{}€ - {}€".format(0,int(minCost + ((maxCost-minCost)/5))*1))
    yellow_patch = mpatches.Patch(color=yellow[1], label="{}€ - {}€".format(int(minCost + ((maxCost-minCost)/5))*1, int(minCost + ((maxCost-minCost)/5))*2))
    orange_patch = mpatches.Patch(color=orange[1], label="{}€ - {}€".format(int(minCost + ((maxCost-minCost)/5))*2, int(minCost + ((maxCost-minCost)/5))*3))
    red_patch = mpatches.Patch(color=red[1], label="{}€ - {}€".format(int(minCost + ((maxCost-minCost)/5))*3, int(minCost + ((maxCost-minCost)/5))*4))
    red_berry_patch = mpatches.Patch(color=red_berry[1], label="{}€ - {}€".format(int(minCost + ((maxCost-minCost)/5))*4, int(minCost + ((maxCost-minCost)/5)*5)))
    blue_patch = mpatches.Patch(color=blue[1], label="Your abstract")
    black_patch = mpatches.Patch(color=black[1], label="Funding NaN")

    ax.legend(handles=[green_patch, yellow_patch, orange_patch, red_patch, red_berry_patch, blue_patch, black_patch])

    if three_d:
        # Create 3-dimensional axis
        ax = Axes3D(fig)
        # Plot the 3-dimensional array
        ax.scatter(transformed[0], transformed[1], transformed[2], c=colors/255)
        ax.set_title('3d PCA plot')
        return

    # Plot the 2-dimensional array
    ax.scatter(transformed[0], transformed[1], c=colors/255)
    ax.set_title('2d PCA plot')
    return fig

def choose_color(cost, minCost, maxCost):
    # The colors are a tuple, rgb values at index 0
    if (math.isnan(cost)):
        return black[0]
    diff = maxCost - minCost
    if (cost < minCost + diff/5 ):
        return green[0]
    if (cost < minCost + (diff/5)*2 ):
        return yellow[0]
    if (cost < minCost + (diff/5)*3 ):
        return orange[0]
    if (cost < minCost + (diff/5)*4 ):
        return red[0]
    if (cost <= minCost + (diff/5)*5 ):
        return red_berry[0]
        
