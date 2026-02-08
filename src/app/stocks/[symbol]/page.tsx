"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Activity, RefreshCcw, BrainCircuit, Check, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { getStock, StockData } from "@/lib/market-service";
import { StockChart } from "@/components/charts/StockChart";
import { CreateAlertDialog } from "@/components/stocks/CreateAlertDialog";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist-service";

// Mock data generator for graph (still simulated for chart points)
const generateGraphData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        value: 100 + Math.random() * 50 - 25,
    }));
};

export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params);
    const [stock, setStock] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getStock(symbol);
            setStock(data);
            setLoading(false);

            // Check watchlist status
            const present = await isInWatchlist("demo-user", symbol);
            setInWatchlist(present);
        }
        fetchData();
    }, [symbol]);

    const toggleWatchlist = async () => {
        if (!stock) return;
        setWatchlistLoading(true);
        if (inWatchlist) {
            await removeFromWatchlist("demo-user", symbol);
            setInWatchlist(false);
        } else {
            await addToWatchlist("demo-user", symbol, stock.price);
            setInWatchlist(true);
        }
        setWatchlistLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400">Loading Market Data...</p>
                </div>
            </div>
        );
    }

    if (!stock) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center">
                <h1 className="text-2xl font-bold text-white">Stock Not Found</h1>
                <p className="text-gray-400">We couldn't retrieve data for {symbol}</p>
                <Link href="/">
                    <Button variant="outline">Back Home</Button>
                </Link>
            </div>
        );
    }

    const isPositive = stock.change >= 0;
    const chartColor = isPositive ? "#00ff9d" : "#ff3b3b"; // Neon Green or Accent Red

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link
                        href="/"
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-white mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Market
                    </Link>
                    <div className="flex items-end gap-3">
                        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter text-glow">{stock.symbol}</h1>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl md:text-2xl text-gray-500 font-light">{stock.companyName}</span>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <BrainCircuit className="w-3 h-3 text-neon-purple" />
                                <span className="text-xs font-bold text-gray-300">
                                    AI: {stock.percentChange > 1 ? "Bullish" : stock.percentChange < -1 ? "Bearish" : "Neutral"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={toggleWatchlist}
                        disabled={watchlistLoading}
                        className={cn("glass hover:bg-white/10 border-white/10 gap-2 transition-all", inWatchlist && "bg-neon-blue/10 border-neon-blue/50 text-neon-blue")}
                    >
                        {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {inWatchlist ? "In Watchlist" : "Add Watchlist"}
                    </Button>
                    <CreateAlertDialog symbol={stock.symbol} currentPrice={stock.price} />
                    <Button className="bg-neon-blue text-black hover:bg-cyan-400 font-bold px-8 shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all hover:scale-105">
                        Trade Now
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Chart & primary metrics */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Chart Area */}
                    <div className="glass-card p-1 h-[500px] relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="h-full w-full bg-black/40 rounded-xl p-4 md:p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Price Action</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-3xl font-bold text-white">{formatCurrency(stock.price)}</span>
                                        <span className={cn("flex items-center text-sm font-bold px-2 py-0.5 rounded", isPositive ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-500")}>
                                            {isPositive ? "+" : ""}{stock.change} ({stock.percentChange}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                                    {['1D', '1W', '1M', '1Y', 'ALL'].map((period) => (
                                        <button key={period} className="text-xs font-semibold text-gray-500 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 w-full min-h-0">
                                <StockChart data={generateGraphData()} color={chartColor} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Market Cap", value: stock.marketCap },
                            { label: "P/E Ratio", value: stock.peRatio },
                            { label: "Div Yield", value: "0.54%" },
                            { label: "Avg Vol", value: "54.2M" },
                        ].map((stat) => (
                            <div key={stat.label} className="glass-card p-5 text-center hover:-translate-y-1 transition-transform cursor-default">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
                                <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Info & Details */}
                <div className="space-y-6">
                    <div className="glass-card p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-neon-purple" />
                            <h3 className="text-lg font-bold text-white">Market Pulse</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-400 text-sm">Open</span>
                                <span className="text-white font-mono">{formatCurrency(stock.price * 0.98)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-400 text-sm">High</span>
                                <span className="text-white font-mono">{formatCurrency(stock.price * 1.02)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-400 text-sm">Low</span>
                                <span className="text-white font-mono">{formatCurrency(stock.price * 0.97)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-400 text-sm">52W High</span>
                                <span className="text-white font-mono">{formatCurrency(stock.price * 1.5)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="w-32 h-32 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-4 relative z-10">About Company</h3>
                        <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                            {stock.overview}
                        </p>
                        <Button variant="link" className="text-neon-blue p-0 h-auto mt-4 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors relative z-10">
                            View Full Report &rarr;
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
