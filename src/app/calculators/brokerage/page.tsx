"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";
import { InputSlider } from "@/components/calculators/InputSlider";
import { ResultCard } from "@/components/calculators/ResultCard";

export default function BrokerageCalculatorPage() {
    const [buyPrice, setBuyPrice] = useState(1000);
    const [sellPrice, setSellPrice] = useState(1100);
    const [quantity, setQuantity] = useState(100);
    const [isIntraday, setIsIntraday] = useState(true);

    const {
        turnover,
        brokerage,
        stt,
        exchangeTxn,
        gst,
        sebiCharges,
        stampDuty,
        totalCharges,
        netPnL
    } = useMemo(() => {
        const buyValue = buyPrice * quantity;
        const sellValue = sellPrice * quantity;
        const turnoverVal = buyValue + sellValue;
        const grossPnL = sellValue - buyValue;

        // Standard Rates (Simplified for Generic Equity)
        // Intraday: Brokerage 0.03% or 20, STT 0.025% on sell only
        // Delivery: Brokerage 0, STT 0.1% on buy & sell

        let brokg = 0;
        let sttVal = 0;
        let stamp = 0; // Stamp duty

        if (isIntraday) {
            // Brokerage: 0.03% or Rs 20 whichever is lower per order
            const buyBrok = Math.min(20, buyValue * 0.0003);
            const sellBrok = Math.min(20, sellValue * 0.0003);
            brokg = buyBrok + sellBrok;

            // STT: 0.025% on Sell only
            sttVal = sellValue * 0.00025;

            // Stamp Duty: 0.003% on Buy
            stamp = buyValue * 0.00003;
        } else {
            // Delivery
            // Brokerage: 0 (Usually free for modern brokers) or 0.1% etc. Let's assume standard flat 20 or 0
            // Let's go with 0 for Equity Delivery (Zero Brokerage model) to be attractive
            brokg = 0;

            // STT: 0.1% on Buy & Sell
            sttVal = turnoverVal * 0.001;

            // Stamp Duty: 0.015% on Buy
            stamp = buyValue * 0.00015;
        }

        // Common Charges
        // Exchange Txn: 0.00345% (NSE)
        const exch = turnoverVal * 0.0000345;

        // SEBI: 0.0001% (Rs 10 per crore)
        const sebi = turnoverVal * 0.000001;

        // GST: 18% on (Brokerage + Exchange + SEBI)
        const gstVal = (brokg + exch + sebi) * 0.18;

        const totalChg = brokg + sttVal + exch + gstVal + sebi + stamp;
        const net = grossPnL - totalChg;

        return {
            turnover: turnoverVal,
            brokerage: brokg,
            stt: sttVal,
            exchangeTxn: exch,
            gst: gstVal,
            sebiCharges: sebi,
            stampDuty: stamp,
            totalCharges: totalChg,
            netPnL: net
        };
    }, [buyPrice, sellPrice, quantity, isIntraday]);

    return (
        <CalculatorLayout
            title="Brokerage Calculator"
            description="Calculate net profit/loss, brokerage, taxes and other charges for Equity trades."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                {/* Inputs */}
                <div className="lg:col-span-6 flex flex-col gap-8">
                    {/* Toggle Switch */}
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-fit">
                        <button
                            onClick={() => setIsIntraday(true)}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${isIntraday ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Intraday
                        </button>
                        <button
                            onClick={() => setIsIntraday(false)}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${!isIntraday ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Delivery
                        </button>
                    </div>

                    <InputSlider
                        label="Buy Price"
                        value={buyPrice}
                        onChange={setBuyPrice}
                        min={1}
                        max={50000}
                        step={1}
                        prefix="₹"
                    />
                    <InputSlider
                        label="Sell Price"
                        value={sellPrice}
                        onChange={setSellPrice}
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
                <div className="lg:col-span-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <ResultCard label="Turnover" value={turnover} />
                        <ResultCard label="Total Charges" value={totalCharges} className="border-red-500/20 text-red-200" />
                    </div>

                    <ResultCard
                        label="Net Profit / Loss"
                        value={netPnL}
                        isPrimary
                        className={netPnL >= 0 ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}
                    />

                    {/* Breakdown Table */}
                    <div className="mt-6 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Charge</th>
                                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-300">
                                <tr>
                                    <td className="px-6 py-3">Brokerage</td>
                                    <td className="px-6 py-3 text-right">₹{brokerage.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-3">STT / CTT</td>
                                    <td className="px-6 py-3 text-right">₹{stt.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-3">Exchange Txn Charge</td>
                                    <td className="px-6 py-3 text-right">₹{exchangeTxn.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-3">GST (18%)</td>
                                    <td className="px-6 py-3 text-right">₹{gst.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-3">SEBI Charges</td>
                                    <td className="px-6 py-3 text-right">₹{sebiCharges.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-3">Stamp Duty</td>
                                    <td className="px-6 py-3 text-right">₹{stampDuty.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
}
