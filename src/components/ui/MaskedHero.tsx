"use client";

import { useEffect, useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useMotionTemplate
} from "framer-motion";

export function MaskedHero() {
    const containerRef = useRef<HTMLDivElement>(null);

    // 1. Scroll Progress for Exit Transition
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    // 2. Mouse Interaction Setup
    const mouseX = useMotionValue(0.5); // Start at center (0.5)
    const mouseY = useMotionValue(0.5); // Start at center (0.5)

    // Smooth physics for mouse movement
    const springConfig = { damping: 30, stiffness: 150, mass: 0.8 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // 3. Parallax Mapping
    // Background moves slightly opposite to mouse to create depth
    const bgX = useTransform(springX, [0, 1], ["2%", "-2%"]);
    const bgY = useTransform(springY, [0, 1], ["2%", "-2%"]);

    // Spotlight/Mask moves WITH the mouse, but slightly exaggerated
    // We need pixel values or percentages for clip-path
    // We'll use CSS variables for the mask position to keep it performant
    const maskX = useTransform(springX, [0, 1], ["40%", "60%"]);
    const maskY = useTransform(springY, [0, 1], ["40%", "60%"]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate normalized mouse position (0 to 1)
            const { innerWidth, innerHeight } = window;
            mouseX.set(e.clientX / innerWidth);
            mouseY.set(e.clientY / innerHeight);
        };

        if (window.matchMedia("(min-width: 768px)").matches) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Dynamic Clip Path for the "Window" Layer
    // Using motion template to construct the CSS value
    const clipPath = useMotionTemplate`circle(300px at ${maskX} ${maskY})`;

    return (
        <section
            ref={containerRef}
            className="relative h-[110vh] min-h-[800px] w-full overflow-hidden bg-black"
        >
            {/* Scroll Parallax Wrapper */}
            <motion.div
                style={{ scale: heroScale, opacity: heroOpacity }}
                className="absolute inset-0 w-full h-full"
            >
                {/* LAYER 1: Dimmed Background (Base) */}
                <motion.div
                    className="absolute inset-[-5%] w-[110%] h-[110%]"
                    style={{ x: bgX, y: bgY }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')",
                        }}
                    >
                        {/* Heavy Dark Overlay */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
                        {/* Additional Gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
                    </div>
                </motion.div>

                {/* LAYER 2: Spotlight/Masked Background (Bright) */}
                {/* This layer reveals the clear image through the circle mask */}
                <motion.div
                    className="absolute inset-[-5%] w-[110%] h-[110%] z-10 hidden md:block"
                    style={{
                        x: bgX,
                        y: bgY,
                        clipPath: clipPath,
                        WebkitClipPath: clipPath
                    }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center contrast-125 saturate-0 brightness-125"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')",
                        }}
                    >
                        {/* Subtle tint on the spotlight area */}
                        <div className="absolute inset-0 bg-teal-500/10 mix-blend-overlay" />
                    </div>
                </motion.div>

                {/* Decorative Ring overlaying the Mask Edge */}
                {/* Moves in sync with the mask position to frame it */}
                <motion.div
                    className="absolute inset-0 z-20 pointer-events-none hidden md:block"
                    style={{
                        x: useTransform(maskX, (val) => typeof val === 'string' ? `calc(${val} - 50%)` : val),
                        left: maskX,
                        top: maskY,
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    <div className="w-[600px] h-[600px] rounded-full border border-white/20 shadow-[0_0_50px_rgba(20,184,166,0.1)]">
                        <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-[spin_120s_linear_infinite]" />
                        <div className="absolute inset-4 rounded-full border border-white/5" />
                    </div>
                </motion.div>

            </motion.div>

            {/* LAYER 3: Content */}
            <motion.div
                style={{ y: contentY }}
                className="relative z-30 h-full flex items-center"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1]">
                                Institutional <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                                    Grade Intelligence.
                                </span>
                            </h1>

                            <div className="w-24 h-1 bg-teal-500 mb-8" />

                            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light">
                                Advanced market data analysis and algorithmic execution strategies for the modern financial ecosystem.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Vignette Overlay (Top Layer) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none z-20" />
        </section>
    );
}
