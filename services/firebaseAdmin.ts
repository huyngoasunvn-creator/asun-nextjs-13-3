import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  projectId: "droppii-electrohub",
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

export const adminDb = getFirestore();