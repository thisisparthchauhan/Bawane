"use client";

import { cn } from "@/lib/utils";

interface ResultCardProps {
    label: string;
    value: number | string;
    subtext?: string;
    isPrimary?: boolean;
    currency?: string;
    className?: string;
}

export function ResultCard({
    label,
    value,
    subtext,
    isPrimary = false,
    currency = "₹",
    className
}: ResultCardProps) {
    return (
        <div
            className={cn(
                "p-6 rounded-xl border flex flex-col justify-between h-full transition-all",
                isPrimary
                    ? "bg-teal-950/20 border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.1)]"
                    : "bg-white/5 border-white/10",
                className
            )}
        >
            <span className={cn("text-sm font-medium uppercase tracking-wider", isPrimary ? "text-teal-400" : "text-gray-400")}>
                {label}
            </span>

            <div className="mt-4">
                <div className={cn("text-3xl font-bold tracking-tight", isPrimary ? "text-white" : "text-gray-200")}>
                    {typeof value === 'number'
                        ? (currency ? `${currency} ${value.toLocaleString("en-IN")}` : value.toLocaleString("en-IN"))
                        : value}
                </div>
                {subtext && (
                    <div className="text-xs text-gray-500 mt-1 font-medium">
                        {subtext}
                    </div>
                )}
            </div>
        </div>
    );
}
