"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "neon" | "link";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {

        const variants = {
            primary: "bg-white text-black hover:bg-neutral-200 border-transparent",
            secondary: "bg-surface hover:bg-white/10 text-white border-transparent",
            outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
            ghost: "bg-transparent text-white hover:bg-white/5 border-transparent",
            neon: "bg-neon-blue/10 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/20 shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]",
            link: "text-neon-blue underline-offset-4 hover:underline bg-transparent border-transparent px-0 py-0 h-auto hover:bg-transparent shadow-none scale-100 active:scale-100",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-5 py-2.5 text-base",
            lg: "px-8 py-3.5 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neon-blue/50 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children as React.ReactNode}
            </motion.button>
        );
    }
);
Button.displayName = "Button";
