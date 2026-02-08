import { db, storage } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export interface Report {
    id?: string;
    headline: string;
    category: "Research" | "Financial";
    pdfUrl: string;
    isVisible: boolean;
    createdAt: number;
    year?: string; // e.g. "2024"
    quarter?: string; // e.g. "Q1"
}

const REPORTS_COLLECTION = "reports";

// Upload PDF to Firebase Storage
export const uploadReportPDF = async (file: File): Promise<string> => {
    if (!storage) throw new Error("Storage not initialized");

    const storageRef = ref(storage, `reports/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

// Add new report to Firestore
export const addReport = async (report: Omit<Report, "id" | "createdAt">) => {
    if (!db) throw new Error("Firestore not initialized");

    return await addDoc(collection(db, REPORTS_COLLECTION), {
        ...report,
        createdAt: Date.now(),
        isVisible: true, // Default to visible or let admin decide
    });
};

// Get all reports (for Admin)
export const getAllReports = async (): Promise<Report[]> => {
    if (!db) return [];

    const q = query(collection(db, REPORTS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
};

// Get published reports by category (for User)
export const getPublishedReports = async (category: "Research" | "Financial"): Promise<Report[]> => {
    if (!db) return [];

    const q = query(
        collection(db, REPORTS_COLLECTION),
        where("category", "==", category),
        where("isVisible", "==", true),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
};

// Toggle report visibility
export const toggleReportVisibility = async (id: string, currentStatus: boolean) => {
    if (!db) return;
    const reportRef = doc(db, REPORTS_COLLECTION, id);
    await updateDoc(reportRef, { isVisible: !currentStatus });
};

// Delete report
export const deleteReport = async (id: string, pdfUrl: string) => {
    if (!db || !storage) return;

    // 1. Delete from Firestore
    await deleteDoc(doc(db, REPORTS_COLLECTION, id));

    // 2. Delete PDF from Storage
    try {
        const fileRef = ref(storage, pdfUrl);
        await deleteObject(fileRef);
    } catch (error) {
        console.warn("Error deleting file from storage:", error);
    }
};
