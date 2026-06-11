"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <input
          type="date"
          className={cn(
            "flex h-10 w-full rounded-lg border border-border bg-background/50 pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 [color-scheme:var(--color-scheme)] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
DateInput.displayName = "DateInput";

export { DateInput };
