"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPublishedReports, Report } from "@/lib/reports-service";

export default function FinancialReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            const data = await getPublishedReports("Financial");
            setReports(data);
            setLoading(false);
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-bold text-white mb-6">Financial Reports</h1>
                <p className="text-xl text-gray-400">
                    Quarterly earnings, annual reports, and financial statements.
                </p>
            </div>

            {reports.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No financial reports published yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reports.map((report, i) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-8 h-full flex flex-col justify-between hover:bg-white/5 transition-colors border-white/10">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-neon-green bg-neon-green/10 px-3 py-1 rounded-full uppercase tracking-wide">
                                            {report.category}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                        {report.headline}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center text-gray-400">
                                        <FileText className="w-4 h-4 mr-2" /> PDF Report
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(report.pdfUrl, '_blank')}
                                    >
                                        Download <Download className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
