"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Task, TaskStatus } from "@/types";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { useConfetti } from "@/components/confetti";
import { Confetti } from "@/components/confetti";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskModal } from "@/components/tasks/task-modal";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "pending", title: "Pending", color: "border-t-amber-500/50" },
  { id: "in-progress", title: "In Progress", color: "border-t-blue-500/50" },
  { id: "completed", title: "Completed", color: "border-t-emerald-500/50" },
  { id: "archived", title: "Archived", color: "border-t-gray-500/50" },
];

export function KanbanBoard() {
  const { tasks, updateTask, toggleFavorite, deleteTask, archiveTask, toggleComplete } = useTaskStore();
  const { addToast } = useUIStore();
  const { particles, fire } = useConfetti();
  const [dragTask, setDragTask] = React.useState<Task | null>(null);
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
  });

  const getColumnTasks = (status: TaskStatus) =>
    filteredTasks.filter((t) => t.status === status);

  const handleDrop = (status: TaskStatus) => {
    if (dragTask && dragTask.status !== status) {
      updateTask(dragTask.id, {
        status,
        ...(status === "completed" ? { completedAt: new Date().toISOString(), progress: 100 } : {}),
      });
      if (status === "completed") {
        fire();
        addToast("success", "Task completed!");
      }
    }
    setDragTask(null);
  };

  return (
    <>
      <Confetti particles={particles} />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search cards on board..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full max-w-md rounded-xl border border-border/50 bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[60vh]">
        {columns.map((col) => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div
              key={col.id}
              className={cn(
                "rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm p-3 border-t-2",
                col.color
              )}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDragTask(task)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      task={task}
                      onComplete={() => {
                        toggleComplete(task.id);
                        if (task.status !== "completed") { fire(); addToast("success", "Task completed!"); }
                      }}
                      onEdit={(t) => { setEditingTask(t); setTaskModalOpen(true); }}
                      onDelete={deleteTask}
                      onFavorite={toggleFavorite}
                      onArchive={archiveTask}
                    />
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <TaskModal open={taskModalOpen} onOpenChange={(o) => { setTaskModalOpen(o); if (!o) setEditingTask(null); }} editTask={editingTask} />
    </>
  );
}
