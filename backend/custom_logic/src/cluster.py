from sklearn.cluster import KMeans
from sklearn.datasets._samples_generator import make_blobs
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np

mpl.use('TkAgg')

class ClusterObject(object):
    def __init__(self, centers, predicted_cluster):
        self.centers = centers
        self.predicted_cluster = predicted_cluster

def cluster_abstracts(data, n=2):
    """
    Cluster abstracts.

    Parameters
    ----------
    data : The data to cluster.

    n : Number of clusters to create.

    Returns
    -------
    object : 
    """
    # Test set, X is data, y_true is the true cluster labels
    # X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=0)

    # print("X: {}".format(X))

    # print("Shape of data: {}x{}".format(data.shape[0], data.shape[1]))
    # print("data: {}".format(data))

    # this k-means algorithm uses Expectation-Maximization
    kmeans = KMeans(n_clusters=n)
    # computes the clusters
    # print("Data Samples: {}, Features: {}".format(data.shape[0], data.shape[1]))
    # print("Data True number of samples: {}".format(len(data)))
    kmeans.fit(data)
    # predict which cluster the points belong to, can be used for coloring
    y_kmeans = kmeans.predict(data)
    # print("Predicted clusters length: {}".format(len(y_kmeans)))

    # X[:,0] all in column 0. Uses the y_kmeans list to decide color
    # plt.scatter(X[:,0], X[:, 1], s=50, c=y_kmeans, cmap='viridis')

    # fig, ax = plt.subplots()
    
    centers = kmeans.cluster_centers_
    # print("Centers Samples: {}, Features: {}".format(centers.shape[0], centers.shape[1]))
    # print("Centers True number of samples: {}".format(len(centers)))
    # s sets how big the points are
    # ax.scatter(centers[:, 0], centers[:, 1], c='black', s=50, alpha=0.5)
    return ClusterObject(centers=centers, predicted_cluster=y_kmeans)
