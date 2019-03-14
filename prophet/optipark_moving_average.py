import csv

"""

CALCULATE MOVING AVERAGES

"""


path = './removed_outliers.txt'

f = open(path)
lines = f.readlines()
print("Done reading file")
print(len(lines))
print(len(lines)-2)

with open('./removed_outliers_moving_avg.txt','w') as fil:
    fil.write("ds,y\n")
    fil.write(lines[1])
    fil.write(lines[2])
    for i in range(3, len(lines)-3):
        #print("i", i)
        #print(len(lines)-1)
        prevLine = float(lines[i-1].split(',')[1])
        prevLine2 = float(lines[i-2].split(',')[1])
        #print(prevLine)
        thisLine = float(lines[i].split(',')[1])
        #print(thisLine)
        nextLine = float(lines[i+1].split(',')[1])
        nextLine2 = float(lines[i+2].split(',')[1])
        spaces = int((0.5*prevLine2 + 1*prevLine + 3*thisLine + 1*nextLine + 0.5*nextLine2)/6)
        #print(nextLine)
        #print(prevLine, thisLine, nextLine, int((0.5*prevLine+thisLine+0.5*nextLine)/2))
        fil.write(lines[i].split(',')[0] + ',' + str(spaces) + '\n')
    fil.write(lines[len(lines)-2])
    fil.write(lines[len(lines)-1])
fil.close()


    
	