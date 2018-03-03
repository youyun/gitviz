import csv
import json
import pandas as pd


Q1file=json.load(open("Repoowners.json"))
Q1data = pd.DataFrame.from_dict(Q1file, orient='columns')
Q1data.index += 1
Q1data['all']= Q1data['all']-Q1data['owner']
Q1data.columns=['non','owner']
print (Q1data)


Q1data.to_csv("ProjectdataQ1.csv")



