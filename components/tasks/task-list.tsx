"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/types";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { useUndoStore } from "@/store/undo-store";
import { useConfetti } from "@/components/confetti";
import { Confetti } from "@/components/confetti";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskModal } from "@/components/tasks/task-modal";
import { EmptyState } from "@/components/empty-state";
import { TaskSkeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteTask, restoreTask } from "@/utils/json-storage";

interface TaskListProps {
  tasks?: Task[];
  showBulkActions?: boolean;
}

export function TaskList({ tasks: propTasks, showBulkActions = true }: TaskListProps) {
  const {
    filteredTasks,
    toggleComplete,
    deleteTask: storeDeleteTask,
    toggleFavorite,
    archiveTask,
    selectTask,
    selectedTasks,
    selectAll,
    clearSelection,
    isLoading,
    loadTasks,
  } = useTaskStore();
  const { addToast } = useUIStore();
  const { addAction } = useUndoStore();
  const { particles, fire } = useConfetti();
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const tasks = propTasks || filteredTasks;

  const handleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    toggleComplete(id);
    if (task && task.status !== "completed") {
      fire();
      addToast("success", "Task completed!", "Great work!");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    storeDeleteTask(id);
    addAction({ type: "delete", description: `Deleted "${task?.title}"`, data: task });
    addToast("info", "Task deleted", "Use Ctrl+Z to undo");
  };

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const handleArchive = (id: string) => {
    archiveTask(id);
    addToast("info", "Task archived");
  };

  React.useEffect(() => {
    const handler = () => {
      setEditingTask(null);
      setTaskModalOpen(true);
    };
    document.addEventListener("open-new-task", handler);
    return () => document.removeEventListener("open-new-task", handler);
  }, []);

  const toggleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    );
  }

  return (
    <>
      <Confetti particles={particles} />
      <TaskFilters />
      
      {showBulkActions && selectedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-2 mb-3 rounded-xl bg-primary/10 border border-primary/20"
        >
          <span className="text-sm font-medium">{selectedTasks.length} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => { useTaskStore.getState().bulkComplete(); fire(); }} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-colors">
              Complete
            </button>
            <button onClick={() => useTaskStore.getState().bulkArchive()} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors">
              Archive
            </button>
            <button onClick={() => useTaskStore.getState().bulkDelete()} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
              Delete
            </button>
            <button onClick={clearSelection} className="text-xs px-3 py-1.5 rounded-lg hover:bg-accent/50 transition-colors">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {tasks.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          {showBulkActions && (
            <Checkbox
              checked={selectedTasks.length === tasks.length && tasks.length > 0}
              onCheckedChange={toggleSelectAll}
              aria-label="Select all tasks"
            />
          )}
          <span className="text-xs text-muted-foreground">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2">
                {showBulkActions && (
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={() => selectTask(task.id)}
                    aria-label={`Select ${task.title}`}
                  />
                )}
                <div className="flex-1">
                  <TaskCard
                    task={task}
                    onComplete={handleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onFavorite={handleFavorite}
                    onArchive={handleArchive}
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No tasks found"
              description="Create a new task to get started or adjust your filters."
              action={
                <button
                  onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
                >
                  Create Task
                </button>
              }
            />
          )}
        </AnimatePresence>
      </div>

      <TaskModal
        open={taskModalOpen}
        onOpenChange={(open) => {
          setTaskModalOpen(open);
          if (!open) setEditingTask(null);
        }}
        editTask={editingTask}
      />
    </>
  );
}
