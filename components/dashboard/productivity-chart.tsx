"use client";

import { motion } from "framer-motion";
import { Task } from "@/types";
import { formatDateShort } from "@/lib/utils";

interface ProductivityChartProps {
  tasks: Task[];
}

export function ProductivityChart({ tasks }: ProductivityChartProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const dailyCompletions = last7Days.map((date) => ({
    date,
    count: tasks.filter((t) => t.completedAt && t.completedAt.startsWith(date)).length,
    label: formatDateShort(date),
  }));

  const maxCount = Math.max(...dailyCompletions.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6">
      <h3 className="text-sm font-semibold mb-4">Completion Trend</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {dailyCompletions.map((day, i) => (
          <motion.div
            key={day.date}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(day.count / maxCount) * 100}%` }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="w-full rounded-md bg-gradient-to-t from-indigo-500 to-purple-500 min-h-[4px]"
            />
            <span className="text-[10px] text-muted-foreground">{day.count}</span>
            <span className="text-[8px] text-muted-foreground truncate w-full text-center">
              {day.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
