import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBGfp4QZD1n-ONgNM88PVddtbu4s4gKnss",
    authDomain: "uscdining-3f162.firebaseapp.com",
    databaseURL: "https://uscdining-3f162-default-rtdb.firebaseio.com",
    projectId: "uscdining-3f162",
    storageBucket: "uscdining-3f162.appspot.com",
    messagingSenderId: "218974603257",
    appId: "1:218974603257:web:a07a02cc85f283abf75f28",
    measurementId: "G-98P3N003K9"
  };

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
