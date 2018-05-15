import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAoXqLFngPj5c-Lw2nWc_5so52bTRwJ68E',
  authDomain: 'geo-ninjas-26888.firebaseapp.com',
  databaseURL: 'https://geo-ninjas-26888.firebaseio.com',
  projectId: 'geo-ninjas-26888',
  storageBucket: 'geo-ninjas-26888.appspot.com',
  messagingSenderId: '514018974395'
};
const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore();
