"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";
import { InputSlider } from "@/components/calculators/InputSlider";
import { ResultCard } from "@/components/calculators/ResultCard";

export default function MarginCalculatorPage() {
    const [price, setPrice] = useState(500);
    const [quantity, setQuantity] = useState(100);
    const [marginType, setMarginType] = useState("intraday");

    // Effective Leverage map
    const leverageMap: Record<string, number> = {
        "intraday": 5, // 5x for Equity Intraday
        "delivery": 1, // 1x for Delivery
        "futures": 4,  // Approx 4x for Futures
        "options": 1   // 1x for Options Buying
    };

    const effectiveLeverage = leverageMap[marginType] || 1;

    const { totalValue, requiredMargin, exposure } = useMemo(() => {
        const value = price * quantity;
        const required = value / effectiveLeverage;

        return {
            totalValue: value,
            requiredMargin: Math.round(required),
            exposure: effectiveLeverage + "x"
        };
    }, [price, quantity, effectiveLeverage]);

    return (
        <CalculatorLayout
            title="Margin Calculator"
            description="Calculate the margin required for your trades and understand your leverage exposure."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                {/* Inputs */}
                <div className="lg:col-span-6 flex flex-col gap-8">
                    {/* Toggle Switch */}
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(leverageMap).map((type) => (
                            <button
                                key={type}
                                onClick={() => setMarginType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize border ${marginType === type
                                        ? 'bg-teal-600 border-teal-500 text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <InputSlider
                        label="Stock Price"
                        value={price}
                        onChange={setPrice}
                        min={1}
                        max={50000}
                        step={1}
                        prefix="₹"
                    />
                    <InputSlider
                        label="Quantity"
                        value={quantity}
                        onChange={setQuantity}
                        min={1}
                        max={10000}
                        step={1}
                    />
                </div>

                {/* Results Section */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <ResultCard label="Total Trade Value" value={totalValue} />
                        <ResultCard label="Leverage Used" value={exposure} isPrimary={false} currency="" />
                    </div>

                    <ResultCard
                        label="Required Margin"
                        value={requiredMargin}
                        subtext="Amount needed in your account to place this trade"
                        isPrimary
                    />

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm mt-4">
                        <span className="font-bold">⚠️ Risk Disclosure:</span> Trading with leverage involves significant risk of capital loss. Ensure you understand the margin requirements before trading.
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
}
