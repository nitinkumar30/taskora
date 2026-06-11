"use client";

import { useTaskStore } from "@/store/task-store";
import { TaskList } from "@/components/tasks/task-list";
import { EmptyState } from "@/components/empty-state";

export default function CompletedPage() {
  const { tasks } = useTaskStore();
  const completedTasks = tasks.filter((t) => t.status === "completed");

  if (completedTasks.length === 0) {
    return (
      <EmptyState
        icon="✅"
        title="No completed tasks"
        description="Complete some tasks to see them here."
      />
    );
  }

  return <TaskList tasks={completedTasks} />;
}
