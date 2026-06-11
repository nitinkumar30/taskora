"use client";

import { useTaskStore } from "@/store/task-store";
import { TaskList } from "@/components/tasks/task-list";
import { EmptyState } from "@/components/empty-state";

export default function FavoritesPage() {
  const { tasks } = useTaskStore();
  const favoriteTasks = tasks.filter((t) => t.favorite && !t.archived);

  if (favoriteTasks.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="No favorites"
        description="Star your important tasks to access them quickly."
      />
    );
  }

  return <TaskList tasks={favoriteTasks} />;
}
