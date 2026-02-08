"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BLOG_POSTS = [
    {
        id: "basic-candlestick-patterns",
        title: "Understanding Basic Candlestick Patterns",
        excerpt: "A beginner's guide to reading stock charts and identifying key reversal signals.",
        author: "John Doe",
        date: "2 days ago",
    },
    {
        id: "value-investing-101",
        title: "Value Investing 101: Finding Undervalued Gems",
        excerpt: "Learn the core principles of value investing popularized by Warren Buffett and Benjamin Graham.",
        author: "Jane Smith",
        date: "5 days ago",
    },
    {
        id: "options-trading-risks",
        title: "The Hidden Risks of Options Trading",
        excerpt: "Why most retail traders lose money in options and how to manage risk effectively.",
        author: "Mike Johnson",
        date: "1 week ago",
    },
];

export default function BlogsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">Community Insights</h1>
                    <p className="text-gray-400">
                        Educational content and market opinions from our community.
                    </p>
                </div>
                <Button variant="neon">Write a Blog</Button>
            </div>

            <div className="grid gap-8">
                {BLOG_POSTS.map((post, i) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-8 hover:bg-white/5 transition-colors group">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-400 max-w-3xl">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>By <span className="text-gray-300">{post.author}</span></span>
                                        <span>•</span>
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                                <Link href={`/blogs/${post.id}`}>
                                    <Button variant="ghost" className="shrink-0 group-hover:translate-x-1 transition-transform">
                                        Read More <ChevronRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
