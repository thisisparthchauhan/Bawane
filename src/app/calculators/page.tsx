"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, BarChart3, PieChart, Coins } from "lucide-react";
import { motion } from "framer-motion";

const CALCULATORS = [
    {
        title: "SIP Calculator",
        description: "Calculate how much you need to save or how much you will accumulate with your Systematic Investment Plan.",
        icon: TrendingUp,
        href: "/calculators/sip",
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/20"
    },
    {
        title: "SWP Calculator",
        description: "Plan your systematic withdrawals. Calculate your final corpus after regular monthly withdrawals.",
        icon: Coins,
        href: "/calculators/swp",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20"
    },
    {
        title: "Brokerage Calculator",
        description: "Calculate net profit and loss after deducting brokerage, taxes and other charges for Equity Intraday & Delivery.",
        icon: BarChart3,
        href: "/calculators/brokerage",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20"
    },
    {
        title: "Margin Calculator",
        description: "Calculate the margin required for your trades and understand your leverage exposure.",
        icon: PieChart,
        href: "/calculators/margin",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20"
    }
];

export default function CalculatorsPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-5xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                        Financial Tools
                    </h1>
                    <p className="text-xl text-gray-400 font-light">
                        Plan your investments, analyze your trades, and optimize your strategy with our institutional-grade calculators.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {CALCULATORS.map((calc, i) => (
                        <Link href={calc.href} key={calc.title} className="group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`h-full p-8 rounded-2xl border bg-white/5 transition-all duration-300 hover:bg-white/10 hover:translate-y-[-5px] ${calc.border}`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-xl ${calc.bg} ${calc.color}`}>
                                        <calc.icon className="w-8 h-8" />
                                    </div>
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-teal-400 transition-colors">
                                    {calc.title}
                                </h3>

                                <p className="text-gray-400 leading-relaxed">
                                    {calc.description}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
