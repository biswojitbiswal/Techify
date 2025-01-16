// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "yoga-4b2cb.firebaseapp.com",
  projectId: "yoga-4b2cb",
  storageBucket: "yoga-4b2cb.appspot.app",
  messagingSenderId: "641072453083",
  appId: "1:641072453083:web:6af62dd0d274568b0943fe",
  measurementId: "G-ZLE9S97E3N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);