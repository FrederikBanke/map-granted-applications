import numpy as np
import os
import matplotlib as mpl
import matplotlib.pyplot as plt
import pandas as pd

mpl.use('TkAgg') # Change backend

workdir = os.getcwd()

# Copied code from internet
# def scatterplot(x_data, y_data, x_label="", y_label="", title="", color="r", yscale_log=False):

    # Create the plot object
    # _, ax = plt.subplots()

    # Plot the data, set the size (s), color and transparency (alpha)
    # of the points
    # ax.scatter(x_data, y_data, s=10, color=color, alpha=0.75)

    # if yscale_log == True:
        # ax.set_yscale('log')

    # Label the axes and provide a title
    # ax.set_title(title)
    # ax.set_xlabel(x_label)
    # ax.set_ylabel(y_label)


# scatterplot([1, 2, 3], [4, 5, 6], "x axis name", "y axis name", "graph title")

print(workdir)
df = pd.read_csv(workdir + "/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv")

subDf = df.head(5)

print(subDf)

# print(df['topics'])

x = subDf['id']
y = subDf['totalCost']
abstracts = subDf['objective']
print(abstracts[0])

#x=[1,2,3,3]
#y=[1,2,3,4]

fig, axs = plt.subplots(1, 3, figsize=(9, 3), sharey=True)
axs[0].bar(x, y)
axs[1].scatter(x, y)
axs[2].plot(x, y)
fig.suptitle('Categorical Plotting')


plt.scatter(x, y)

plt.show()
