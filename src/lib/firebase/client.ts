import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCLBEqsEJiDWxVoRD0kcjeGbJGEtil-7yY",
  authDomain: "pantryplus-b207e.firebaseapp.com",
  databaseURL: "https://pantryplus-b207e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pantryplus-b207e",
  storageBucket: "pantryplus-b207e.firebasestorage.app",
  messagingSenderId: "547753572896",
  appId: "1:547753572896:web:8a55c5ced38feab04c5a45",
  measurementId: "G-DN9C2QWLT6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);