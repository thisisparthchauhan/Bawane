"use client";

import { motion } from "framer-motion";
import { WATCHLIST_STOCKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getStock } from "@/lib/market-service";

export function TopBar() {
    // State to hold the live data for watchlist stocks
    const [stocks, setStocks] = useState<any[]>([]);

    useEffect(() => {
        async function fetchWatchlist() {
            // Get unique symbols from the constant
            const symbols = WATCHLIST_STOCKS.map(s => s.symbol);

            // Fetch data for each symbol
            const promises = symbols.map(symbol => getStock(symbol));
            const results = await Promise.all(promises);

            // Filter out nulls and format for display
            const validStocks = results
                .filter((s): s is NonNullable<typeof s> => s !== null)
                .map(s => ({
                    symbol: s.symbol,
                    price: s.price,
                    change: s.percentChange // Using percentChange for the display as per original design
                }));

            setStocks(validStocks);
        }

        fetchWatchlist();
        // Optional: Set up an interval to refresh
        const interval = setInterval(fetchWatchlist, 60000); // 1 minute
        return () => clearInterval(interval);
    }, []);

    // Use live stocks if available, otherwise fall back to static list (or empty to prevent hydration mismatch if needed, but static is safer for immediate render)
    // Actually, let's start with static and replace with live to avoid layout shift, but for marquee it might be okay.
    const displayStocks = stocks.length > 0 ? stocks : WATCHLIST_STOCKS;

    // Duplicate list for smooth infinite scroll
    const marqueeStocks = [...displayStocks, ...displayStocks, ...displayStocks, ...displayStocks];

    return (
        <div className="fixed top-16 inset-x-0 z-[90] bg-black border-b border-white/10 h-8 flex items-center overflow-hidden">
            <div className="flex whitespace-nowrap w-full">
                <motion.div
                    className="flex gap-8 px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Adjust speec based on length if needed
                    }}
                >
                    {marqueeStocks.map((stock, i) => (
                        <div key={`${stock.symbol}-${i}`} className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-white/90">{stock.symbol}</span>
                            <span className="font-mono text-white/70">
                                {stock.price.toFixed(2)}
                            </span>
                            <span
                                className={cn(
                                    "font-medium",
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
