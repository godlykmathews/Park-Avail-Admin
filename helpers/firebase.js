// helpers/firebase.js
const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
require('dotenv').config();

const firebaseConfig = {
        apiKey: "AIzaSyB0TQAJtCi08JrF6biggVtz7LMXHV5WDoc",
        authDomain: "parkavailadmin-681f2.firebaseapp.com",
        projectId: "parkavailadmin-681f2",
        storageBucket: "parkavailadmin-681f2.appspot.com",
        messagingSenderId: "906765066703",
        appId: "1:906765066703:web:f2ce46ccfe1b0ac96532ba",
        measurementId: "G-P814QTJCRF"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Export auth object
module.exports = {
    auth: firebase.auth()
};