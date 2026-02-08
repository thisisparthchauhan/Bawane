"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, User, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    // Mock content fetching
    const post = {
        id,
        title: "Understanding Basic Candlestick Patterns",
        author: "John Doe",
        date: "Jan 30, 2024",
        content: `
      <p class="mb-6">Candlestick charts are a technical tool used to pack data for multiple time frames into single price bars. This makes them more useful than traditional open-high, low-close bars or simple lines that connect closing prices.</p>
      
      <h2 class="text-2xl font-bold text-white mb-4">The History of Candlesticks</h2>
      <p class="mb-6">Candlestick charts originated in Japan over 100 years before the West developed the bar and point-and-figure charts. In the 1700s, a Japanese man named Homma discovered that, while there was a link between price and the supply and demand of rice, the markets were strongly influenced by the emotions of traders.</p>
      
      <h2 class="text-2xl font-bold text-white mb-4">Bullish Engulfing Pattern</h2>
      <p class="mb-6">The bullish engulfing pattern is formed of two candlesticks. The first candle is a short red body that is completely engulfed by a large green candle. It indicates a potential reversal of a downtrend.</p>
      
      <div class="bg-white/5 p-6 rounded-xl border border-white/10 my-8">
        <p class="italic text-gray-300">"The market is a voting machine in the short run and a weighing machine in the long run." - Benjamin Graham</p>
      </div>

      <p>By understanding these patterns, traders can gain insight into market sentiment and potential future price movements.</p>
    `,
    };

    return (
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
                href="/blogs"
                className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
            </Link>

            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{post.author}</p>
                                <p className="text-xs text-gray-400">Financial Analyst</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                            <Clock className="w-4 h-4 mr-2" /> {post.date}
                        </div>
                    </div>

                    <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                </div>
            </header>

            <div
                className="prose prose-invert prose-lg max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
    );
}
