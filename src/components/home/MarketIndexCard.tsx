import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

interface MarketIndexProps {
    name: string;
    value: number;
    change: number;
}

export function MarketIndexCard({ name, value, change }: MarketIndexProps) {
    const isPositive = change >= 0;

    return (
        <div className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-white/60 text-sm tracking-wide">
                    {name}
                </h3>
                <span
                    className={cn(
                        "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                        isPositive
                            ? "bg-neon-green/10 text-neon-green"
                            : "bg-red-500/10 text-red-500"
                    )}
                >
                    {isPositive ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(change)}%
                </span>
            </div>
            <div>
                <p className="text-2xl font-bold text-white mb-1">
                    {value.toLocaleString()}
                </p>
                <p className="text-xs text-white/40">Real-time Data</p>
            </div>
        </div>
    );
}
