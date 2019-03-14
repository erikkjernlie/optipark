import csv

"""

CONVERT DATA FROM API TO PROPHET FORMAT

"""

path = './Parking_Lot_Counts.csv'

f = open(path)
lines = f.readlines()
print("Done reading file")

with open('./libraryparking_everyhalfhour_today.txt','w') as fil:

	numberOfLines = 0
	writeToFile = False
	#file_writer = csv.writer(fil, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
	for index,line in enumerate(lines):


		#if ('01/01/2019 10:00:00 AM,Library,Library parking structure,601 Santa Monica Blvd,90401,34.019,-118.49361,509,' in line):
		#	writeToFile = True
		#	print("startindex",index)
		#if writeToFile:
		if ('Library,Library parking structure' in line):
			lineSplitted = line.split(',')
			dateObject = lineSplitted[0] #01/18/2015 11:45:00 AM
			date = dateObject.split(' ')[0] #01/18/2015
			hours = dateObject.split(' ')[1] #11:45:00
			year = str(date.split('/')[2]) #2015
			month = str(date.split('/')[0]) #18
			day = str(date.split('/')[1]) #01
			timeZone = dateObject.split(' ')[2] #AM
			hour = int(hours.split(':')[0]) #11
			if (timeZone == 'PM' and hour != 12):
				hour += 12
			if (hour == 12 and timeZone == 'AM'):
				hour = '00'
			if len(str(hour)) < 2:
				hour = "0" + str(hour)
			minute = (hours.split(':')[1]) #45
			if (minute == "00" or minute == "30"):
				sec = (hours.split(':')[2]) #00
				numberOfAvailableSpots = (lineSplitted[7])
				sd = year+"-"+month+"-"+day + " " + str(hour)+":"+minute+":"+sec
				numb = str(numberOfAvailableSpots)
				fil.write(sd + ',' + numb + '\n')
			
			#write to file here
		numberOfLines += 1
	fil.close()


	print(numberOfLines)
	