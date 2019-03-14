import csv
import math

"""

GET FORECAST DATA ON CORRECT FORMAT (CAP LIMIT)

"""

path = './forecast.txt'

f = open(path)
lines = f.readlines()
print("Done reading file")

counter = 0
with open('./forecast_data_formatted.txt','w') as fil:
    for i in range(0, len(lines)):
        line = lines[i]
        date = line.split(',')[1]
        spots = int(math.floor(float(line.split(',')[2])))
        if (spots > 532):
            spots = 532
        fil.write(date + ','+str(spots) + '\n')


fil.close()
