import firebase from 'firebase/app';  
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
  
const app = firebase.initializeApp({
    apiKey: "AIzaSyCN7sOpZHdYZwmlYsJGEnpvUBeAD8vqSqI",
    authDomain: "maindb-8acfe.firebaseapp.com",
    projectId: "maindb-8acfe",
    storageBucket: "maindb-8acfe.appspot.com",
    messagingSenderId: "884998404043",
    appId: "1:884998404043:web:5db931fb698f9d6ea7e84e",
    measurementId: "G-VKD6029W8T"
})

export const auth = app.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export default app;
