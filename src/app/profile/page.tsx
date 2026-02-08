"use client";

import { useState } from "react";
import { User, Settings, CreditCard, Bookmark, List, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WATCHLIST_STOCKS } from "@/lib/constants";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("watchlist");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <Card className="w-full md:w-64 p-4 h-fit bg-white/5 border-white/10 space-y-2">
                    <div className="flex items-center gap-3 px-4 py-4 mb-4 border-b border-white/10">
                        <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-white">Parth Chauhan</p>
                            <p className="text-xs text-gray-400">Pro Member</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <Button
                            variant={activeTab === "watchlist" ? "neon" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("watchlist")}
                        >
                            <List className="w-4 h-4 mr-2" /> My Watchlist
                        </Button>
                        <Button
                            variant={activeTab === "bookmarks" ? "neon" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("bookmarks")}
                        >
                            <Bookmark className="w-4 h-4 mr-2" /> Saved Items
                        </Button>
                        <Button
                            variant={activeTab === "settings" ? "neon" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("settings")}
                        >
                            <Settings className="w-4 h-4 mr-2" /> Settings
                        </Button>
                        <Button
                            variant={activeTab === "billing" ? "neon" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("billing")}
                        >
                            <CreditCard className="w-4 h-4 mr-2" /> Billing
                        </Button>
                    </nav>

                    <div className="pt-4 border-t border-white/10 mt-4">
                        <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/20">
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    </div>
                </Card>

                {/* Content Area */}
                <div className="flex-1">
                    <Card className="p-8 bg-white/5 border-white/10 min-h-[500px]">
                        {activeTab === "watchlist" && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">My Watchlist</h2>
                                <div className="space-y-4">
                                    {WATCHLIST_STOCKS.map((stock) => (
                                        <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-lg bg-black/20 hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white">
                                                    {stock.symbol.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{stock.symbol}</p>
                                                    <p className="text-sm text-gray-400">{stock.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono text-white">${stock.price.toFixed(2)}</p>
                                                <p className={`text-xs ${stock.change >= 0 ? "text-neon-green" : "text-red-500"}`}>
                                                    {stock.change >= 0 ? "+" : ""}{stock.change}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
                                <div className="space-y-6 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Display Name</label>
                                        <input type="text" defaultValue="Parth Chauhan" className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                                        <input type="email" defaultValue="parth@example.com" className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                    </div>
                                    <Button variant="neon">Save Changes</Button>
                                </div>
                            </div>
                        )}

                        {(activeTab === "bookmarks" || activeTab === "billing") && (
                            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                                <Settings className="w-12 h-12 mb-4 opacity-20" />
                                <p>This section is under development.</p>
                            </div>
                        )}
                    </Card>
                </div>

            </div>
        </div>
    );
}
