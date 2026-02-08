"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ClockProps {
    city: string;
    timezone: string;
    now: Date | null;
}

function AnalogClock({ city, timezone, now }: ClockProps) {
    const [timeParts, setTimeParts] = useState<{ h: number, m: number, s: number } | null>(null);

    useEffect(() => {
        if (now) {
            try {
                // ROBUST TIME PARSING: Use formatToParts to get exact numbers regardless of locale string format
                const formatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: timezone,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: false
                });

                const parts = formatter.formatToParts(now);
                const h = parseInt(parts.find(p => p.type === "hour")?.value || "0");
                const m = parseInt(parts.find(p => p.type === "minute")?.value || "0");
                const s = parseInt(parts.find(p => p.type === "second")?.value || "0");

                setTimeParts({ h, m, s });
            } catch (e) {
                console.error(`Clock error: ${city}`, e);
            }
        }
    }, [now, timezone, city]);

    if (!timeParts) {
        return (
            <div className="flex flex-col items-center gap-4 opacity-50">
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-white/20 bg-neutral-900 shadow-xl" />
                <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">{city}</span>
            </div>
        );
    }

    const { h, m, s } = timeParts;

    // EXACT ANGLE FORMULAS (0deg = 12 o'clock)
    // Vertical hands (origin-bottom)
    const secondDegrees = s * 6;
    const minuteDegrees = (m * 6) + (s * 0.1);
    const hourDegrees = ((h % 12) * 30) + (m * 0.5);

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-white/20 bg-neutral-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">

                {/* Ticks */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 flex justify-center"
                        style={{ transform: `rotate(${i * 30}deg)` }}
                    >
                        <div className={`mt-2 w-0.5 rounded-full ${i % 3 === 0 ? "h-3 bg-white" : "h-1.5 bg-gray-600"}`} />
                    </div>
                ))}

                {/* Center Pivot */}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-40 border-2 border-neutral-900 shadow-sm" />

                {/* Hour Hand Container */}
                <div
                    className="absolute inset-0 flex justify-center items-center z-10"
                    style={{ transform: `rotate(${hourDegrees}deg)` }}
                >
                    {/* Hand: Positioned relative to center, moves UP */}
                    <div className="w-1.5 h-[50%] relative">
                        {/* Visible part: 50% of radius (which is 25% of diameter/height) */}
                        {/* We use absolute positioning inside this half-height container to push it from bottom */}
                        <div className="absolute bottom-[50%] left-0 w-full h-[50%] bg-white rounded-full origin-bottom" />
                    </div>
                </div>

                {/* Minute Hand Container */}
                <div
                    className="absolute inset-0 flex justify-center items-center z-20"
                    style={{ transform: `rotate(${minuteDegrees}deg)` }}
                >
                    <div className="w-1 h-[72%] relative">
                        <div className="absolute bottom-[50%] left-0 w-full h-[50%] bg-gray-300 rounded-full" />
                    </div>
                </div>

                {/* Second Hand Container */}
                <div
                    className="absolute inset-0 flex justify-center items-center z-30"
                    style={{ transform: `rotate(${secondDegrees}deg)` }}
                >
                    {/* Tail for counterbalance */}
                    <div className="w-[1.5px] h-[100%] relative flex flex-col justify-center items-center">
                        {/* Main hand */}
                        <div className="absolute bottom-[50%] w-full h-[42.5%] bg-teal-400 rounded-full" />
                        {/* Counterbalance tail */}
                        <div className="absolute top-[50%] w-full h-[10%] bg-teal-400 rounded-full opacity-50" />
                    </div>
                </div>
            </div>

            <div className="text-center space-y-1">
                <span className="block text-sm font-bold text-white tracking-widest uppercase">
                    {city}
                </span>
                <span className="block text-base text-gray-300 font-mono font-medium">
                    {h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
                </span>
            </div>
        </div>
    );
}

const MARKETS = [
    { city: "Mumbai", timezone: "Asia/Kolkata" },
    { city: "New York", timezone: "America/New_York" },
    { city: "Tokyo", timezone: "Asia/Tokyo" },
    { city: "Singapore", timezone: "Asia/Singapore" },
    { city: "London", timezone: "Europe/London" },
    { city: "Hong Kong", timezone: "Asia/Hong_Kong" },
];

export function GlobalMarketClocks() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        // Initial set
        setNow(new Date());

        // Update loop
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-20 border-t border-white/5 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-teal-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
                    {/* Brand Text */}
                    <div className="max-w-xl text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            <span className="text-xs font-medium text-teal-400 uppercase tracking-widest">Live Exchange Times</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                            Global Markets <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Sync</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            Monitoring session overlaps, liquidity windows, and opening bells across major financial capitals 24/7.
                        </p>
                    </div>

                    {/* Clocks Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 lg:gap-x-12">
                        {MARKETS.map((market, i) => (
                            <motion.div
                                key={market.city}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <AnalogClock city={market.city} timezone={market.timezone} now={now} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
