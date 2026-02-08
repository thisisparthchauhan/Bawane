"use client";

interface DonutChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    total?: number;
}

export function DonutChart({ data, total }: DonutChartProps) {
    const totalValue = total || data.reduce((acc, curr) => acc + curr.value, 0);

    let cumulativePercentage = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const slices = data.map((slice) => {
        const startPercent = cumulativePercentage;
        const slicePercent = slice.value / totalValue;
        const endPercent = cumulativePercentage + slicePercent;
        cumulativePercentage += slicePercent;

        // Ensure we handle complete circles or weird tiny slices gracefully if needed
        // For standard SIP/SWP (Invested vs Returns), it's usually 2 clean slices.

        // SVG Logic for Donut Slices (Using dasharray technique is easier usually, but paths work too)
        // Let's use simple stroke-dasharray on circles for cleanest implementation

        return {
            ...slice,
            percent: slicePercent,
            dashArray: `${slicePercent * 100} 100`,
            dashOffset: -(startPercent * 100)
        };
    });

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                {slices.map((slice, i) => (
                    <circle
                        key={i}
                        cx="21"
                        cy="21"
                        r="15.91549430918954" // Radius that gives circumference of 100 for easy calc
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="5"
                        strokeDasharray={slice.dashArray}
                        strokeDashoffset={slice.dashOffset}
                    />
                ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {/* Optional center content */}
            </div>
        </div>
    );
}
