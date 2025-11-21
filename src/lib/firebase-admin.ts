import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

// Initialize Firebase Admin
if (!getApps().length) {
  // Check if we have service account credentials
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccount) {
    // Parse the service account JSON from environment variable
    try {
      const serviceAccountKey = JSON.parse(serviceAccount);
      app = initializeApp({
        credential: cert(serviceAccountKey),
      });
    } catch (error) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format');
    }
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Use Application Default Credentials (for production environments like GCP, Vercel, etc.)
    app = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    throw new Error(
      'Firebase Admin initialization failed: Missing FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID'
    );
  }
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export default app;

