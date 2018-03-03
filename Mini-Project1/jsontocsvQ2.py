import csv
import json
import pandas as pd
from pandas.io.json import json_normalize

Q2file=json.load(open("Commenthour.json"))
Q2data = pd.DataFrame.from_dict(Q2file, orient='columns')

Q2data.columns = ['days', 'hour','comments']
Q2data.loc[Q2data['days'] == 0, ['days']] = 'Sun'
Q2data.loc[Q2data['days'] == 1, ['days']] = 'Mon'
Q2data.loc[Q2data['days'] == 2, ['days']] = 'Tue'
Q2data.loc[Q2data['days'] == 3, ['days']] = 'Wed'
Q2data.loc[Q2data['days'] == 4, ['days']] = 'Thurs'
Q2data.loc[Q2data['days'] == 5, ['days']] = 'Fri'
Q2data.loc[Q2data['days'] == 6, ['days']] = 'Sat'
Q2data['hour']=Q2data['hour'].astype(str)+".00 ~ "+(Q2data['hour']+1).astype(str)+".00"



Q2data.to_csv("ProjectdataQ2.csv")





