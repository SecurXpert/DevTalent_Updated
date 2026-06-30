// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk0yU9dZqAyNJvgOuD3fri5_ObFDYyxPk",
  authDomain: "devtalent-69ce1.firebaseapp.com",
  projectId: "devtalent-69ce1",
  storageBucket: "devtalent-69ce1.firebasestorage.app",
  messagingSenderId: "780535166148",
  appId: "1:780535166144:web:1042d1d2d36316bfd28591",
  measurementId: "G-REQWEBY114",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
