import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase with safety check
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: any; // Type as any to avoid strict type issues if not using specific analytics types everywhere

try {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'replace_me') {
        console.warn("⚠️ Firebase credentials missing - running in demo mode. Add credentials to .env.local to enable authentication and data features.");
        // Use mock objects when credentials are missing
        app = {} as FirebaseApp;
        auth = {} as Auth;
        db = {} as Firestore;
        storage = {} as FirebaseStorage;
        analytics = {} as any;
    } else {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);

        try {
            storage = getStorage(app);
        } catch (e) {
            console.error("Firebase Storage failed to initialize:", e);
            storage = {} as FirebaseStorage;
        }

        // Initialize Analytics only on client side
        if (typeof window !== "undefined") {
            import("firebase/analytics").then(({ getAnalytics }) => {
                try {
                    analytics = getAnalytics(app);
                } catch (e) {
                    console.error("Firebase Analytics failed to initialize:", e);
                }
            });
        }
    }
} catch (error) {
    console.error("Firebase Initialization Error:", error);
    // Export mock/null objects to prevent build/runtime crash on simple page loads
    // This allows the app to render in a "Read Only" mode if env vars are missing.
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
    storage = {} as FirebaseStorage;
    analytics = {} as any;
}

export { app, auth, db, storage, analytics };
