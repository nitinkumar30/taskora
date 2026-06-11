"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/task-store";
import { useFolderStore } from "@/store/folder-store";
import { useProjectStore } from "@/store/project-store";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProductivityChart } from "@/components/dashboard/productivity-chart";
import { TaskList } from "@/components/tasks/task-list";
import { TaskModal } from "@/components/tasks/task-modal";
import { EmptyState } from "@/components/empty-state";
import { useUIStore } from "@/store/ui-store";
import { useConfetti } from "@/components/confetti";
import { Confetti } from "@/components/confetti";
import { Plus, List, Kanban, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { tasks, viewType, setViewType } = useTaskStore();
  const { folders } = useFolderStore();
  const { projects } = useProjectStore();
  const { addToast } = useUIStore();
  const { particles, fire } = useConfetti();
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    archived: tasks.filter((t) => t.status === "archived").length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length,
    productivityScore: tasks.length > 0 ? Math.round(((tasks.filter(t => t.status === "completed").length + tasks.filter(t => t.status === "in-progress").length * 0.5) / tasks.length) * 100) : 0,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100) : 0,
  };

  const viewOptions = [
    { id: "list" as const, icon: List, label: "List" },
    { id: "board" as const, icon: Kanban, label: "Board" },
    { id: "calendar" as const, icon: CalendarDays, label: "Calendar" },
  ];

  React.useEffect(() => {
    const handler = () => setTaskModalOpen(true);
    document.addEventListener("open-new-task", handler);
    return () => document.removeEventListener("open-new-task", handler);
  }, []);

  return (
    <div className="space-y-6">
      <Confetti particles={particles} />
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Good day! 👋</h2>
          <p className="text-sm text-muted-foreground">Here&apos;s your task overview</p>
        </div>
        <Button onClick={() => setTaskModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> New Task
        </Button>
      </motion.div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Tasks</h3>
            <div className="flex items-center gap-1 rounded-lg border border-border/30 p-0.5">
              {viewOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setViewType(opt.id)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewType === opt.id ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                  )}
                  aria-label={opt.label}
                >
                  <opt.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
          
          {viewType === "board" ? (
            <div className="text-sm text-muted-foreground p-8 text-center border border-dashed border-border/40 rounded-xl">
              Switch to Inbox or a specific folder/project to see the Kanban board.
            </div>
          ) : (
            <TaskList showBulkActions />
          )}
        </div>

        <div className="space-y-4">
          <ProductivityChart tasks={tasks} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4"
          >
            <h3 className="text-sm font-semibold mb-3">Quick Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Folders</span>
                <span className="text-sm font-medium">{folders.filter(f => !f.archived).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Projects</span>
                <span className="text-sm font-medium">{projects.filter(p => !p.archived).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Overdue</span>
                <span className="text-sm font-medium text-red-500">{stats.overdue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Completion</span>
                <span className="text-sm font-medium text-emerald-500">{stats.completionRate}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <TaskModal open={taskModalOpen} onOpenChange={setTaskModalOpen} />
    </div>
  );
}
