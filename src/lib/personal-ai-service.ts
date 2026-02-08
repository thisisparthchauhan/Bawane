import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { getWatchlist } from "./watchlist-service";
import { getUserAlerts } from "./alert-service";

export interface PersonalInsight {
    id?: string;
    userId: string;
    date: string; // YYYY-MM-DD
    summary: string;
    sentiment: "Bullish" | "Bearish" | "Neutral";
    keyMovers: { symbol: string; change: number }[];
    confidenceScore: number; // 0-100
    alertContext?: string; // "3 active alerts triggered"
    generatedAt: number;
}

// In a real app, this would call OpenAI/Gemini. Here we use heuristic logic.
export async function generateDailyInsight(userId: string): Promise<PersonalInsight> {
    try {
        const watchlist = await getWatchlist(userId);
        const alerts = await getUserAlerts(userId);

        let bullishCount = 0;
        let bearishCount = 0;
        let totalChange = 0;
        const movers: { symbol: string; change: number }[] = [];

        watchlist.forEach(item => {
            if (!item.currentData) return;
            const change = item.currentData.percentChange;
            totalChange += change;
            movers.push({ symbol: item.symbol, change });

            if (change > 1) bullishCount++;
            if (change < -1) bearishCount++;
        });

        // Sort movers by absolute change
        movers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
        const keyMovers = movers.slice(0, 3);

        // Determine sentiment
        let sentiment: "Bullish" | "Bearish" | "Neutral" = "Neutral";
        if (bullishCount > bearishCount) sentiment = "Bullish";
        if (bearishCount > bullishCount) sentiment = "Bearish";

        // Generate Summary Text
        let summary = "";
        if (watchlist.length === 0) {
            summary = "Your watchlist is empty. Add stocks to get personalized AI insights.";
            sentiment = "Neutral";
        } else {
            const trend = totalChange > 0 ? "positive" : "negative";
            const leader = keyMovers[0];
            summary = `Your portfolio shows ${sentiment.toLowerCase()} momentum (${totalChange > 0 ? '+' : ''}${totalChange.toFixed(2)}% avg). `;
            if (leader) {
                summary += `${leader.symbol} is the primary driver with a ${leader.change}% move. `;
            }
            if (alerts.length > 0) {
                summary += `You have ${alerts.length} active alerts monitoring levels.`;
            }
        }

        // Create Insight Object
        const insight: PersonalInsight = {
            userId,
            date: new Date().toISOString().split('T')[0],
            summary,
            sentiment,
            keyMovers,
            confidenceScore: 85 + Math.floor(Math.random() * 10), // Mock confidence
            alertContext: `${alerts.length} Active Alerts`,
            generatedAt: Date.now()
        };

        // Save to Firestore (if DB active)
        // @ts-ignore
        if (db && Object.keys(db).length > 0) {
            await addDoc(collection(db, "personal_ai_insights"), insight);
        }

        return insight;

    } catch (e) {
        console.error("AI Gen Error", e);
        return {
            userId,
            date: new Date().toISOString().split('T')[0],
            summary: "AI Engine unavailable. Please check back later.",
            sentiment: "Neutral",
            keyMovers: [],
            confidenceScore: 0,
            generatedAt: Date.now()
        };
    }
}

export async function getLatestInsight(userId: string): Promise<PersonalInsight | null> {
    try {
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) return await generateDailyInsight(userId); // Return fresh if no DB

        const q = query(
            collection(db, "personal_ai_insights"),
            where("userId", "==", userId),
            orderBy("generatedAt", "desc"),
            limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
            return await generateDailyInsight(userId);
        }
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as PersonalInsight;
    } catch (e) {
        // Fallback to generating one on the fly if fetch fails
        return await generateDailyInsight(userId);
    }
}
