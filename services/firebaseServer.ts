import "server-only";

import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCCSfBzCx3InrnMNtSVknr9VSbBmK7OV20",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "droppii-electrohub.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "droppii-electrohub",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "droppii-electrohub.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "291698700384",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:291698700384:web:43926c1ddc1f6b30935305",
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig, "server");

export const serverDb = getFirestore(firebaseApp);
