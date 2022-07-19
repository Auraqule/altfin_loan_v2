import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey = process.env.REACT_APP_MY_FIREBASE_API_KEY;
const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
const storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const appId = process.env.REACT_APP_FIREBASE_APP_ID;
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId: "altfin-loan",
  storageBucket,
  messagingSenderId,
  appId,
  measurementId: "G-Q2QK92JP4L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth();
export const get = getDoc;
export const storage = getStorage(app);
