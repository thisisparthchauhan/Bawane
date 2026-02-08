"use client";

import { motion } from "framer-motion";
import { FileText, Download, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RESEARCH_REPORTS = [
    {
        id: 1,
        title: "2024 Market Outlook: Navigating Interest Rate Cuts",
        author: "Sarah Jenkins, CFA",
        date: "Jan 15, 2024",
        type: "Macro",
        premium: false,
    },
    {
        id: 2,
        title: "AI Sector Deep Dive: Beyond the Hype",
        author: "David Chen, Tech Analyst",
        date: "Jan 28, 2024",
        type: "Sector Analysis",
        premium: true,
    },
    {
        id: 3,
        title: "Emerging Markets: India's Growth Story",
        author: "Vikram Malhotra",
        date: "Feb 02, 2024",
        type: "Geopolitical",
        premium: true,
    },
    {
        id: 4,
        title: "Q4 Earnings Review: Winners & Losers",
        author: "Team Analyst",
        date: "Feb 10, 2024",
        type: "Earnings",
        premium: false,
    },
];

export default function ResearchPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-bold text-white mb-6">Institutional Research</h1>
                <p className="text-xl text-gray-400">
                    In-depth analysis and reports from top financial experts.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {RESEARCH_REPORTS.map((report, i) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-8 h-full flex flex-col justify-between hover:bg-white/5 transition-colors border-white/10">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-bold text-neon-purple bg-neon-purple/10 px-3 py-1 rounded-full uppercase tracking-wide">
                                        {report.type}
                                    </span>
                                    {report.premium && (
                                        <Lock className="w-4 h-4 text-yellow-500" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                    {report.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="font-medium text-gray-400">{report.author}</span>
                                    <span>•</span>
                                    <span>{report.date}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                <div className="flex items-center text-gray-400">
                                    <FileText className="w-4 h-4 mr-2" /> PDF Report
                                </div>
                                <Button variant={report.premium ? "neon" : "outline"} size="sm">
                                    {report.premium ? "Unlock Report" : "Download"} <Download className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
