"""

GET THE LATEST DATA FROM THE API

"""


#!/usr/bin/env python
# make sure to install these packages before running:
# pip install pandas
# pip install sodapy
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import pandas as pd
from sodapy import Socrata
import csv
import datetime

oldTime = (datetime.datetime.now() - datetime.timedelta(days=14)).isoformat()
newTime = (datetime.datetime.now()- datetime.timedelta(days=7)).isoformat()

# Example authenticated client (needed for non-public datasets):
client = Socrata("data.smgov.net", "Ul8sMHNswBDXCzvlAxpqI6x1Q", username="erikkjernlie@ucsb.edu", password="Optipark123")

results = client.get("tce2-7ir6", limit=5000, lot_name="Library", where=("date_time between '{}' and '{}'").format(oldTime, newTime))
results_df = pd.DataFrame.from_records(results)
results_df.to_csv('./api.csv')
df1 = results_df[['available_spaces', 'date_time']]
print(df1)
plt.figure(num=None, figsize=(8, 8), dpi=300)
df1['available_spaces'] = df1['available_spaces'].astype(float)
#df1.loc[df1['available_spaces']].astype(float)
df1.plot(x='date_time', y='available_spaces')
plt.xticks(rotation=15, fontsize=6)
plt.savefig('./live_data',dpi=300, figsize=(8,8), fontsize=10)

#results_df.to_csv('./api.csv', sep='\t')


