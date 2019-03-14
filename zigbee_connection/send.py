import serial
from datetime import datetime
from pyrebase import pyrebase
from collections import OrderedDict
import random
import json

d=datetime.now()

def asciitohex(word):
    asc = []
    for c in word:
        asc.append((hex(ord(c))))
    return asc

def sumhexlist(l):
    summ = 0
    for i in l:
        summ += int(str(i),10)
    return hex(summ)

def getChecksum(packetWOcs):
    sumlist = packetWOcs[3:]
    s = sumhexlist(sumlist)
    slist = list(s)
    l8bits = slist[len(slist)-2] + slist[len(slist)-1]
    return (255-(int("0x"+str(l8bits),16)))

def fragmentation(longMessage):
    fraglist = []
    n = 100
    fraglist = [longMessage[i:i + n] for i in range(0, len(longMessage), n)]
    return fraglist

def createPacket(message):
    length = len(message)
    if length <= 255:
        basepacket = [0x7e, 0x00, length+5, 0x01, 0x09, 0x00, 0x00, 0x00]

    messagehex = asciitohex(message)
    for m in messagehex:
        basepacket.append(int((m),16))
    cs = getChecksum(basepacket)
    basepacket.append(cs)
    packet = basepacket
    return packet
    


ser = serial.Serial("/dev/ttyUSB0", baudrate=9600) #change the tty if different on your device e.g. /dev/ttyAMA0
#see XCTU's Tx 16bit API Frames Interpreter for payload = ho!
#to construct this byte list: if you change the coordinator address, change it AND the checksum (last byte)
#this assumes that coordinator has address 0000
#packet_list = [0x7e, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x00, 0x68, 0x6f, 0x21,0x05]
#packet = ''.join(chr(x) for x in packet_list)


def fragmentAndSend(message):
    fl = fragmentation(message)
    print("Sending numbers of packets: ", len(fl)+1)
    c=0
    for f in fl:
        c+=1
        packet = createPacket(f)
        print("Sending packet nr ", c, "out of ", len(fl)+1, "packets")
        print(f)
        ser.write(packet)
    finalPacket = createPacket("Last packet")
    ser.write(finalPacket)
    print("Last packet sent, nr", len(fl)+1)
    print("Packets sent")


#d = datetime.now()
#m= "a"*10000
#fragmentAndSend(m)
#print(datetime.now() - d)

db = None

config = {
    "apiKey": "AIzaSyCz2Lbfoxu59bbPKz5GaWNczSvq_I0Uh_E",
    "authDomain": "optipark-5dfe8.firebaseapp.com",
    "databaseURL": "https://optipark-5dfe8.firebaseio.com",
    "projectId": "optipark-5dfe8",
    "storageBucket": "optipark-5dfe8.appspot.com",
    "messagingSenderId": "887530230166"
 }
firebase = pyrebase.initialize_app(config)
db = firebase.database()
def pyrebase(what,db):
    if what == "entrance":
        entranceitems = db.child("images/entrance").get()
        entranceitems = list((entranceitems.val()).items())
        chosen = random.choice(entranceitems)
        lpstr = chosen[1]
        db.child("images/entrance").child(chosen[0]).remove()
        data = {}
        data[chosen[0]] = lpstr
        db.child("images/exit").update(data)
        return lpstr
    if what == "exit":
        exititems = db.child("images/exit").get()
        exititems = list((exititems.val()).items())
        chosen2 = random.choice(exititems)
        lpstr2 = chosen2[1]
        db.child("images/exit").child(chosen2[0]).remove()
        data2 = {}
        data2[chosen2[0]] = lpstr2
        db.child("images/entrance").update(data2)
        return lpstr2
    else:
        print("You wrote something wrong")

def carIncoming(time):
    dist = False, "entrance" #from another function  
    if dist == True:
        licenceplatestring = pyrebase("entrance",db)
        return True, licenceplatestring

def main():

    b = True

    while b:
        dt = datetime.now()
        print("Welcome to the car and camera simulator")
        print("Write either _entrance_ or _exit_")
        print("Write quit to quit")

        i = input()

        if i == "quit":
            break

        lp = pyrebase(i, db)
        fragmentAndSend(lp)
        print(datetime.now()-dt)

        
        

    print(datetime.now()-d)

main()

'''
#testarea
m = db.child("images/entrance/").get()
m = list((m.val()).items())
sendthis =""
for entry in m:
    if entry[0] == "lp2":
        sendthis = entry[1]
print(sendthis,len(sendthis))
fragmentAndSend(sendthis)

i =  input()

m = db.child("images/entrance/").get()
m = list((m.val()).items())
sendthis = ""
for entry in m:
    if entry[0] == "lp":
        sendthis = entry[1]
print(sendthis,len(sendthis))
fragmentAndSend(sendthis)

i = input()

m= db.child("images/entrance/").get()
m = list((m.val()).items())
sendthis3 = ""
for entry in m:
    if entry[0] == "lp3":
        sendthis3 = entry[1]
print(sendthis3, len(sendthis3))
fragmentAndSend(sendthis3)


print(datetime.now() - d)'''


