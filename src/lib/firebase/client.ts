import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC2oC6TPn6llqTCEDy_J2ce4IcjiQvchRA",
  authDomain: "pantryplus-88853.firebaseapp.com",
  databaseURL: "https://pantryplus-88853-default-rtdb.firebaseio.com",
  projectId: "pantryplus-88853",
  storageBucket: "pantryplus-88853.firebasestorage.app",
  messagingSenderId: "1079604597841",
  appId: "1:1079604597841:web:e79731ff66b1184c5c9470",
  measurementId: "G-6QTE23CWLM"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);