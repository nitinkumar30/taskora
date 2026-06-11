"use client";

import { useTaskStore } from "@/store/task-store";
import { TimelineView } from "@/components/timeline/timeline-view";
import { motion } from "framer-motion";

export default function TimelinePage() {
  const { tasks } = useTaskStore();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-semibold">Timeline</h2>
        <p className="text-sm text-muted-foreground">Visual timeline of your tasks</p>
      </motion.div>
      <TimelineView tasks={tasks} />
    </div>
  );
}
