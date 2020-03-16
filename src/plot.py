import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler # FIXME: måske bruger PCA det, men vi gør ikke


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


# Use principal component analysis to transform the multidimensional array into a 3-dimensional 
def plot_abstracts(vectors, three_d=False):
    """Plot a given set of vectors in a smaller plane using PCA.\n
    Paramters:\n
    `vectors` - the vectors to run PCA on\n
    `dimensions` - how many dimensions the PCA should reduce to

    Returns:\n
    The new reduced vectors
    """
    transformed = transform_pca(vectors, dimensions=3)
    print('Ran PCA on vectors')

    print("All transformed")
    print(transformed)

    # Splitting the PCA-transformed abstract from the rest of the transformed abstracts
    curAbstractTransformed = transformed[len(transformed)-1:]
    restTransformed = transformed[:len(transformed)-1]

    colors = []
    for i in range(len(transformed) - 1):
        colors.append('red')

    colors.append('green')

    # Create figure and axis
    fig, ax = plt.subplots()
    if three_d:
        # Create 3-dimensional axis
        ax = Axes3D(fig)
        # Plot the 3-dimensional array
        # ax.scatter(restTransformed[0], restTransformed[1], restTransformed[2], c='red')
        # ax.scatter(curAbstractTransformed[0], curAbstractTransformed[1], curAbstractTransformed[2], c='green')
        ax.scatter(transformed[0], transformed[1], transformed[2], c=colors)
        ax.set_title('3d PCA plot')
        return

    # Plot the 2-dimensional array
    # ax.scatter(restTransformed[0], restTransformed[1], c='red')
    # ax.scatter(curAbstractTransformed[0], curAbstractTransformed[1], c='green')
    ax.scatter(transformed[0], transformed[1], c=colors)
    ax.set_title('2d PCA plot')