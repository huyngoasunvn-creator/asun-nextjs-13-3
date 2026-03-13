import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCSfBzCx3InrnMNtSVknr9VSbBmK7OV20",
  authDomain: "droppii-electrohub.firebaseapp.com",
  projectId: "droppii-electrohub",
  storageBucket: "droppii-electrohub.firebasestorage.app",
  messagingSenderId: "291698700384",
  appId: "1:291698700384:web:43926c1ddc1f6b30935305",
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const auth = getAuth(app);