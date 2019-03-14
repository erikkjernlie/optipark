import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import pandas as pd
from fbprophet import Prophet
import numpy as np
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()
from datetime import datetime
from fbprophet.diagnostics import cross_validation
from fbprophet.diagnostics import performance_metrics
from fbprophet.plot import plot_cross_validation_metric
import csv
#data["ds"]=pd.todatetime(data["ds"])
#fig = plt.figure(facecolor='w', figsize=(10,6))
#plt.plot(data.ds, data.y)
#plt.draw()
#plt.savefig(...)

"""

FORECASTING + TREND ANALYSIS

"""





"""
df = pd.read_csv('./libraryparking_only_hours.txt')
df["ds"]=pd.to_datetime(df["ds"])
fig = plt.figure(facecolor='w', figsize=(10,6))
plt.scatter(df.ds, df.y, s=1)

print('ds', df.ds[:3])
print('y', df.y[:3])

plt.savefig('./images/raw_data_scatter_dpi300_s=1', dpi=300)

"""

df = pd.read_csv('./dataset_onlyhours/libraryparking_only_hours.txt')
df['cap'] = 532
df['floor'] = 0
# removing some error data
df.loc[(df['ds'] > '2016-08-29') & (df['ds'] < '2016-10-16'), 'y'] = None
df.loc[(df['ds'] > '2017-10-15') & (df['ds'] < '2017-11-29'), 'y'] = None

# holidays 2019
df.loc[(df['ds'] == '2019-01-01'), 'y' ] = None
df.loc[(df['ds'] == '2019-01-21'), 'y' ] = None
df.loc[(df['ds'] == '2019-02-18'), 'y' ] = None
df.loc[(df['ds'] == '2019-05-27'), 'y' ] = None
df.loc[(df['ds'] == '2019-07-04'), 'y' ] = None
df.loc[(df['ds'] == '2019-09-02'), 'y' ] = None
df.loc[(df['ds'] == '2019-10-14'), 'y' ] = None
df.loc[(df['ds'] == '2019-11-11'), 'y' ] = None
df.loc[(df['ds'] == '2019-11-28'), 'y' ] = None
df.loc[(df['ds'] == '2019-11-25'), 'y' ] = None


# holidays 2018
df.loc[(df['ds'] == '2018-01-01'), 'y' ] = None
df.loc[(df['ds'] == '2018-01-15'), 'y' ] = None
df.loc[(df['ds'] == '2018-02-19'), 'y' ] = None
df.loc[(df['ds'] == '2018-05-28'), 'y' ] = None
df.loc[(df['ds'] == '2018-07-04'), 'y' ] = None
df.loc[(df['ds'] == '2018-09-03'), 'y' ] = None
df.loc[(df['ds'] == '2018-10-08'), 'y' ] = None
df.loc[(df['ds'] == '2018-11-11'), 'y' ] = None
df.loc[(df['ds'] == '2018-11-12'), 'y' ] = None
df.loc[(df['ds'] == '2018-11-22'), 'y' ] = None
df.loc[(df['ds'] == '2018-12-25'), 'y' ] = None

# holidays 2017
df.loc[(df['ds'] == '2017-01-01'), 'y' ] = None
df.loc[(df['ds'] == '2017-01-02'), 'y' ] = None
df.loc[(df['ds'] == '2017-01-16'), 'y' ] = None
df.loc[(df['ds'] == '2017-02-20'), 'y' ] = None
df.loc[(df['ds'] == '2017-05-29'), 'y' ] = None
df.loc[(df['ds'] == '2017-07-04'), 'y' ] = None
df.loc[(df['ds'] == '2017-09-04'), 'y' ] = None
df.loc[(df['ds'] == '2017-10-09'), 'y' ] = None
df.loc[(df['ds'] == '2017-11-10'), 'y' ] = None
df.loc[(df['ds'] == '2017-11-11'), 'y' ] = None
df.loc[(df['ds'] == '2017-11-23'), 'y' ] = None
df.loc[(df['ds'] == '2017-12-25'), 'y' ] = None

# holidays 2016
df.loc[(df['ds'] == '2016-01-01'), 'y' ] = None
df.loc[(df['ds'] == '2016-01-18'), 'y' ] = None
df.loc[(df['ds'] == '2016-02-15'), 'y' ] = None
df.loc[(df['ds'] == '2016-05-30'), 'y' ] = None
df.loc[(df['ds'] == '2016-07-04'), 'y' ] = None
df.loc[(df['ds'] == '2016-09-05'), 'y' ] = None
df.loc[(df['ds'] == '2016-10-10'), 'y' ] = None
df.loc[(df['ds'] == '2016-11-11'), 'y' ] = None
df.loc[(df['ds'] == '2016-11-24'), 'y' ] = None
df.loc[(df['ds'] == '2016-12-25'), 'y' ] = None
df.loc[(df['ds'] == '2016-12-26'), 'y' ] = None


# holidays 2015
df.loc[(df['ds'] == '2015-01-01'), 'y' ] = None
df.loc[(df['ds'] == '2015-01-19'), 'y' ] = None
df.loc[(df['ds'] == '2015-02-16'), 'y' ] = None
df.loc[(df['ds'] == '2015-05-25'), 'y' ] = None
df.loc[(df['ds'] == '2015-07-03'), 'y' ] = None
df.loc[(df['ds'] == '2015-07-04'), 'y' ] = None
df.loc[(df['ds'] == '2015-09-07'), 'y' ] = None
df.loc[(df['ds'] == '2015-10-12'), 'y' ] = None
df.loc[(df['ds'] == '2015-11-11'), 'y' ] = None
df.loc[(df['ds'] == '2015-11-26'), 'y' ] = None
df.loc[(df['ds'] == '2015-12-25'), 'y' ] = None

# holidays 2014
df.loc[(df['ds'] == '2014-01-01'), 'y' ] = None
df.loc[(df['ds'] == '2014-01-20'), 'y' ] = None
df.loc[(df['ds'] == '2014-02-17'), 'y' ] = None
df.loc[(df['ds'] == '2014-05-26'), 'y' ] = None
df.loc[(df['ds'] == '2014-07-04'), 'y' ] = None
df.loc[(df['ds'] == '2014-09-01'), 'y' ] = None
df.loc[(df['ds'] == '2014-10-13'), 'y' ] = None
df.loc[(df['ds'] == '2014-11-11'), 'y' ] = None
df.loc[(df['ds'] == '2014-11-27'), 'y' ] = None
df.loc[(df['ds'] == '2014-12-25'), 'y' ] = None


m = Prophet(growth='logistic')
m.fit(df)
"""
future = m.make_future_dataframe(periods=365)
future['cap'] = 532
future['floor'] = 0
"""

"""
THIS CODE IS FOR THE CROSS VALIDATION
#df_cv = cross_validation(m, initial='730 days', period='180 days', horizon = '180 days')
#df_cv['cap'] = 532
#df_cv['floor'] = 0
#print(df_cv.tail())
#df_p = performance_metrics(df_cv)
#df_p.head()
#print(df_cv)
#df_cv.to_csv('./testing.csv', sep='\t')
"""

#ith open('./libraryparking_predicting.txt','w') as fil:
#    fil.write(df_cv)
#fil.close()
#print(future.tail())
"""forecast = m.predict(future)
#print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())
fig1 = m.plot(forecast)
"""
#fig2 = m.plot(training_data)
print(df["y"].mean())
print(df["y"].min())
print(df["y"].max())
df['ds'] = pd.to_datetime(df['ds'], errors='coerce')
fig2 = m.plot(df)

#time = datetime.now().time()
plt.savefig('./dataset_onlyhours/everything', dpi=300)
#fig2 = m.plot_components(forecast)
#plt.savefig('./dataset_everything/all_data_without_outliers_components',dpi=300)

"""
THIS IS FOR PERFORMANCE + CROSS VALIDATION
fig3 = m.plot(df_cv)
plt.savefig('./images/6thOfMarch_everyhour_crossVal_less_data',dpi=300)
fig = plot_cross_validation_metric(df_cv, metric='mape')
plt.savefig('./images/6thOfMarch_everyhour_crossVal_error_predict_everyday_less_data',dpi=300)
"""
"""
plt.figure()
plt.plot(forecast)
#plt.plot(test_data)
plt.title('Forecast')
plt.xlabel('date')
plt.ylabel('number of available parking spots')
plt.show()
"""