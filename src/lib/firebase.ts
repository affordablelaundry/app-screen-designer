import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, setLogLevel } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Silence internal SDK connection retry notices in console
setLogLevel("error");

// CRITICAL: Specify firestoreDatabaseId with experimentalForceLongPolling to avoid 10-second WebSocket timeout in web/iframe sandbox
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId,
);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = "affordablelaundry424@gmail.com";
