"use client";

import { useEffect, useState } from "react";
import { getIndices, MarketIndex } from "@/lib/market-service";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function IndicesSection() {
    const [indices, setIndices] = useState<MarketIndex[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getIndices();
                setIndices(data);
            } catch (error) {
                console.error("Failed to load indices", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <section className="py-8 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                        Market Indices
                    </h2>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <RefreshCcw className="w-3 h-3" /> Auto-refreshing
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {indices.map((index, i) => {
                            const isPositive = index.change >= 0;
                            return (
                                <motion.div
                                    key={index.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="p-4 border-white/10 hover:border-white/20 transition-colors group">
                                        <p className="text-xs text-gray-400 font-medium mb-1 truncate">{index.name}</p>
                                        <p className="text-lg font-bold text-white mb-2">{index.value.toLocaleString()}</p>
                                        <div className={cn("flex items-center text-xs font-medium", isPositive ? "text-neon-green" : "text-red-500")}>
                                            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                            {isPositive ? "+" : ""}{index.change} ({isPositive ? "+" : ""}{index.percentChange}%)
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
