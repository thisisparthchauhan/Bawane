"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";
import { InputSlider } from "@/components/calculators/InputSlider";
import { ResultCard } from "@/components/calculators/ResultCard";
import { DonutChart } from "@/components/calculators/DonutChart";

export default function SIPCalculatorPage() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const { investedAmount, estReturns, totalValue } = useMemo(() => {
        const i = rate / 1200; // monthly rate
        const n = years * 12; // months

        // SIP Formula: P * [ (1+i)^n - 1 ] / i * (1+i)
        // P = Monthly Investment

        const fv = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const invested = monthlyInvestment * n;

        return {
            investedAmount: Math.round(invested),
            estReturns: Math.round(fv - invested),
            totalValue: Math.round(fv)
        };
    }, [monthlyInvestment, rate, years]);

    return (
        <CalculatorLayout
            title="SIP Calculator"
            description="Calculate the future value of your monthly Systematic Investment Plan (SIP) investments."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                {/* Inputs */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <InputSlider
                        label="Monthly Investment"
                        value={monthlyInvestment}
                        onChange={setMonthlyInvestment}
                        min={500}
                        max={100000}
                        step={500}
                        prefix="₹"
                    />
                    <InputSlider
                        label="Expected Return Rate (p.a)"
                        value={rate}
                        onChange={setRate}
                        min={1}
                        max={30}
                        step={0.1}
                        suffix="%"
                    />
                    <InputSlider
                        label="Time Period"
                        value={years}
                        onChange={setYears}
                        min={1}
                        max={40}
                        step={1}
                        suffix="Yr"
                    />
                </div>

                {/* Results Section */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[300px]">
                        <DonutChart
                            data={[
                                { label: "Invested", value: investedAmount, color: "#374151" }, // Gray
                                { label: "Returns", value: estReturns, color: "#14b8a6" } // Teal
                            ]}
                        />
                        <div className="flex gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-700" />
                                <span className="text-sm text-gray-400">Invested</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-teal-500" />
                                <span className="text-sm text-gray-400">Returns</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ResultCard label="Invested Amount" value={investedAmount} />
                        <ResultCard label="Est. Returns" value={estReturns} isPrimary />
                    </div>
                    <ResultCard
                        label="Total Value"
                        value={totalValue}
                        isPrimary
                        className="bg-gradient-to-br from-teal-900/40 to-black border-teal-500/50"
                    />
                </div>
            </div>
        </CalculatorLayout>
    );
}
