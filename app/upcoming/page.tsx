"use client";

import { useTaskStore } from "@/store/task-store";
import { TaskList } from "@/components/tasks/task-list";
import { EmptyState } from "@/components/empty-state";

export default function UpcomingPage() {
  const { tasks } = useTaskStore();
  const today = new Date();
  const upcomingTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === "archived" || t.status === "completed") return false;
    return new Date(t.dueDate) > today;
  }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  if (upcomingTasks.length === 0) {
    return (
      <EmptyState
        icon="📆"
        title="No upcoming tasks"
        description="You have no upcoming deadlines."
      />
    );
  }

  return <TaskList tasks={upcomingTasks} />;
}
