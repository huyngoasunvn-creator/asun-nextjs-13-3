
import { initializeApp } from "firebase/app";
// Modular Firebase Auth imports correctly from "firebase/auth"
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

/**
 * Cấu hình Firebase thực tế cho dự án Droppii ElectroHub
 */
const firebaseConfig = {
  apiKey: "AIzaSyCCSfBzCx3InrnMNtSVknr9VSbBmK7OV20",
  authDomain: "droppii-electrohub.firebaseapp.com",
  projectId: "droppii-electrohub",
  storageBucket: "droppii-electrohub.firebasestorage.app",
  messagingSenderId: "291698700384",
  appId: "1:291698700384:web:43926c1ddc1f6b30935305",
  measurementId: "G-GJ7C0N3Y16"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore với Local Cache Persistence (Tối ưu Read)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Modular auth initialization
export const auth = getAuth(app);

export default app;
