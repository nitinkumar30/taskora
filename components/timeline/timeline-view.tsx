"use client";

import { motion } from "framer-motion";
import { Task } from "@/types";
import { cn, formatDateShort, getPriorityColor } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimelineViewProps {
  tasks: Task[];
}

export function TimelineView({ tasks }: TimelineViewProps) {
  const sortedTasks = [...tasks]
    .filter((t) => t.startDate || t.dueDate)
    .sort((a, b) => {
      const aDate = a.startDate || a.dueDate || "";
      const bDate = b.startDate || b.dueDate || "";
      return new Date(aDate).getTime() - new Date(bDate).getTime();
    });

  if (sortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-4">📅</span>
        <h3 className="text-lg font-semibold mb-2">No timeline data</h3>
        <p className="text-sm text-muted-foreground">Tasks with dates will appear here.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
      <div className="space-y-4">
        {sortedTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="relative pl-12"
          >
            <div className={cn(
              "absolute left-3 top-2 h-4 w-4 rounded-full border-2 bg-background",
              task.status === "completed" ? "border-emerald-500 bg-emerald-500/20" : "border-primary"
            )} />
            <div className="p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className={cn("text-sm font-medium", task.status === "completed" && "line-through text-muted-foreground")}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getPriorityColor(task.priority))}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {task.startDate && <span>Start: {formatDateShort(task.startDate)}</span>}
                {task.dueDate && <span>Due: {formatDateShort(task.dueDate)}</span>}
                {task.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {task.duration}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
