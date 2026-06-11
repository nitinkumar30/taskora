"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useGsapCounter } from "@/hooks/use-gsap-animation";
import { TaskStats } from "@/types";
import { cn } from "@/lib/utils";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Loader2,
  Archive,
  AlertCircle,
  TrendingUp,
  Percent,
} from "lucide-react";

interface StatsCardsProps {
  stats: TaskStats;
}

const statItems = [
  { key: "total", icon: ListTodo, label: "Total Tasks", color: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-500" },
  { key: "completed", icon: CheckCircle2, label: "Completed", color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-500" },
  { key: "pending", icon: Clock, label: "Pending", color: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-500" },
  { key: "inProgress", icon: Loader2, label: "In Progress", color: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-500" },
  { key: "archived", icon: Archive, label: "Archived", color: "from-gray-500/20 to-gray-500/5 border-gray-500/20 text-gray-500" },
  { key: "overdue", icon: AlertCircle, label: "Overdue", color: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-500" },
  { key: "productivityScore", icon: TrendingUp, label: "Productivity", color: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-500" },
  { key: "completionRate", icon: Percent, label: "Completion Rate", color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-500" },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statItems.map((item, i) => {
        const value = stats[item.key as keyof TaskStats] as number;
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={cn(
              "rounded-xl border bg-gradient-to-br p-4 backdrop-blur-sm",
              item.color
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="h-4 w-4" />
              <span className="text-xs font-medium opacity-80">{item.label}</span>
            </div>
            <motion.span
              className="text-2xl font-bold tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 + 0.2 }}
            >
              {typeof value === "number" && item.key !== "productivityScore" && item.key !== "completionRate"
                ? value
                : `${Math.round(value)}${item.key === "completionRate" ? "%" : ""}`}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
