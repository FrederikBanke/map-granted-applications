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

fig2, axs = plt.subplots(1,1) # create new figure

sns.scatterplot(x='totalCost', y='ecMaxContribution', data=subDf, hue='topics')

plt.show()
