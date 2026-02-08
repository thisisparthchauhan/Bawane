import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    category: "Global" | "India" | "Commodities" | "Crypto";
    source: string;
    url: string;
    publishedAt: number; // timestamp
    isFeatured: boolean;
}

const NEWS_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function getNews(category?: string): Promise<NewsArticle[]> {
    // Safe check if DB is missing (missing keys)
    // @ts-ignore
    if (!db || Object.keys(db).length === 0) {
        console.warn("Firestore not ready. Using simulated news.");
        // Return mock data directly without saving
        return await seedNewsData(true);
    }

    let q;
    try {
        if (category && category !== "All") {
            q = query(collection(db, "news"), where("category", "==", category), orderBy("publishedAt", "desc"), limit(20));
        } else {
            q = query(collection(db, "news"), orderBy("publishedAt", "desc"), limit(20));
        }

        const snapshot = await getDocs(q);
        let articles: NewsArticle[] = [];
        snapshot.forEach((doc) => {
            articles.push({ id: doc.id, ...doc.data() } as NewsArticle);
        });

        // If empty, seed some mock data for demo
        if (articles.length === 0) {
            return await seedNewsData();
        }

        return articles;
    } catch (e) {
        console.warn("Failed to fetch news:", e);
        return await seedNewsData(true);
    }
}

export async function seedNewsData(simulateOnly = false): Promise<NewsArticle[]> {
    const mockNews: Omit<NewsArticle, "id">[] = [
        {
            title: "Fed Signals Potential Rate Cuts Later This Year",
            summary: "Federal Reserve officials indicated that inflation is moving towards the 2% target, opening the door for rate cuts.",
            category: "Global",
            source: "Bloomberg",
            url: "#",
            publishedAt: Date.now(),
            isFeatured: true,
        },
        {
            title: "NIFTY Hits All-Time High Driven by Tech Rally",
            summary: "Indian benchmark indices soared to new heights as IT stocks led the charge amidst positive global cues.",
            category: "India",
            source: "MoneyControl",
            url: "#",
            publishedAt: Date.now() - 3600000,
            isFeatured: false,
        },
        {
            title: "Gold Prices Surge as Central Banks Increase Reserves",
            summary: "Safe-haven demand pushes gold near record highs as geopolitical tensions persist.",
            category: "Commodities",
            source: "Reuters",
            url: "#",
            publishedAt: Date.now() - 7200000,
            isFeatured: false,
        },
        {
            title: "Bitcoin Halving Event Approaches: What Investors Need to Know",
            summary: "Crypto markets are bracing for volatility as the highly anticipated Bitcoin halving event draws near.",
            category: "Crypto",
            source: "CoinDesk",
            url: "#",
            publishedAt: Date.now() - 10800000,
            isFeatured: true,
        },
    ];

    const created: NewsArticle[] = [];

    if (simulateOnly) {
        return mockNews.map((n, i) => ({ id: `mock-${i}`, ...n }));
    }

    try {
        for (const news of mockNews) {
            const docRef = await addDoc(collection(db, "news"), news);
            created.push({ id: docRef.id, ...news });
        }
    } catch (e) {
        console.warn("Seeding failed (simulation mode):", e);
        return mockNews.map((n, i) => ({ id: `mock-${i}`, ...n }));
    }

    return created;
}

// Admin Functions
export async function createNewsArticle(article: Omit<NewsArticle, "id">) {
    // @ts-ignore
    if (!db || Object.keys(db).length === 0) {
        console.warn("DB not ready, skipping create.");
        return;
    }
    return await addDoc(collection(db, "news"), article);
}

export async function updateNewsArticle(id: string, updates: Partial<NewsArticle>) {
    // @ts-ignore
    if (!db || Object.keys(db).length === 0) return;
    await updateDoc(doc(db, "news", id), updates);
}

export async function deleteNewsArticle(id: string) {
    // @ts-ignore
    if (!db || Object.keys(db).length === 0) return;
    await deleteDoc(doc(db, "news", id));
}
