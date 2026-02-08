"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface StockChartProps {
    data: { date: string; value: number }[];
    color: string;
}

export function StockChart({ data, color }: StockChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="date"
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                />
                <YAxis
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#aaa', marginBottom: '4px' }}
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
