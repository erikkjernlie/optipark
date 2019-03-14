import sys
import serial

def main(carCounter):
    ser = serial.Serial("/dev/ttyUSB0", baudrate=9600)
    checksum = last = payload_len = 0
    payload = ""
    framenr=0
    licenceplate = ""
    waiting = True

    print("waiting for packages")
    while waiting:
        data = ser.read()
        #print "Incoming data in ascii: ", data, " and in decimal: ", ord(data)
    
        if data == "~": #new frame
            framenr+=1
            print("New frame received ", framenr)
            if checksum != 0:
                cs = hex(checksum)[-2:] #last two must be ff
                assert cs == 'ff'
            checksum = last = 0

            #frame and payload length
            #frame length is API id + API frame id + dst + opt + payload
            firstLen = ser.read()
            frame_len = "{:02x}".format(ord(firstLen)) #convert length to hex
            secondLen = ser.read()
            frame_len += "{:02x}".format(ord(secondLen)) #convert length to hex
            frame_len = int(frame_len,16) #in decimal
            payload_len = frame_len-5
            #print("Payload length is: ", payload_len)
            #3 reads have been done, we now read API id and API frame id
            apiid = ser.read()
            apiframeid = ser.read()
            #5 reads have been done, we read destination
            dst = ser.read()
            junk = ser.read()
            j = ser.read()

            #get payload:
            lastm = ""
            for i in range(0,payload_len):
                lm = ser.read()
                payload += lm
                lastm += lm
                if "Last packet" in lastm:
                    payload = payload.replace("Last packet","")
                    payload = payload.replace(" ", "")
                    licenceplate = payload
                    print("length", len(payload))
                
                    lastm = ""
                    framenr = 0
                    #print("Last packet from licenceplate received")
                    filetxt = open("base64strings/base64string"+str(carCounter)+".txt","wb")
                    filetxt.write(payload)
                    filetxt.close()
	            payload = ""
                    waiting = False
            cs = ser.read()


if __name__ == '__main__':
    main(int(sys.argv[1]))
