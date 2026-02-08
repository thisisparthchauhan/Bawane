"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart2, Search, User, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";

const navItems = [
    { name: "Market", href: "/market" },
    {
        name: "Calculators",
        href: "/calculators",
        children: [
            { name: "SIP Calculator", href: "/calculators/sip" },
            { name: "SWP Calculator", href: "/calculators/swp" },
            { name: "Brokerage Calculator", href: "/calculators/brokerage" },
            { name: "Margin Calculator", href: "/calculators/margin" },
        ]
    },
    { name: "News", href: "/news" },
    {
        name: "Reports",
        href: "/reports",
        children: [
            { name: "Research Reports", href: "/reports/research" },
            { name: "Financial Reports", href: "/reports/financial" },
        ]
    },
    { name: "Blogs", href: "/blogs" },
];

import { useAlertMonitor } from "@/hooks/useAlertMonitor";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Start monitoring alerts globally
    useAlertMonitor();

    return (
        <nav className="fixed top-0 inset-x-0 z-[100] glass-nav">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-neon-blue/10 p-2 rounded-lg group-hover:bg-neon-blue/20 transition-colors shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                            <BarChart2 className="w-6 h-6 text-neon-blue" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-neon-blue transition-colors text-glow">
                            Analyst<span className="text-neon-blue">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex h-full gap-8">
                        {navItems.map((item) => (
                            <div key={item.name} className="relative group h-full flex items-center">
                                <Magnetic>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "text-sm font-medium transition-colors hover:text-neon-blue inline-flex items-center gap-1 px-2 py-1",
                                            pathname.startsWith(item.href) ? "text-neon-blue" : "text-gray-400"
                                        )}
                                    >
                                        {item.name}
                                        {item.children && <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />}
                                    </Link>
                                </Magnetic>

                                {/* Dropdown Menu */}
                                {item.children && (
                                    <div className="absolute top-full left-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-x-4">
                                        <div className="p-2 rounded-xl border border-white/10 bg-[#050505] shadow-xl overflow-hidden">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Search className="w-5 h-5" />
                        </Button>

                        {/* Notification Bell */}
                        <div className="relative group">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </Button>
                            <div className="absolute right-0 top-full mt-2 w-80 p-0 hidden group-hover:block z-[101] transform origin-top-right transition-all rounded-xl border border-white/10 bg-[#050505] shadow-xl overflow-hidden">
                                <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black rounded-t-xl">
                                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                                    <span className="text-xs text-neon-blue cursor-pointer">Mark all read</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {/* Mock Alerts */}
                                    <div className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-white text-xs">AAPL Price Alert</span>
                                            <span className="text-[10px] text-gray-500">2m ago</span>
                                        </div>
                                        <p className="text-gray-400 text-xs">Apple Inc. crossed above $185.00 level.</p>
                                    </div>
                                    <div className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-neon-purple text-xs">AI Sentiment</span>
                                            <span className="text-[10px] text-gray-500">1h ago</span>
                                        </div>
                                        <p className="text-gray-400 text-xs">Market sentiment shifted to Bullish.</p>
                                    </div>
                                </div>
                                <div className="p-2 text-center border-t border-white/10 bg-black/50 rounded-b-xl">
                                    <span className="text-xs text-gray-500 hover:text-white cursor-pointer">View All Activity</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-4 w-[1px] bg-white/10" />
                        <Magnetic>
                            <Link href="/login">
                                <Button variant="ghost" className="text-sm">
                                    Log In
                                </Button>
                            </Link>
                        </Magnetic>
                        <Magnetic>
                            <Link href="/signup">
                                <Button variant="neon" size="sm">
                                    Get Started
                                </Button>
                            </Link>
                        </Magnetic>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {
                    isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navItems.map((item) => (
                                    <div key={item.name}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "block text-base font-medium px-2 py-2 rounded-md transition-colors",
                                                pathname === item.href
                                                    ? "bg-neon-blue/10 text-neon-blue"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                        {/* Mobile Submenu */}
                                        {item.children && (
                                            <div className="pl-4 mt-1 space-y-1 border-l-2 border-white/5 ml-2">
                                                {item.children.map(child => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "block text-sm font-medium px-2 py-2 rounded-md transition-colors",
                                                            pathname === child.href ? "text-neon-blue" : "text-gray-500 hover:text-white"
                                                        )}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-white/10 flex flex-col gap-3 mt-4">
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                                        <Button variant="neon" className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )
                }

            </AnimatePresence>
        </nav>
    );
}
