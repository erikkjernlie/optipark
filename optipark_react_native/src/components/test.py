import pyrebase

firebaseconfig = {
    "apiKey": "AIzaSyCz2Lbfoxu59bbPKz5GaWNczSvq_I0Uh_E",
    "authDomain": "optipark-5dfe8.firebaseapp.com",
    "databaseURL": "https://optipark-5dfe8.firebaseio.com",
    "storageBucket": "optipark-5dfe8.appspot.com",
}

# Initialize firebase
firebase = pyrebase.initialize_app(firebaseconfig)
db = firebase.database()

lp = 'PNYEXPS'
found_key = ""

users = db.child("users").get()
users = users.val()
for key in users:
    if(users[key].get('lp') == lp):
        print(users[key])
        users[key]['isParked'] = True
        found_key = key
        db.child("users/"+key).update({'isParked':True})
        break
print(users[found_key])
