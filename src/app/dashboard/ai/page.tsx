"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, TrendingUp, TrendingDown, Activity, AlertCircle, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLatestInsight, PersonalInsight } from "@/lib/personal-ai-service";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AIPersonalDashboard() {
    const { user } = useAuth();
    const [insight, setInsight] = useState<PersonalInsight | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            // Mock user ID for now if user not loaded
            const uid = user?.uid || "demo-user";
            setLoading(true);
            const data = await getLatestInsight(uid);
            setInsight(data);
            setLoading(false);
        }
        load();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto flex gap-4">
                {[1, 2].map(i => <div key={i} className="flex-1 h-64 bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
        );
    }

    if (!insight) return null;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-neon-purple/20 rounded-lg">
                        <BrainCircuit className="w-6 h-6 text-neon-purple" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Market Intelligence</h1>
                </div>
                <p className="text-gray-400">Personalized AI analysis of your portfolio and watchlists.</p>
            </div>

            {/* Main Insight Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hero Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8 border-l-4 border-l-neon-purple relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <BrainCircuit className="w-48 h-48 text-white" />
                        </div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h2 className="text-sm font-bold text-neon-purple uppercase tracking-widest mb-1">Daily Briefing</h2>
                                <p className="text-xs text-gray-500">{new Date(insight.date).toDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <Shield className="w-3 h-3 text-neon-green" />
                                <span className="text-xs font-bold text-white">{insight.confidenceScore}% Confidence</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-medium text-white leading-relaxed mb-6 relative z-10">
                            "{insight.summary}"
                        </h3>

                        <div className="flex gap-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Outlook:</span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-sm font-bold border",
                                    insight.sentiment === "Bullish" ? "bg-neon-green/10 text-neon-green border-neon-green/20" :
                                        insight.sentiment === "Bearish" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                            "bg-gray-500/10 text-gray-400 border-white/10"
                                )}>
                                    {insight.sentiment}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Context:</span>
                                <span className="text-sm text-white font-medium">{insight.alertContext || "Normal Volatility"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Key Movers Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Key Movers in Your Watchlist</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {insight.keyMovers.map((mover) => (
                                <Link href={`/stocks/${mover.symbol}`} key={mover.symbol}>
                                    <div className="glass-card p-4 hover:bg-white/5 transition-colors group cursor-pointer">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-white">{mover.symbol}</span>
                                            {mover.change >= 0
                                                ? <TrendingUp className="w-4 h-4 text-neon-green" />
                                                : <TrendingDown className="w-4 h-4 text-red-500" />
                                            }
                                        </div>
                                        <div className={cn("text-2xl font-bold", mover.change >= 0 ? "text-neon-green" : "text-red-500")}>
                                            {mover.change > 0 ? "+" : ""}{mover.change.toFixed(2)}%
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to analyze</p>
                                    </div>
                                </Link>
                            ))}
                            {insight.keyMovers.length === 0 && (
                                <div className="col-span-3 text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                    No significant moves detected in your watchlist.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Rail: Alerts & Upgrades */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-neon-blue" />
                            Active Signals
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            You have active alerts monitoring these positions.
                        </p>
                        <Link href="/alerts">
                            <Button variant="outline" className="w-full glass border-white/10 hover:bg-white/10">Manage Alerts</Button>
                        </Link>
                    </div>

                    {/* Placeholder for Layer C (Upgrade CTA) */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-neon-purple/20 to-black border border-neon-purple/30 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 bg-neon-purple/20 w-24 h-24 rounded-full blur-xl" />
                        <Lock className="w-8 h-8 text-neon-purple mb-4" />
                        <h3 className="font-bold text-white mb-2">Unlock Deep Research</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Get analyst-grade reports and early signals with our Pro plan.
                        </p>
                        <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                            Upgrade to Pro
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
