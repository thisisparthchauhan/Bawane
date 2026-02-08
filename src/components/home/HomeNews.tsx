"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BREAKING_NEWS } from "@/lib/constants";

export function HomeNews() {
    return (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Market Intelligence</h2>
                    <p className="text-gray-400">Latest breaking news and analyst insights</p>
                </div>
                <Link href="/news">
                    <Button variant="ghost" className="text-neon-blue hover:text-neon-blue/80">
                        View All News <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BREAKING_NEWS.map((news, i) => (
                    <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="h-full hover:border-neon-blue/30 group">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-neon-blue bg-neon-blue/10 px-2 py-1 rounded">
                                    {news.category}
                                </span>
                                <span className="flex items-center text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" /> {news.timestamp}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">
                                {news.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                {news.summary}
                            </p>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
