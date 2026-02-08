"use client";

import { motion } from "framer-motion";
import { WATCHLIST_STOCKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MarketTicker() {
    return (
        <div className="w-full bg-black/50 border-b border-white/5 overflow-hidden py-3">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex gap-12 px-4"
                    animate={{ x: ["0%", "-25%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20,
                    }}
                >
                    {[...WATCHLIST_STOCKS, ...WATCHLIST_STOCKS, ...WATCHLIST_STOCKS, ...WATCHLIST_STOCKS].map((stock, i) => (
                        <div key={`${stock.symbol}-${i}`} className="flex items-center gap-3">
                            <span className="font-bold text-white/80">{stock.symbol}</span>
                            <span className="text-sm font-mono text-white/60">
                                {stock.price.toFixed(2)}
                            </span>
                            <span
                                className={cn(
                                    "text-xs font-medium",
                                    stock.change >= 0 ? "text-neon-green" : "text-red-500"
                                )}
                            >
                                {stock.change >= 0 ? "+" : ""}
                                {stock.change}%
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
