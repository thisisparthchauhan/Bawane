"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, TrendingDown, TrendingUp, Activity, BrainCircuit } from "lucide-react";
import { createAlert } from "@/lib/alert-service";

interface CreateAlertDialogProps {
    symbol: string;
    currentPrice: number;
}

export function CreateAlertDialog({ symbol, currentPrice }: CreateAlertDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form States
    const [targetPrice, setTargetPrice] = useState(currentPrice.toString());
    const [percentChange, setPercentChange] = useState("5");
    const [sentimentTarget, setSentimentTarget] = useState("Bullish");
    const [activeTab, setActiveTab] = useState("price");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let type: "PRICE_ABOVE" | "PRICE_BELOW" | "PERCENT_CHANGE" | "SENTIMENT_CHANGE" = "PRICE_ABOVE";
        let targetValue = 0;

        if (activeTab === "price") {
            const price = parseFloat(targetPrice);
            type = price > currentPrice ? "PRICE_ABOVE" : "PRICE_BELOW";
            targetValue = price;
        } else if (activeTab === "percent") {
            type = "PERCENT_CHANGE";
            targetValue = parseFloat(percentChange);
        } else if (activeTab === "sentiment") {
            type = "SENTIMENT_CHANGE";
            targetValue = sentimentTarget === "Bullish" ? 1 : -1;
        }

        await createAlert({
            userId: "demo-user",
            symbol,
            type,
            targetValue,
            initialPrice: currentPrice, // Capture current price as baseline
            isActive: true,
            createdAt: Date.now()
        });

        setLoading(false);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="glass hover:bg-white/10 border-white/10 gap-2">
                    <Bell className="w-4 h-4" /> Set Alert
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black/90 border-white/10 text-white backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Create Signal: {symbol}</DialogTitle>
                    <DialogDescription>
                        Configure parameters for your intelligent alert.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="price" onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                        <TabsTrigger value="price">Price</TabsTrigger>
                        <TabsTrigger value="percent">% Move</TabsTrigger>
                        <TabsTrigger value="sentiment">AI Sentiment</TabsTrigger>
                    </TabsList>

                    {/* PRICE TAB */}
                    <TabsContent value="price" className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-gray-400">Current</Label>
                            <div className="col-span-3 font-mono font-bold text-lg">${currentPrice.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="target" className="text-right text-white">Target</Label>
                            <div className="col-span-3 relative">
                                <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                                <Input
                                    id="target"
                                    type="number"
                                    step="0.01"
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(e.target.value)}
                                    className="pl-6 bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>
                        {parseFloat(targetPrice) > currentPrice ? (
                            <div className="text-xs text-neon-green flex items-center justify-center gap-1 bg-neon-green/5 p-2 rounded">
                                <TrendingUp className="w-3 h-3" /> Alert when price crosses ABOVE target
                            </div>
                        ) : (
                            <div className="text-xs text-red-500 flex items-center justify-center gap-1 bg-red-500/5 p-2 rounded">
                                <TrendingDown className="w-3 h-3" /> Alert when price drops BELOW target
                            </div>
                        )}
                    </TabsContent>

                    {/* PERCENT TAB */}
                    <TabsContent value="percent" className="space-y-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-gray-400">Alert on volatility swing of:</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={percentChange}
                                    onChange={(e) => setPercentChange(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                                <span className="font-bold text-xl">%</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Checks for +/- {percentChange}% movement from ${currentPrice.toFixed(2)}.
                            </p>
                        </div>
                    </TabsContent>

                    {/* SENTIMENT TAB */}
                    <TabsContent value="sentiment" className="space-y-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-gray-400">Alert when AI detects:</Label>
                            <Select value={sentimentTarget} onValueChange={setSentimentTarget}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select sentiment" />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 text-white">
                                    <SelectItem value="Bullish">Bullish Momentum 🟢</SelectItem>
                                    <SelectItem value="Bearish">Bearish Outlook 🔴</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="text-xs text-neon-purple flex items-center gap-1 mt-2">
                                <BrainCircuit className="w-3 h-3" /> AI Engine analyzes news & indices daily.
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button onClick={handleSubmit} variant="neon" disabled={loading} className="w-full">
                        {loading ? "Creating Signal..." : "Create Alert"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
