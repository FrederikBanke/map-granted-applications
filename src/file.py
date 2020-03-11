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

import csv
from gensim.models.doc2vec import TaggedDocument, Doc2Vec 

df = pd.read_csv(workdir + "/data/EUFundedProjects_Tables_CSV/Project-2020-02-07.csv")
subDf = df.head(20)
abstracts = subDf['objective']

documents = [TaggedDocument(abstracts[i].split(), [i])  for i in range (len(abstracts))]
model = Doc2Vec(documents, vector_size=100, window=8, min_count=2, workers=7)
print(documents[0])

# Then you can infer new vector and compute most similar documents:
vector = model.infer_vector(['To', 'address', 'the', 'emerging', 'and', 'future', 'challenges', 'in', 'the', 'field', 'of', 'energy', 'as', 'well', 'as', 'to', 'meet', 'the', 'expectations', 'of', 'the', 'Council', 'of', 'the', 'European', 'Union', '(EU),', 'and', 'consequently', 'of', 'the', 'EU', 'Ministries', 'of', 'Defence', '(MoDs),', 'the', 'Consultation', 'Forum', 'for', 'Sustainable', 'Energy', 'in', 'the', 'Defence', 'and', 'Security', 'Sector', '(CF', 'SEDSS)', 'will', 'continue', 'pursuing', 'in', 'Phase', 'III', 'the', 'implementation', 'of', 'the', 'EU', 'legal', 'framework', 'on', 
'energy', 'and', 'will', 'reaffirm', 'the', 'Consultation', 'Forum', 'as', 'an', 'appropriate', 'vehicle', 'for', 'sharing', 'information', 'and', 'best', 'practices', 'on', 'improving', 'energy', 'management,', 'energy', 'efficiency,', 'the', 'use', 'of', 'renewable', 'energy', 'by', 'the', 'defence', 'sector', 'as', 'well', 'increasing', 'the', 'protection', 'and', 'resilience', 'of', 'defence', 'energy-related', 'critical', 'energy', 'infrastructures.', 'Building', 'on', 'the', 'achievements', 'of', 'the', 'previous', 'phases', '(CF', 'SEDSS', 'phase', 'I', 'and', 'II),', 'the', 'European', 'Defence', 'Agency', '(EDA)', 'with', 'the', 'support', 'of', 'the', 'European', 'Commission', '(Directorate', 'General', 'Energy', '-DG', 'ENER', 'and', 'Executive', 'Agency', 'for', 'Small', 'and', 'Medium-sized', 'Enterprises', '-', 'EASME),', 'looks', 'forward', 'to', 'continuing', 'assisting', 'the', 'MoDs', 'to', 'move', 'towards', 'more', 'affordable,', 'greener,', 'sustainable', 'and', 'secure', 'energy', 'models.', 'In', 'this', 
'context,', 'Phase', 'III', 'will', 'contribute', 'in', 'preparing', 'the', 'defence', 'sector', 'to', 'welcome', 'and', 'accommodate', 'new', 'trends', 'in', 'technology', 'and', 'to', 'address', 'challenges', 'ranging', 'from', 'technical', 'and', 'human', 'factors', 'to', 'hybrid', 'threats', 'and', 'other', 'risks.', 'Overall,', 'Phase', 'III', 'is', 'expected', 'to', 'present', 'the', 'defence', 'and', 'security', 'sectors', 'with', 'an', 'economic,', 'operational,', 'and', 'strategic', 'opportunity', 'to', 'reduce', 'reliance', 'on', 'fossil', 'fuel', 'and', 'natural', 'gas,', 'to', 
'progressively', 'minimise', 'energy', 'costs', 'and', 'carbon', 'footprint', 'and', 'to', 'enhance', 'the', 'operational', 'effectiveness', 'and', 'energy', 'resilience', 'of', 'their', 'functions.'])
print(model.docvecs.most_similar([vector]))

