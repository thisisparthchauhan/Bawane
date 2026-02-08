import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, query, orderBy, limit, where, getDoc } from "firebase/firestore";
import { getIndices, MarketIndex } from "./market-service";
import { getNews, NewsArticle } from "./news-service";

export interface MarketSentiment {
    id: string; // YYYY-MM-DD
    date: string;
    score: number; // 0 to 100
    label: "Bullish" | "Bearish" | "Neutral";
    summary: string;
    generatedAt: number;
    factors: string[];
    isVisible: boolean;
}

export async function getLatestSentiment(): Promise<MarketSentiment | null> {
    try {
        // Safe check for DB
        // @ts-ignore
        if (!db || Object.keys(db).length === 0) {
            return generateMockSentiment();
        }

        const q = query(collection(db, "market_sentiment"), orderBy("generatedAt", "desc"), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return snapshot.docs[0].data() as MarketSentiment;
        }
        return null;
    } catch (e) {
        console.warn("Failed to fetch sentiment:", e);
        return generateMockSentiment();
    }
}

export async function generateDailySentiment(): Promise<MarketSentiment> {
    // 1. Fetch Data
    const indices = await getIndices();
    const news = await getNews("Global"); // Focus on global sentiment

    // 2. Analyze Indices (Quantitative)
    let indexScore = 50;
    const indexFactors: string[] = [];

    // Calculate average % change
    const avgChange = indices.reduce((sum, idx) => sum + idx.percentChange, 0) / (indices.length || 1);

    // Logic: Every 0.1% change adds/subtracts 2 points
    indexScore += avgChange * 20;

    // Cap at 0-100
    indexScore = Math.max(0, Math.min(100, indexScore));

    if (Math.abs(avgChange) > 0.5) {
        indexFactors.push(`Global Markets ${avgChange > 0 ? "Up" : "Down"} ${Math.abs(avgChange).toFixed(2)}% avg`);
    }

    // 3. Analyze News (Qualitative - Basic NLP simulation)
    let newsScore = 50;
    const newsFactors: string[] = [];

    const bullWords = ["rise", "soar", "gain", "profit", "growth", "cut", "rally", "record"]; // "cut" as in rate cut
    const bearWords = ["fall", "drop", "loss", "crash", "slump", "inflation", "war", "crisis"];

    let bullCount = 0;
    let bearCount = 0;

    news.forEach(article => {
        const text = (article.title + " " + article.summary).toLowerCase();
        bullWords.forEach(w => { if (text.includes(w)) bullCount++; });
        bearWords.forEach(w => { if (text.includes(w)) bearCount++; });
    });

    if (bullCount > bearCount) {
        newsScore += 15;
        newsFactors.push("Positive Media Coverage");
    } else if (bearCount > bullCount) {
        newsScore -= 15;
        newsFactors.push("Negative Macro Headlines");
    }

    // 4. Combine Scores (60% Data, 40% News)
    const finalScore = Math.round((indexScore * 0.6) + (newsScore * 0.4));

    let label: MarketSentiment["label"] = "Neutral";
    if (finalScore >= 60) label = "Bullish";
    if (finalScore <= 40) label = "Bearish";

    // 5. Generate Summary
    let summary = "";
    if (label === "Bullish") {
        summary = `Markets are showing strong bullish momentum driven by ${(avgChange > 0.5) ? "robust index gains" : "positive sentiment"} and ${bullCount > 0 ? "favorable news cycles" : "stable macro conditions"}. Tech and Growth sectors likely to outperform.`;
    } else if (label === "Bearish") {
        summary = `Bearish sentiment dominates as global indices face pressure${bearCount > 0 ? " amidst negative headlines" : ""}. Investors are advising caution and shifting towards defensive assets.`;
    } else {
        summary = "Markets remain choppy with no clear direction. Mixed signals from global indices and news suggest a consolidation phase before the next major move.";
    }

    const sentiment: MarketSentiment = {
        id: new Date().toISOString().split('T')[0],
        date: new Date().toISOString(),
        score: finalScore,
        label,
        summary,
        generatedAt: Date.now(),
        factors: [...indexFactors, ...newsFactors],
        isVisible: true
    };

    // 6. Save to DB
    try {
        // @ts-ignore
        if (db && Object.keys(db).length > 0) {
            await setDoc(doc(db, "market_sentiment", sentiment.id), sentiment);
        }
    } catch (e) {
        console.warn("Failed to save sentiment:", e);
    }

    return sentiment;
}

function generateMockSentiment(): MarketSentiment {
    return {
        id: "mock",
        date: new Date().toISOString(),
        score: 72,
        label: "Bullish",
        summary: "AI Assessment: Markets are showing bullish momentum. Simulating high confidence due to missing live database connection.",
        generatedAt: Date.now(),
        factors: ["Simulation Mode Active", "Tech Sector Rally"],
        isVisible: true
    };
}
