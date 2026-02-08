import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { MarketIndex, StockData } from "./market-service";

export interface Alert {
    id: string;
    userId: string;
    symbol: string;
    type: "PRICE_ABOVE" | "PRICE_BELOW" | "PERCENT_CHANGE" | "SENTIMENT_CHANGE" | "VOLUME_SPIKE";
    targetValue: number; // For sentiment: 1=Bullish, -1=Bearish
    initialPrice?: number;
    isActive: boolean;
    createdAt: number;
    lastTriggeredAt?: number;
}

export async function createAlert(alert: Omit<Alert, "id">) {
    try {
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) {
            toast.success("Alert created (Simulation Mode)");
            return;
        }
        await addDoc(collection(db, "alerts"), alert);
        toast.success(`Alert set for ${alert.symbol}`);
    } catch (e) {
        console.error("Error creating alert:", e);
        toast.error("Failed to create alert");
    }
}

export async function getUserAlerts(userId: string): Promise<Alert[]> {
    try {
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) return [];

        const q = query(collection(db, "alerts"), where("userId", "==", userId));
        const snapshot = await getDocs(q);
        const alerts: Alert[] = [];
        snapshot.forEach((doc) => {
            alerts.push({ id: doc.id, ...doc.data() } as Alert);
        });
        return alerts;
    } catch (e) {
        console.warn("fetch alerts error", e);
        return [];
    }
}

export async function deleteAlert(alertId: string) {
    try {
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) return;
        await deleteDoc(doc(db, "alerts", alertId));
        toast.success("Alert deleted");
    } catch (e) {
        toast.error("Failed to delete alert");
    }
}

// Logic to check if any alerts should fire based on new market data
export function checkAlerts(alerts: Alert[], stockData: StockData) {
    alerts.forEach((alert) => {
        if (!alert.isActive || alert.symbol !== stockData.symbol) return;

        let triggered = false;
        let message = "";

        if (alert.type === "PRICE_ABOVE" && stockData.price >= alert.targetValue) {
            triggered = true;
            message = `${alert.symbol} crossed ABOVE $${alert.targetValue}`;
        } else if (alert.type === "PRICE_BELOW" && stockData.price <= alert.targetValue) {
            triggered = true;
            message = `${alert.symbol} dropped BELOW $${alert.targetValue}`;
        } else if (alert.type === "PERCENT_CHANGE" && alert.initialPrice) {
            const percentDiff = ((stockData.price - alert.initialPrice) / alert.initialPrice) * 100;
            if (Math.abs(percentDiff) >= alert.targetValue) {
                triggered = true;
                message = `${alert.symbol} moved ${percentDiff.toFixed(2)}% (Target: ${alert.targetValue}%)`;
            }
        }
        // Volume Spike: If current volume > average * targetValue (multiplier)
        else if (alert.type === "VOLUME_SPIKE") {
            // Mock average volume logic since we don't have historical data easily accessible here
            // In real app, stockData would have avgVolume. Using a rough heuristic or mock for now.
            const avgVol = 1000000;
            // @ts-ignore
            const currentVol = stockData.volume || 0;
            if (currentVol > avgVol * alert.targetValue) {
                triggered = true;
                message = `Unusual Volume Spike detected for ${alert.symbol}`;
            }
        }

        if (triggered) {
            // Check cooldown (e.g. don't spam every second, maybe once per hour or only once)
            const now = Date.now();
            if (!alert.lastTriggeredAt || now - alert.lastTriggeredAt > 3600000) { // 1 hour cooldown
                triggerNotification(alert, message);
            }
        }
    });
}

function triggerNotification(alert: Alert, message: string) {
    // 1. Show Toast
    toast(message, {
        description: `Current Price: Triggered at ${new Date().toLocaleTimeString()}`,
        action: {
            label: "View",
            onClick: () => window.location.href = `/stocks/${alert.symbol}`
        }
    });

    // 2. Update lastTriggeredAt in DB
    try {
        // @ts-ignore
        if (db && Object.keys(db).length > 0) {
            updateDoc(doc(db, "alerts", alert.id), { lastTriggeredAt: Date.now() });
        }
    } catch (e) {
        console.warn("Updated alert trigger timestamp failed", e);
    }
}
