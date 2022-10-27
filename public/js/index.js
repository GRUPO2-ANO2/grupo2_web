// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// Web app's Firebase configuration
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCTx1Z-1z6x6cG4SrBsf7nWb5sUimfF1wg",
  authDomain: "grupo2-6980f.firebaseapp.com",
  databaseURL: "https://grupo2-6980f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "grupo2-6980f",
  storageBucket: "grupo2-6980f.appspot.com",
  messagingSenderId: "320559211112",
  appId: "1:320559211112:web:32eb3d060a84d01bca91dd",
  measurementId: "G-8184SBYGFP"
})
 
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
