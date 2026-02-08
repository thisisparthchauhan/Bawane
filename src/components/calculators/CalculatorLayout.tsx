"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ReactNode } from "react";

interface CalculatorLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

export function CalculatorLayout({ title, description, children }: CalculatorLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-teal-400 transition-colors">
                        <Home className="w-4 h-4" />
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/calculators" className="hover:text-teal-400 transition-colors">
                        Calculators
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-300 font-medium">{title}</span>
                </nav>

                {/* Header */}
                <div className="mb-10 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        {title}
                    </h1>
                    <p className="text-xl text-gray-400 font-light leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Content */}
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
