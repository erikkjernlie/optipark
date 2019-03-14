"""

REMOVE NOISY / ERROR DATA 

"""


import csv


path = './dataset_onlyhours/libraryparking_only_hours.txt'

f = open(path)
lines = f.readlines()
print("Done reading file")

counter = 0
with open('./dataset_onlyhours/removed_outliers.txt','w') as fil:
    fil.write("ds,y\n")
    number = 0
    tempString = ""
    for i in range(1, len(lines)):
        line = lines[i]
        print(line.split(',')[1])
        numberOfSpots = int(line.split(',')[1])
        if numberOfSpots == number:
            print("yes")
            counter += 1
            tempString = tempString + line + "\n"
        else:
            counter = 0
            if (len(tempString) > 0):
                fil.write(tempString)
            fil.write(line)
        number = numberOfSpots
        if (number > 5):
            tempString = ""

fil.close()


    
	