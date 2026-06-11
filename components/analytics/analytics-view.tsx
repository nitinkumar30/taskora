"use client";

import { motion } from "framer-motion";
import { Task } from "@/types";
import { cn, getPriorityColor } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface AnalyticsViewProps {
  tasks: Task[];
}

export function AnalyticsView({ tasks }: AnalyticsViewProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const archived = tasks.filter((t) => t.status === "archived").length;

  const priorityCounts = {
    low: tasks.filter((t) => t.priority === "low").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    high: tasks.filter((t) => t.priority === "high").length,
    critical: tasks.filter((t) => t.priority === "critical").length,
  };

  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: tasks.filter((t) => t.category === cat).length,
  }));

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const productivityScore = total > 0 ? Math.round(((completed + inProgress * 0.5) / total) * 100) : 0;

  const chartData = [
    { label: "Completed", value: completed, color: "bg-emerald-500", percentage: total > 0 ? (completed / total) * 100 : 0 },
    { label: "In Progress", value: inProgress, color: "bg-blue-500", percentage: total > 0 ? (inProgress / total) * 100 : 0 },
    { label: "Pending", value: pending, color: "bg-amber-500", percentage: total > 0 ? (pending / total) * 100 : 0 },
    { label: "Archived", value: archived, color: "bg-gray-500", percentage: total > 0 ? (archived / total) * 100 : 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6"
        >
          <h3 className="text-sm font-semibold mb-4">Task Distribution</h3>
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6"
        >
          <h3 className="text-sm font-semibold mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {Object.entries(priorityCounts).map(([priority, count]) => (
              <div key={priority}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className={cn("capitalize", getPriorityColor(priority).split(" ")[0])}>{priority}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className={cn(
                      "h-full rounded-full",
                      priority === "critical" ? "bg-red-500" : priority === "high" ? "bg-orange-500" : priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 text-center"
        >
          <div className="text-3xl font-bold text-emerald-500">{completionRate}%</div>
          <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
          <Progress value={completionRate} className="mt-3 h-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 text-center"
        >
          <div className="text-3xl font-bold text-indigo-500">{productivityScore}%</div>
          <p className="text-sm text-muted-foreground mt-1">Productivity Score</p>
          <Progress value={productivityScore} className="mt-3 h-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6"
        >
          <h3 className="text-sm font-semibold mb-3">Categories</h3>
          {categoryCounts.length > 0 ? (
            <div className="space-y-2">
              {categoryCounts.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="font-medium">{cat.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No categories</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
