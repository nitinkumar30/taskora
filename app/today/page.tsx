"use client";

import { useTaskStore } from "@/store/task-store";
import { TaskList } from "@/components/tasks/task-list";
import { EmptyState } from "@/components/empty-state";

export default function TodayPage() {
  const { tasks } = useTaskStore();
  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter(
    (t) =>
      t.dueDate?.startsWith(today) && t.status !== "archived"
  );

  if (todayTasks.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="No tasks for today"
        description="You have nothing due today. Enjoy your day!"
      />
    );
  }

  return <TaskList tasks={todayTasks} />;
}
