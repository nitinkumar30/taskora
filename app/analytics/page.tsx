"use client";

import { useTaskStore } from "@/store/task-store";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { ProductivityChart } from "@/components/dashboard/productivity-chart";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { tasks } = useTaskStore();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Insights and metrics for your tasks</p>
      </motion.div>
      <AnalyticsView tasks={tasks} />
    </div>
  );
}
