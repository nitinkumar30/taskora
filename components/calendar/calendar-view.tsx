"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Task } from "@/types";
import { cn, isToday, formatDateShort } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<"month" | "week">("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return tasks.filter(
      (t) =>
        (t.dueDate && t.dueDate.startsWith(dateStr)) ||
        (t.completedAt && t.completedAt.startsWith(dateStr))
    );
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{monthName}</h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border/30 p-0.5">
          <button
            onClick={() => setViewMode("month")}
            className={cn("px-3 py-1 text-xs rounded-md transition-colors", viewMode === "month" ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={cn("px-3 py-1 text-xs rounded-md transition-colors", viewMode === "week" ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
          >
            Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs font-medium text-muted-foreground py-2">
            {name}
          </div>
        ))}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[80px] p-1" />
        ))}
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          const dateObj = new Date(year, month, day);
          const isCurrentDay = isToday(dateObj.toISOString());
          return (
            <motion.div
              key={day}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              className={cn(
                "min-h-[80px] p-1 rounded-lg transition-colors border border-transparent",
                isCurrentDay && "border-primary/30 bg-primary/5"
              )}
            >
              <span className={cn(
                "inline-flex h-6 w-6 items-center justify-center text-xs rounded-full",
                isCurrentDay && "bg-primary text-primary-foreground font-bold"
              )}>
                {day}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "text-[9px] px-1 py-0.5 rounded truncate",
                      task.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-500 line-through"
                        : "bg-indigo-500/20 text-indigo-400"
                    )}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] text-muted-foreground px-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
