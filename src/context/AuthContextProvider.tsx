import { createContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../firebase";

import { getFirestore } from "firebase/firestore";

const db = getFirestore();
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  username: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // 🔹 Fetch username from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().name);
        }
      } else {
        setCurrentUser(null);
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser, username }}>
    {children}
  </AuthContext.Provider>;
};
