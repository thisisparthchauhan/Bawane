"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface UserProfile {
    uid: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Safety check if auth is not initialized (e.g. missing env vars)
        if (!auth || !auth.onAuthStateChanged) {
            console.warn("Auth not initialized. Skipping auth listener.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                // Fetch user profile from Firestore
                try {
                    // Check if db is valid
                    if (!db) throw new Error("Firestore not initialized");

                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setProfile(userDoc.data() as UserProfile);
                    } else {
                        console.warn("User authenticated but no profile found in Firestore.");
                        setProfile(null);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setProfile(null);
                }
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await auth.signOut();
        router.push("/login");
    };

    const isAdmin = profile?.role === "admin" || user?.email === "chauhanparth165@gmail.com" || user?.email === "finsol282@gmail.com";

    return (
        <AuthContext.Provider value={{ user, profile, loading, isAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
