from sklearn.cluster import KMeans
from sklearn.datasets._samples_generator import make_blobs
import matplotlib as mpl
import matplotlib.pyplot as plt

mpl.use('TkAgg')

# Test set, X is data, y_true is the true cluster labels
X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=0)

# this k-means algorithm uses Expectation-Maximization
kmeans = KMeans(n_clusters=4)
# computes the clusters
kmeans.fit(X)
# predict which cluster the points belong to
y_kmeans = kmeans.predict(X)

# X[:,0] all in column 0. Uses the y_kmeans list to decide color
plt.scatter(X[:,0], X[:, 1], s=50, c=y_kmeans, cmap='viridis')

centers = kmeans.cluster_centers_

plt.scatter(centers[:, 0], centers[:, 1], c='black', s=200, alpha=0.5)


plt.show()