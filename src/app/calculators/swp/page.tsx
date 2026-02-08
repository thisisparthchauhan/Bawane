"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";
import { InputSlider } from "@/components/calculators/InputSlider";
import { ResultCard } from "@/components/calculators/ResultCard";
import { DonutChart } from "@/components/calculators/DonutChart";

export default function SWPCalculatorPage() {
    const [totalInvestment, setTotalInvestment] = useState(1000000);
    const [withdrawal, setWithdrawal] = useState(10000);
    const [rate, setRate] = useState(8);
    const [years, setYears] = useState(5);

    const { totalWithdrawn, finalValue, isDepleted } = useMemo(() => {
        let balance = totalInvestment;
        let withdrawn = 0;
        const monthlyRate = rate / 1200;
        const months = years * 12;

        for (let i = 0; i < months; i++) {
            // Interest earned this month before withdrawal (or typically calculate end of month)
            // standard approximation: Balance earns interest -> Withdraw
            balance = balance + (balance * monthlyRate);
            balance = balance - withdrawal;

            withdrawn += withdrawal;

            if (balance < 0) {
                balance = 0;
                break;
            }
        }

        return {
            totalWithdrawn: Math.round(withdrawn),
            finalValue: Math.round(balance),
            isDepleted: balance <= 0
        };
    }, [totalInvestment, withdrawal, rate, years]);

    return (
        <CalculatorLayout
            title="SWP Calculator"
            description="Calculate your withdrawals and remaining balance with a Systematic Withdrawal Plan."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                {/* Inputs */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <InputSlider
                        label="Total Investment"
                        value={totalInvestment}
                        onChange={setTotalInvestment}
                        min={100000}
                        max={10000000}
                        step={10000}
                        prefix="₹"
                    />
                    <InputSlider
                        label="Monthly Withdrawal"
                        value={withdrawal}
                        onChange={setWithdrawal}
                        min={1000}
                        max={500000}
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
                        max={30}
                        step={1}
                        suffix="Yr"
                    />
                </div>

                {/* Results Section */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[300px]">
                        <DonutChart
                            data={[
                                { label: "Investment", value: totalInvestment, color: "#374151" },
                                { label: "Remaining", value: finalValue, color: "#14b8a6" }
                            ]}
                            total={Math.max(totalInvestment, finalValue + totalWithdrawn)} // Logic for chart visualization needs care here
                        // Actually comparing Final Value vs Total Withdrawn is strictly not a part-to-whole of original investment in strict sense if growth > withdrawal
                        // Let's visualize Final Value vs Withdrawn
                        />
                        <div className="flex gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-700" />
                                <span className="text-sm text-gray-400">Total Investment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-teal-500" />
                                <span className="text-sm text-gray-400">Final Value</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ResultCard label="Total Withdrawn" value={totalWithdrawn} />
                        <ResultCard label="Final Value" value={finalValue} isPrimary className={isDepleted ? "border-red-500/50 text-red-400" : ""} />
                    </div>
                    {isDepleted && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
                            ⚠️ Your corpus is depleted before the end of the tenure. Reduce withdrawal amount.
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
