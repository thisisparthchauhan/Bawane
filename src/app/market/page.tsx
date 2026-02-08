import { Zap, TrendingUp, Globe, Clock } from "lucide-react";

export default function MarketPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    Global Markets
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Live tracking of major global indices, commodities, and forex rates.
                    Real-time data synchronization across all major financial capitals.
                </p>
            </div>

            {/* Market Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Market Status", value: "Open", color: "text-neon-green", icon: Zap },
                    { label: "Global Sentiment", value: "Bullish", color: "text-neon-blue", icon: TrendingUp },
                    { label: "Active Session", value: "London / New York", color: "text-white", icon: Clock },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                    </div>
                ))}
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-2xl border border-white/10 min-h-[400px] flex flex-col justify-center items-center text-center space-y-4">
                    <Globe className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white">Live Charts & Data</h3>
                    <p className="text-gray-400">Advanced interactive charts integration coming soon.</p>
                </div>
                <div className="glass-card p-8 rounded-2xl border border-white/10 min-h-[400px] flex flex-col justify-center items-center text-center space-y-4">
                    <TrendingUp className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white">Top Gainers & Losers</h3>
                    <p className="text-gray-400">Real-time screener integration coming soon.</p>
                </div>
            </div>
        </div>
    );
}
