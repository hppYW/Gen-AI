import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  async function signup(email, password, displayName) {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please configure Firebase.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
    }

    return userCredential;
  }

  // Sign in with email and password
  function login(email, password) {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please configure Firebase.');
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign in with Google
  async function signInWithGoogle() {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please configure Firebase.');
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // Sign out
  function logout() {
    if (!auth) {
      return Promise.resolve();
    }
    return signOut(auth);
  }

  // Get ID token for API requests
  async function getIdToken() {
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
