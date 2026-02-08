"use client";

import { useEffect, useState } from "react";
import { getLatestSentiment, MarketSentiment } from "@/lib/sentiment-service";
import { Sparkles, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SentimentBanner() {
    const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            const data = await getLatestSentiment();
            if (data && data.isVisible) setSentiment(data);
            setLoading(false);
        }
        fetch();
    }, []);

    if (loading || !sentiment) return null;

    const isBullish = sentiment.label === "Bullish";
    const isBearish = sentiment.label === "Bearish";
    const colorClass = isBullish ? "text-neon-green" : isBearish ? "text-red-500" : "text-gray-400";
    const bgClass = isBullish ? "border-neon-green/20" : isBearish ? "border-red-500/20" : "border-white/10";
    const Icon = isBullish ? TrendingUp : isBearish ? TrendingDown : Minus;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={cn("glass-card p-1 relative overflow-hidden", bgClass)}
            >
                {/* Animated shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                <div className="backdrop-blur-md rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="flex items-start gap-4 flex-1">
                        <div className={cn("p-3 rounded-xl bg-black/50 border border-white/10 shadow-lg", colorClass)}>
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    AI Daily Insight
                                    <span className="text-xs font-normal text-gray-500 px-2 py-0.5 rounded-full border border-white/10">
                                        {new Date(sentiment.date).toLocaleDateString()}
                                    </span>
                                </h3>
                            </div>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                {sentiment.summary}
                            </p>
                        </div>
                    </div>

                    {/* Score Gauge */}
                    <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                        <div className="text-right hidden md:block">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Confidence</p>
                            <p className="text-white font-mono font-bold">{sentiment.score}/100</p>
                        </div>

                        <div className={cn("hidden md:flex flex-col items-center justify-center w-24 h-16 rounded-lg border", isBullish ? "border-neon-green/20" : isBearish ? "border-red-500/20" : "border-white/10")}>
                            <Icon className={cn("w-6 h-6 mb-1", colorClass)} />
                            <span className={cn("text-xs font-bold uppercase tracking-widest", colorClass)}>
                                {sentiment.label}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
