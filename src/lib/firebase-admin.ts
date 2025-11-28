import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | null = null;
let db: Firestore | null = null;

// Initialize Firebase Admin (optional - can run without Firebase)
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
      db = getFirestore(app);
      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.warn('⚠️  Firebase Admin initialization failed:', error instanceof Error ? error.message : error);
      console.warn('⚠️  Running in email-only mode (Firebase disabled)');
    }
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Use Application Default Credentials (for production environments like GCP, Vercel, etc.)
    try {
      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      db = getFirestore(app);
      console.log('✅ Firebase Admin initialized with Application Default Credentials');
    } catch (error) {
      console.warn('⚠️  Firebase Admin initialization failed:', error instanceof Error ? error.message : error);
      console.warn('⚠️  Running in email-only mode (Firebase disabled)');
    }
  } else {
    console.warn('⚠️  Firebase credentials not found - running in email-only mode');
    console.warn('⚠️  Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID to enable Firebase');
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export { db };
export default app;

