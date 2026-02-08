"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface InputSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function InputSlider({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    prefix,
    suffix,
    className
}: InputSliderProps) {
    const [localValue, setLocalValue] = useState(value);

    // Sync local state with prop value
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Allow empty string for better typing experience, but internal logical value needs care
        const val = e.target.value;
        if (val === "") {
            setLocalValue(min); // Or keep it empty in local state if we want robust input handling
            return;
        }
        const parsed = parseFloat(val);
        // Don't clamp immediately on typing, wait for blur or ensure safe values
        setLocalValue(parsed);
        onChange(parsed);
    };

    // Calculate percentage for slider background logic
    const percentage = ((localValue - min) / (max - min)) * 100;

    return (
        <div className={cn("flex flex-col gap-4 p-5 bg-white/5 border border-white/10 rounded-xl", className)}>
            <div className="flex justify-between items-center">
                <label className="text-gray-300 font-medium">{label}</label>
                <div className="bg-white/10 px-3 py-1 rounded-md flex items-center gap-1 w-32 border border-white/5 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/50 transition-all">
                    {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
                    <input
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={localValue}
                        onChange={handleInputChange}
                        className="bg-transparent text-right text-white font-medium w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {suffix && <span className="text-gray-500 text-sm ml-1">{suffix}</span>}
                </div>
            </div>

            <div className="relative w-full h-6 flex items-center">
                {/* Custom Slider Track */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue}
                    onChange={handleSliderChange}
                    className="absolute w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 active:[&::-webkit-slider-thumb]:scale-95"
                    style={{
                        background: `linear-gradient(to right, #14b8a6 ${Math.min(Math.max(percentage, 0), 100)}%, #374151 ${Math.min(Math.max(percentage, 0), 100)}%)`
                    }}
                />
            </div>
        </div>
    );
}
