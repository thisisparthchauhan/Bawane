"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getNews, NewsArticle } from "@/lib/news-service";
import { formatDistanceToNow } from "date-fns";

export default function NewsPage() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            setLoading(true);
            const data = await getNews(category);
            setNews(data);
            setLoading(false);
        }
        fetchNews();
    }, [category]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Global Market News</h1>
                <p className="text-gray-400 max-w-2xl mb-8">
                    Stay informed with real-time updates on stocks, crypto, commodities, and economic events shaping the financial world.
                </p>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <Input placeholder="Search headlines..." className="pl-10" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Global', 'India', 'Crypto', 'Commodities'].map((filter) => (
                            <Button
                                key={filter}
                                variant={category === filter ? 'neon' : 'outline'}
                                size="sm"
                                onClick={() => setCategory(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="p-8 bg-white/5 border-white/5 animate-pulse h-40" />
                        ))}
                    </div>
                ) : (
                    news.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="p-6 md:p-8 hover:bg-white/5 transition-colors group cursor-pointer bg-white/5 border-white/10">
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold text-neon-blue uppercase tracking-wider">
                                                {item.category}
                                            </span>
                                            <div className="w-1 h-1 bg-gray-600 rounded-full" />
                                            <span className="flex items-center text-xs text-gray-500">
                                                <Clock className="w-3 h-3 mr-1" /> {formatDistanceToNow(item.publishedAt)} ago
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            {item.summary}
                                        </p>
                                    </div>
                                    <Button variant="outline" className="shrink-0 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read Story
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
