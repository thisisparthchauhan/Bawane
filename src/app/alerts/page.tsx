"use client";

import { useEffect, useState } from "react";
import { Alert, getUserAlerts, deleteAlert } from "@/lib/alert-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Bell, TrendingUp, TrendingDown, Activity, RefreshCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAlerts = async () => {
        setLoading(true);
        // Mock user ID for now
        const data = await getUserAlerts("demo-user");
        setAlerts(data.sort((a, b) => b.createdAt - a.createdAt));
        setLoading(false);
    };

    useEffect(() => {
        loadAlerts();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteAlert(id);
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "PRICE_ABOVE": return "Price Above";
            case "PRICE_BELOW": return "Price Below";
            case "PERCENT_CHANGE": return "% Change";
            case "VOLUME_SPIKE": return "Volume Spike";
            case "SENTIMENT_CHANGE": return "Sentiment Change";
            default: return type;
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "PRICE_ABOVE": return <TrendingUp className="w-4 h-4 text-neon-green" />;
            case "PRICE_BELOW": return <TrendingDown className="w-4 h-4 text-red-500" />;
            case "PERCENT_CHANGE": return <Activity className="w-4 h-4 text-neon-blue" />;
            case "SENTIMENT_CHANGE": return <Bell className="w-4 h-4 text-neon-purple" />;
            default: return <Bell className="w-4 h-4 text-white" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Alerts</h1>
                    <p className="text-gray-400">Manage your active market signal triggers.</p>
                </div>
                <Button variant="outline" onClick={loadAlerts} disabled={loading}>
                    <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : alerts.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Alerts</h3>
                    <p className="text-gray-400 mb-6">Create alerts from any stock detail page to stay ahead.</p>
                    <Link href="/market">
                        <Button variant="neon">Browse Market</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="glass-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-neon-blue/40 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <span className="font-bold text-white text-lg">{alert.symbol}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {getIcon(alert.type)}
                                        <span className="text-sm font-bold text-gray-300">{getTypeLabel(alert.type)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Trigger: <span className="text-white font-mono">
                                            {alert.type.includes("PRICE") ? formatCurrency(alert.targetValue) :
                                                alert.type === "PERCENT_CHANGE" ? `${alert.targetValue}%` :
                                                    alert.type === "SENTIMENT_CHANGE" ? (alert.targetValue === 1 ? "Bullish" : "Bearish") :
                                                        alert.targetValue}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end">
                                <span className={`text-xs px-2 py-1 rounded-full ${alert.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                    {alert.isActive ? "Active" : "Paused"}
                                </span>
                                <div className="text-right mr-4">
                                    <p className="text-[10px] text-gray-500">Created</p>
                                    <p className="text-xs text-gray-400">{new Date(alert.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleDelete(alert.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
