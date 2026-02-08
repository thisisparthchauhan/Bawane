import Link from "next/link";
import { BarChart2, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-neon-blue/10 p-2 rounded-lg">
                                <BarChart2 className="w-6 h-6 text-neon-blue" />
                            </div>
                            <span className="font-bold text-xl text-white">
                                Analyst<span className="text-neon-blue">.</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Advanced financial intelligence for the modern investor. Real-time data, expert analysis, and next-gen tools.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Platform</h3>
                        <ul className="space-y-2">
                            {["Markets", "News", "Research", "Screeners", "Pricing"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-neon-blue text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            {["About", "Careers", "Blog", "Legal", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-neon-blue text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Stay Ahead</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Get the latest market insights delivered to your inbox.
                        </p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" className="bg-white/5 border-white/10" />
                            <Button variant="outline" size="sm">
                                <Mail className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2024 Stock Market Research Analyst. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
