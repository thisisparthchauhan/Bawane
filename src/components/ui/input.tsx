import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        if (icon) {
            return (
                <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                        {icon}
                    </span>
                    <input
                        type={type}
                        className={cn(
                            "flex h-11 w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
            );
        }

        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
