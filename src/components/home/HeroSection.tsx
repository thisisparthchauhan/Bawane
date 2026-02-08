"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketIndexCard } from "@/components/home/MarketIndexCard";
import { MARKET_INDICES } from "@/lib/constants";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-12 md:py-24">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Master the Markets with
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                                Precision Intelligence
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                            Institutional-grade data, advanced analytics, and real-time insights for the modern investor.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button variant="neon" size="lg" className="w-full sm:w-auto">
                                Start Researching <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                View Live Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Market Indices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MARKET_INDICES.map((index, i) => (
                        <motion.div
                            key={index.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                        >
                            <MarketIndexCard
                                name={index.name}
                                value={index.value}
                                change={index.change}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
