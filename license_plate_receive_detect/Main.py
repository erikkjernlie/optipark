# Main.py

import cv2
import numpy as np
import os
import json
import DetectChars
import DetectPlates
import PossiblePlate
import base64
import pyrebase
import serial
import datetime
from subprocess import call

# firebase config #################################################################################
firebaseconfig = {
    "apiKey": "AIzaSyCz2Lbfoxu59bbPKz5GaWNczSvq_I0Uh_E",
    "authDomain": "optipark-5dfe8.firebaseapp.com",
    "databaseURL": "https://optipark-5dfe8.firebaseio.com",
    "storageBucket": "optipark-5dfe8.appspot.com",
}

# Initialize firebase
firebase = pyrebase.initialize_app(firebaseconfig)
db = firebase.database()

# module level variables ##########################################################################
SCALAR_BLACK = (0.0, 0.0, 0.0)
SCALAR_WHITE = (255.0, 255.0, 255.0)
SCALAR_YELLOW = (0.0, 255.0, 255.0)
SCALAR_GREEN = (0.0, 255.0, 0.0)
SCALAR_RED = (0.0, 0.0, 255.0)

showSteps = False # Set True if show image processing steps
carCounter = 0 # Global variable carCounter
###################################################################################################

def receive(carCount):
    print("Receiving")
    print("---------------")
    call(["sudo", "python", "recv.py",str(carCount)]) # Subfunction calling another .py file as sudo
    print("Received, continue Main.py")
    
###################################################################################################
def addToFirebase(lp):
    isParked_data = {} #Initialize json
    availableSpaces_data = {}
    available_spaces = db.child("available_spaces").get()
    print(available_spaces.val())
    available_spaces = available_spaces.val()
    all_users = db.child("users").get()
    all_users = all_users.val()
    date_now = str(datetime.datetime.now()).split(".")[0]
    for key in all_users:
        if(all_users[key].get('lp') == lp):
            if (all_users[key]["isParked"]==True):
                available_spaces += 1
                availableSpaces_data[date_now] = available_spaces
                isParked_data["isParked"] = False #Set fields
            else:
                available_spaces -= 1
                availableSpaces_data[date_now] = available_spaces
                isParked_data["isParked"] = True #Set fields
            db.child("users/"+str(key)).update(isParked_data)
            db.child("data").update(availableSpaces_data)
            db.child("available_spaces").set(available_spaces)
            break
###################################################################################################
def decodeString(stringpath):
    stre = "" # inizialize base64string
    with open(stringpath, 'r') as myfile: # open base64 txt-file
        stre=myfile.read().replace('\n', '') # read file
    path = "decoded/decoded_"+str(carCounter)+".jpg" #set path for stores image
    fh = open(path, "wb") #create new file where image will be strored
    try:
        fh.write(base64.b64decode(stre)) # decode base64string to image
    except:
        print("Invalid padding in base64 file") # if base64string has invalid format 
    fh.close() # clsoe file
    return path # return the path of which the image is stored
###################################################################################################
def main():
    print("---------------")
    print("OptiPark start")
    print("---------------")

    #image = cv2.imread("LicPlateImages/2.png")
    blnKNNTrainingSuccessful = DetectChars.loadKNNDataAndTrainKNN()         # attempt KNN training

    if blnKNNTrainingSuccessful == False:                               # if KNN training was not successful
        print("\nerror: KNN traning was not successful\n")  # show error message
        return                                                          # and exit program
    # end if

    while True:
        global carCounter # global variable carCounter
        carCounter = carCounter +1 # increment carCounter
        print("Iteration: "+str(carCounter))
        print("---------------")
        receive(carCounter) # call method receive, which is listening for next license plate
        print("Car number "+str(carCounter))
        imgOriginalScene  = cv2.imread(decodeString("base64strings/base64string"+str(carCounter)+".txt"))    # open image

        if imgOriginalScene is None:                            # if image was not read successfully
            print("\nerror: image not read from file \n\n")  # print error message to std out
            os.system("pause")                                  # pause so user can see error message
                                                          # and exit program
            # end if
        else:
            listOfPossiblePlates = DetectPlates.detectPlatesInScene(imgOriginalScene)           # detect plates

            listOfPossiblePlates = DetectChars.detectCharsInPlates(listOfPossiblePlates)        # detect chars in plates

            #cv2.imshow("imgOriginalScene", imgOriginalScene)            # show scene image

            if len(listOfPossiblePlates) == 0:                          # if no plates were found
                print("\nno license plates were detected\n")  # inform user no plates were found
            else:                                                       # else
                # if we get in here list of possible plates has at leat one plate

                # sort the list of possible plates in DESCENDING order (most number of chars to least number of chars)
                listOfPossiblePlates.sort(key = lambda possiblePlate: len(possiblePlate.strChars), reverse = True)

                # suppose the plate with the most recognized chars (the first plate in sorted by string length descending order) is the actual plate
                licPlate = listOfPossiblePlates[0]

                #cv2.imshow("imgPlate", licPlate.imgPlate)           # show crop of plate and threshold of plate
                #cv2.imshow("imgThresh", licPlate.imgThresh)

                if len(licPlate.strChars) == 0:                     # if no chars were found in the plate
                    print("\nno characters were detected\n\n")  # show message
                    return                                          # and exit program
                # end if

                #drawRedRectangleAroundPlate(imgOriginalScene, licPlate)             # draw red rectangle around plate

                print("\nlicense plate read from image = " + licPlate.strChars + "\n")  # write license plate text to std out
                print("----------------------------------------")
                addToFirebase(licPlate.strChars) # send licenseplate to firebase

                ########## methods for displaying and saving image 
                #writeLicensePlateCharsOnImage(imgOriginalScene, licPlate)           # write license plate text on the image
                #cv2.imshow("imgOriginalScene", imgOriginalScene)                # re-show scene image
                #cv2.imwrite("generatedimages/imgOriginalScene"+str(carCounter)+".png", imgOriginalScene)           # write image out to file
            print("---------------")
            print("")
    # end if else
    #cv2.waitKey(0)					# hold windows open until user presses a key
    return
# end main

###################################################################################################
def drawRedRectangleAroundPlate(imgOriginalScene, licPlate):

    p2fRectPoints = cv2.boxPoints(licPlate.rrLocationOfPlateInScene)            # get 4 vertices of rotated rect

    cv2.line(imgOriginalScene, tuple(p2fRectPoints[0]), tuple(p2fRectPoints[1]), SCALAR_GREEN, 2)         # draw 4 red lines
    cv2.line(imgOriginalScene, tuple(p2fRectPoints[1]), tuple(p2fRectPoints[2]), SCALAR_GREEN, 2)
    cv2.line(imgOriginalScene, tuple(p2fRectPoints[2]), tuple(p2fRectPoints[3]), SCALAR_GREEN, 2)
    cv2.line(imgOriginalScene, tuple(p2fRectPoints[3]), tuple(p2fRectPoints[0]), SCALAR_GREEN, 2)
# end function

###################################################################################################
def writeLicensePlateCharsOnImage(imgOriginalScene, licPlate):
    ptCenterOfTextAreaX = 0                             # this will be the center of the area the text will be written to
    ptCenterOfTextAreaY = 0

    ptLowerLeftTextOriginX = 0                          # this will be the bottom left of the area that the text will be written to
    ptLowerLeftTextOriginY = 0

    sceneHeight, sceneWidth, sceneNumChannels = imgOriginalScene.shape
    plateHeight, plateWidth, plateNumChannels = licPlate.imgPlate.shape

    intFontFace = cv2.FONT_HERSHEY_SIMPLEX                      # choose a plain jane font
    fltFontScale = float(plateHeight) / 30.0                    # base font scale on height of plate area
    intFontThickness = int(round(fltFontScale * 1.5))           # base font thickness on font scale

    textSize, baseline = cv2.getTextSize(licPlate.strChars, intFontFace, fltFontScale, intFontThickness)        # call getTextSize

            # unpack roatated rect into center point, width and height, and angle
    ( (intPlateCenterX, intPlateCenterY), (intPlateWidth, intPlateHeight), fltCorrectionAngleInDeg ) = licPlate.rrLocationOfPlateInScene

    intPlateCenterX = int(intPlateCenterX)              # make sure center is an integer
    intPlateCenterY = int(intPlateCenterY)

    ptCenterOfTextAreaX = int(intPlateCenterX)         # the horizontal location of the text area is the same as the plate

    if intPlateCenterY < (sceneHeight * 0.75):                                                  # if the license plate is in the upper 3/4 of the image
        ptCenterOfTextAreaY = int(round(intPlateCenterY)) + int(round(plateHeight * 1.2))      # write the chars in below the plate
    else:                                                                                       # else if the license plate is in the lower 1/4 of the image
        ptCenterOfTextAreaY = int(round(intPlateCenterY)) - int(round(plateHeight * 1.2))      # write the chars in above the plate
    # end if

    textSizeWidth, textSizeHeight = textSize                # unpack text size width and height

    ptLowerLeftTextOriginX = int(ptCenterOfTextAreaX - (textSizeWidth / 2))           # calculate the lower left origin of the text area
    ptLowerLeftTextOriginY = int(ptCenterOfTextAreaY + (textSizeHeight / 2))          # based on the text area center, width, and height

            # write the text on the image
    cv2.putText(imgOriginalScene, licPlate.strChars, (ptLowerLeftTextOriginX, ptLowerLeftTextOriginY), intFontFace, fltFontScale, SCALAR_RED, intFontThickness)
# end function

###################################################################################################
if __name__ == "__main__":
    carCounter = 0
    main()

















