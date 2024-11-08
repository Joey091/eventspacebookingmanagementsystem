// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1JSSahz4_SlVoxL_Hob0-NgyPPMBXkZg",
  authDomain: "petshop-502fe.firebaseapp.com",
  projectId: "petshop-502fe",
  storageBucket: "petshop-502fe.appspot.com",
  messagingSenderId: "1027030367252",
  appId: "1:1027030367252:web:045ee0a243e8b1eb153b01",
  measurementId: "G-KZXY01YJM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app