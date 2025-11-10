import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  // Check if Firebase config is valid
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_firebase_api_key') {
    console.warn('Firebase is not configured. Authentication and data persistence will not work.');
    console.warn('Please set up Firebase in .env file. See SETUP_GUIDE.md for details.');
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.warn('The app will run without Firebase features.');
}

export { auth, db };
export default app;
