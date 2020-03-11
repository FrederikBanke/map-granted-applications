import numpy as np
import os
import matplotlib as mpl
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

mpl.use('TkAgg')  # Change backend

workdir = os.getcwd()

df = pd.read_csv(
    workdir + "/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv")

subDf = df.head(100)

print(subDf)

# print(df['topics'])

x = subDf['id']
y = subDf['totalCost']

# x = [1, 2, 3, 3, 3]
# y = [1, 2, 3, 4, 1]

def multi_plots():
# figsize sets the windows size
    fig, axs = plt.subplots(1, 3, figsize=(9, 5), sharey=True)
    axs[0].set_title('Bar plot')
    axs[0].bar(x, y)

    axs[1].set_title('Scatter plot')
    axs[1].scatter(x, y)

    axs[2].hist(x)
    axs[2].set_title('Histogram plot')
    axs[2].set_xlabel('x label')
    axs[2].set_ylabel('Frequency')
    fig.suptitle('Categorical Plotting')

def scatter_plot():
    subData = df.head(1000)
    fig2, axs = plt.subplots(1,1) # create new figure
    # uses Seaborn. Pass data, and give names of axes. Hue colors points based on give column
    sns.scatterplot(x='topics', y='ecMaxContribution', data=subData, hue='topics')
    
def histogram_plot():
    subData = df.head(1000)
    fig, axs = plt.subplots(1,1)
    axs.hist(subData['topics'])

# multi_plots()
scatter_plot()
# histogram_plot()

plt.show()
