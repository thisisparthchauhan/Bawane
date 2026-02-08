import { db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, getDocs, query, orderBy, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { StockData, getStock } from "./market-service";

export interface WatchlistItem {
    symbol: string;
    addedAt: number;
    priceAtAddition?: number;
}

export interface WatchlistStock extends WatchlistItem {
    currentData?: StockData;
}

const getCollection = (userId: string) => collection(db, `users/${userId}/watchlist`);

export async function addToWatchlist(userId: string, symbol: string, currentPrice?: number) {
    try {
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) {
            toast.success("Added to watchlist (Simulation)");
            return;
        }

        const ref = doc(db, `users/${userId}/watchlist/${symbol}`);
        await setDoc(ref, {
            symbol,
            addedAt: Date.now(),
            priceAtAddition: currentPrice || 0
        });
        toast.success(`${symbol} added to Watchlist`);
    } catch (e) {
        console.error("Add watchlist error", e);
        toast.error("Failed to add to watchlist");
    }
}

export async function removeFromWatchlist(userId: string, symbol: string) {
    try {
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) {
            toast.success("Removed from watchlist (Simulation)");
            return;
        }
        await deleteDoc(doc(db, `users/${userId}/watchlist/${symbol}`));
        toast.success(`${symbol} removed from Watchlist`);
    } catch (e) {
        toast.error("Failed to remove from watchlist");
    }
}

export async function getWatchlist(userId: string): Promise<WatchlistStock[]> {
    try {
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) return [];

        const q = query(getCollection(userId), orderBy("addedAt", "desc"));
        const snapshot = await getDocs(q);

        const items: WatchlistStock[] = [];

        // Parallel fetch of current market data
        const promises = snapshot.docs.map(async (d) => {
            const data = d.data() as WatchlistItem;
            const stockData = await getStock(data.symbol);
            return { ...data, currentData: stockData || undefined };
        });

        const results = await Promise.all(promises);
        return results;
    } catch (e) {
        console.warn("Fetch watchlist error", e);
        return [];
    }
}

export async function isInWatchlist(userId: string, symbol: string): Promise<boolean> {
    try {
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) return false;

        const ref = doc(db, `users/${userId}/watchlist/${symbol}`);
        const snap = await getDoc(ref);
        return snap.exists();
    } catch (e) {
        return false;
    }
}
