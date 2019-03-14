import * as firebase from 'firebase';
import {config} from './firebaseConfig';

firebase.initializeApp(config);
const databaseRef = firebase.database().ref();


export const auth = firebase.auth();
export const userRef = databaseRef.child("users");
export const geoRef = databaseRef.child("geo");