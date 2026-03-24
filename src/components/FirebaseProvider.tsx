import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User, signOut as firebaseSignOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  logout: () => {},
  refreshProfile: async () => {},
  deleteAccount: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (firebaseUser: User) => {
    try {
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        // Create a default profile if it's missing
        const isDefaultAdmin = firebaseUser.email === 'admin@ij.com';
        const nameParts = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : ['Utilisateur', 'Nouveau'];
        const newProfile = {
          uid: firebaseUser.uid,
          firstName: isDefaultAdmin ? 'Admin' : (nameParts[0] || 'Utilisateur'),
          lastName: isDefaultAdmin ? 'Info Jeunes' : (nameParts.slice(1).join(' ') || 'Nouveau'),
          email: firebaseUser.email || 'email@inconnu.fr',
          role: isDefaultAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        };
        
        try {
          await setDoc(docRef, newProfile);
          setProfile(newProfile as UserProfile);
        } catch (setErr) {
          console.error("Error creating missing profile:", setErr);
          // Fallback to local state if Firestore write fails
          setProfile(newProfile as UserProfile);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const deleteAccount = async () => {
    if (user) {
      try {
        // Delete user document from Firestore
        await deleteDoc(doc(db, 'users', user.uid));
        // Delete user from Firebase Auth
        await deleteUser(user);
      } catch (error) {
        console.error("Error deleting account:", error);
        throw error;
      }
    }
  };

  const isAdmin = profile?.role === 'admin' || user?.email === 'admin@ij.com';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, logout, refreshProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

