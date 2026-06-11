"use client";

import { useTaskStore } from "@/store/task-store";
import { TaskList } from "@/components/tasks/task-list";
import { EmptyState } from "@/components/empty-state";

export default function InboxPage() {
  const { tasks } = useTaskStore();
  const inboxTasks = tasks.filter((t) => !t.folderId && !t.projectId && !t.archived);

  if (inboxTasks.length === 0) {
    return (
      <EmptyState
        icon="📥"
        title="Inbox is empty"
        description="Tasks not assigned to a folder or project appear here."
      />
    );
  }

  return <TaskList tasks={inboxTasks} />;
}
