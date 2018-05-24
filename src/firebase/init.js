import firebase from 'firebase/app';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAoXqLFngPj5c-Lw2nWc_5so52bTRwJ68E',
  authDomain: 'geo-ninjas-26888.firebaseapp.com',
  databaseURL: 'https://geo-ninjas-26888.firebaseio.com',
  projectId: 'geo-ninjas-26888',
  storageBucket: 'geo-ninjas-26888.appspot.com',
  messagingSenderId: '514018974395',
};
const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true });

export default firebaseApp.firestore();
