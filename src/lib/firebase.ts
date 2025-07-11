
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firebaseInitializationError: string | null = null;


// Only initialize Firebase if the API key is provided and not the placeholder
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error: any) {
    console.error("Firebase initialization failed:", error);
    // Capture the specific error code from Firebase
    firebaseInitializationError = error.code || 'auth/unknown-error';
  }
} else {
  console.warn("Firebase API key is not configured. Authentication features will be disabled. Please set NEXT_PUBLIC_FIREBASE_API_KEY in your .env file.");
  firebaseInitializationError = 'auth/not-configured';
}

export { app, auth, firebaseInitializationError };
