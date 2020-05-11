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

    # this k-means algorithm uses Expectation-Maximization
    kmeans = KMeans(n_clusters=n)
    # computes the clusters
    kmeans.fit(data)
    # predict which cluster the points belong to, can be used for coloring
    y_kmeans = kmeans.predict(data)
    
    centers = kmeans.cluster_centers_
    return ClusterObject(centers=centers, predicted_cluster=y_kmeans)
