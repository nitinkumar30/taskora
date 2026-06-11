"use client";

import { useTaskStore } from "@/store/task-store";
import { CalendarView } from "@/components/calendar/calendar-view";
import { motion } from "framer-motion";

export default function CalendarPage() {
  const { tasks } = useTaskStore();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-semibold">Calendar</h2>
        <p className="text-sm text-muted-foreground">View your tasks on a calendar</p>
      </motion.div>
      <CalendarView tasks={tasks.filter((t) => t.dueDate)} />
    </div>
  );
}
