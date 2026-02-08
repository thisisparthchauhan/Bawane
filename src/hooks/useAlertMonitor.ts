"use client";

import { useEffect, useState } from "react";
import { checkAlerts, getUserAlerts } from "@/lib/alert-service";
import { getStock } from "@/lib/market-service"; // We'll just verify specific stocks
import { Alert } from "@/lib/alert-service";

export function useAlertMonitor() {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    // 1. Load alerts on mount
    useEffect(() => {
        // Mock user ID for now
        getUserAlerts("demo-user").then(setAlerts);
    }, []);

    // 2. Poll for price changes
    useEffect(() => {
        if (alerts.length === 0) return;

        const interval = setInterval(async () => {
            // Group alerts by symbol to minimize requests
            const symbols = Array.from(new Set(alerts.map(a => a.symbol)));

            for (const symbol of symbols) {
                try {
                    const stockData = await getStock(symbol);
                    if (stockData) {
                        checkAlerts(alerts, stockData);
                    }
                } catch (e) {
                    console.error("Monitor error", e);
                }
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [alerts]);
}
