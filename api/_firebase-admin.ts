import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK once across serverless function invocations
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Replace escaped newlines if passed as single-line string in Vercel environment variables
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : undefined;

  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("[Firebase Admin] Initialized successfully with service account.");
    } catch (err) {
      console.error("[Firebase Admin] Initialization error with service account:", err);
    }
  } else {
    // If running in an environment with Google Application Default Credentials
    try {
      admin.initializeApp();
      console.log("[Firebase Admin] Initialized with application default credentials.");
    } catch (err) {
      console.warn(
        "[Firebase Admin] Service account environment variables missing or incomplete:",
        {
          hasProjectId: !!projectId,
          hasClientEmail: !!clientEmail,
          hasPrivateKey: !!privateKey,
        },
      );
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
