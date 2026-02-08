"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Users, FileText, TrendingUp, AlertTriangle, Check, X, Newspaper, RefreshCcw, BrainCircuit, Sparkles, Upload, Trash2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { refreshIndices } from "@/lib/market-service";
import { createNewsArticle } from "@/lib/news-service";
import { generateDailySentiment, getLatestSentiment, MarketSentiment } from "@/lib/sentiment-service";
import { addReport, getAllReports, toggleReportVisibility, uploadReportPDF, Report, deleteReport } from "@/lib/reports-service";

const PENDING_BLOGS = [
    { id: 1, title: "My Analysis of Tesla", author: "alex_trader", date: "Today" },
    { id: 2, title: "Crypto Bull Run 2024", author: "crypto_king", date: "Yesterday" },
];

export default function AdminDashboard() {
    const [blogs, setBlogs] = useState(PENDING_BLOGS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // AI Sentiment State
    const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
    const [generatingSentiment, setGeneratingSentiment] = useState(false);

    useEffect(() => {
        getLatestSentiment().then(setSentiment);
    }, []);

    const handleGenerateSentiment = async () => {
        setGeneratingSentiment(true);
        const newData = await generateDailySentiment();
        setSentiment(newData);
        setGeneratingSentiment(false);
    };

    // News Form State
    const [newsTitle, setNewsTitle] = useState("");
    const [newsSummary, setNewsSummary] = useState("");
    const [newsCategory, setNewsCategory] = useState("Global");

    const handleApprove = (id: number) => {
        setBlogs(blogs.filter((b) => b.id !== id));
        // In real app, call API to approve
    };

    const handleReject = (id: number) => {
        setBlogs(blogs.filter((b) => b.id !== id));
    };

    const handleRefreshMarket = async () => {
        setIsRefreshing(true);
        await refreshIndices();
        // Simulate a small delay for visual feedback if instant
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsTitle || !newsSummary) return;

        await createNewsArticle({
            title: newsTitle,
            summary: newsSummary,
            category: newsCategory as any,
            source: "Admin Console",
            url: "#",
            publishedAt: Date.now(),
            isFeatured: false,
        });

        // Reset
        setNewsTitle("");
        setNewsSummary("");
        alert("News Article Published!");
    };

    // Reports State
    const [reportHeadline, setReportHeadline] = useState("");
    const [reportCategory, setReportCategory] = useState<"Research" | "Financial">("Research");
    const [reportFile, setReportFile] = useState<File | null>(null);
    const [uploadingReport, setUploadingReport] = useState(false);
    const [reportsList, setReportsList] = useState<Report[]>([]);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        const data = await getAllReports();
        setReportsList(data);
    };

    const handleUploadReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportFile || !reportHeadline) return;

        setUploadingReport(true);
        try {
            const pdfUrl = await uploadReportPDF(reportFile);
            await addReport({
                headline: reportHeadline,
                category: reportCategory,
                pdfUrl,
                isVisible: true,
            });

            // Reset and reload
            setReportHeadline("");
            setReportFile(null);
            // Reset file input manually if needed, or rely on key
            alert("Report uploaded successfully!");
            loadReports();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload report.");
        } finally {
            setUploadingReport(false);
        }
    };

    const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
        await toggleReportVisibility(id, currentStatus);
        loadReports();
    };

    const handleDeleteReport = async (id: string, pdfUrl: string) => {
        if (confirm("Are you sure you want to delete this report?")) {
            await deleteReport(id, pdfUrl);
            loadReports();
        }
    };

    return (
        <div className="min-h-screen bg-black pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Admin Dashboard
                    </h1>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleRefreshMarket}
                            disabled={isRefreshing}
                            className={isRefreshing ? "animate-pulse" : ""}
                        >
                            <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                            Refresh Market
                        </Button>
                        <Link href="/">
                            <Button variant="ghost">Return to Site</Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-6 bg-white/5 border-white/10">
                        <div className="flex items-center gap-4 mb-2">
                            <Users className="w-5 h-5 text-neon-blue" />
                            <span className="text-gray-400">Total Users</span>
                        </div>
                        <p className="text-3xl font-bold text-white">1,248</p>
                        <p className="text-xs text-green-500">+12% this month</p>
                    </Card>

                    <Card className="p-6 bg-white/5 border-white/10">
                        <div className="flex items-center gap-4 mb-2">
                            <FileText className="w-5 h-5 text-neon-green" />
                            <span className="text-gray-400">Published Content</span>
                        </div>
                        <p className="text-3xl font-bold text-white">856</p>
                        <p className="text-xs text-green-500">+5% this week</p>
                    </Card>

                    <Card className="p-6 bg-white/5 border-white/10">
                        <div className="flex items-center gap-4 mb-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-400">Pending Approvals</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{blogs.length}</p>
                        <p className="text-xs text-gray-500">Action needed</p>
                    </Card>
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-bold text-white mb-6">System Controls</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <div className="md:col-span-2 glass-card p-4 flex items-center justify-between relative overflow-hidden group">
                        <div className="absolute inset-0 bg-neon-blue/5 group-hover:bg-neon-blue/10 transition-colors" />
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 text-neon-blue" />
                                AI Sentiment Engine
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">Generate automated market insights.</p>
                        </div>
                        <Button
                            variant="neon"
                            onClick={handleGenerateSentiment}
                            disabled={generatingSentiment}
                            className="relative z-10"
                        >
                            {generatingSentiment ? <RefreshCcw className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            {generatingSentiment ? "Analyzing..." : "Run Analysis"}
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        className="h-auto py-4 flex flex-col gap-2 hover:border-neon-blue hover:text-neon-blue transition-colors"
                        onClick={handleRefreshMarket}
                        disabled={isRefreshing}
                    >
                        <RefreshCcw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? "Updating..." : "Force Refresh Data"}</span>
                    </Button>

                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 opacity-50 cursor-not-allowed">
                        <Users className="w-6 h-6" />
                        <span>Manage Users</span>
                    </Button>
                </div>

                {/* AI Insight Preview */}
                {sentiment && (
                    <div className="mb-12 glass-card p-6 border-l-4 border-neon-blue">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Latest AI Insight</h3>
                                <p className="text-xs text-gray-500">Generated: {new Date(sentiment.generatedAt).toLocaleString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${sentiment.label === 'Bullish' ? 'bg-neon-green/10 text-neon-green' : sentiment.label === 'Bearish' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-400'}`}>
                                {sentiment.label} ({sentiment.score}/100)
                            </span>
                        </div>
                        <p className="text-gray-300 italic mb-4">"{sentiment.summary}"</p>
                        <div className="flex gap-2">
                            {sentiment.factors.map((f, i) => (
                                <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400">{f}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reports Management */}
                <h2 className="text-xl font-bold text-white mb-6 mt-12">Reports Management</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Upload Report */}
                    <Card className="p-6 bg-white/5 border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5 text-neon-green" />
                            <h2 className="text-xl font-bold text-white">Upload New Report</h2>
                        </div>

                        <form onSubmit={handleUploadReport} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Headline</label>
                                <Input
                                    value={reportHeadline}
                                    onChange={(e) => setReportHeadline(e.target.value)}
                                    placeholder="e.g. Q1 2024 Financial Results"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Category</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                                    value={reportCategory}
                                    onChange={(e) => setReportCategory(e.target.value as "Research" | "Financial")}
                                >
                                    <option value="Research">Research Report</option>
                                    <option value="Financial">Financial Report</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">PDF File</label>
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setReportFile(e.target.files ? e.target.files[0] : null)}
                                    required
                                    className="cursor-pointer"
                                />
                            </div>
                            <Button type="submit" variant="neon" className="w-full" disabled={uploadingReport}>
                                {uploadingReport ? <RefreshCcw className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                {uploadingReport ? "Uploading..." : "Upload & Publish"}
                            </Button>
                        </form>
                    </Card>

                    {/* Manage Reports */}
                    <Card className="p-6 bg-white/5 border-white/10 max-h-[500px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Manage Reports</h2>
                            <Button variant="ghost" size="sm" onClick={loadReports}>
                                <RefreshCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {reportsList.map((report) => (
                                <div key={report.id} className="p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white text-sm line-clamp-1">{report.headline}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${report.category === 'Research' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-green/20 text-neon-green'}`}>
                                            {report.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-neon-blue hover:underline flex items-center">
                                            View PDF <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant={report.isVisible ? "outline" : "ghost"}
                                                className={`h-7 text-xs ${!report.isVisible ? "text-red-500 hover:text-red-400 hover:bg-red-500/10" : ""}`}
                                                onClick={() => handleToggleVisibility(report.id!, report.isVisible)}
                                            >
                                                {report.isVisible ? "Hide" : "Publish"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleDeleteReport(report.id!, report.pdfUrl)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {reportsList.length === 0 && (
                                <p className="text-center text-gray-500 text-sm py-4">No reports found.</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* News Manager */}
                    <Card className="p-6 bg-white/5 border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                            <Newspaper className="w-5 h-5 text-neon-blue" />
                            <h2 className="text-xl font-bold text-white">Publish Market News</h2>
                        </div>

                        <form onSubmit={handleCreateNews} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Title</label>
                                <Input
                                    value={newsTitle}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewsTitle(e.target.value)}
                                    placeholder="e.g. Fed Rates Unchanged"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Category</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white text-sm"
                                    value={newsCategory}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewsCategory(e.target.value)}
                                >
                                    <option value="Global">Global</option>
                                    <option value="India">India</option>
                                    <option value="Commodities">Commodities</option>
                                    <option value="Crypto">Crypto</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Summary</label>
                                <Textarea
                                    value={newsSummary}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewsSummary(e.target.value)}
                                    placeholder="Short synopsis..."
                                    className="h-24"
                                    required
                                />
                            </div>
                            <Button type="submit" variant="neon" className="w-full">
                                Publish to News Feed
                            </Button>
                        </form>
                    </Card>

                    {/* Pending Blogs */}
                    <Card className="p-6 bg-white/5 border-white/10">
                        <h2 className="text-xl font-bold text-white mb-6">Pending Blog Approvals</h2>
                        {blogs.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No pending blogs.</p>
                        ) : (
                            <div className="space-y-4">
                                {blogs.map((blog) => (
                                    <div key={blog.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                                        <div>
                                            <h3 className="font-semibold text-white">{blog.title}</h3>
                                            <p className="text-xs text-gray-500">By {blog.author} • {blog.date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="neon" onClick={() => handleApprove(blog.id)}>
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleReject(blog.id)}>
                                                <X className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
