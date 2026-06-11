"use client";

import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { TaskList } from "@/components/tasks/task-list";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function ArchivePage() {
  const { tasks, restoreTask, loadTasks } = useTaskStore();
  const { addToast } = useUIStore();
  const archivedTasks = tasks.filter((t) => t.status === "archived");

  const handleRestoreAll = async () => {
    for (const t of archivedTasks) {
      await restoreTask(t.id);
    }
    addToast("success", "All tasks restored");
  };

  if (archivedTasks.length === 0) {
    return (
      <EmptyState
        icon="🗄️"
        title="Archive is empty"
        description="Archived tasks will appear here."
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{archivedTasks.length} archived tasks</span>
        <Button variant="outline" size="sm" onClick={handleRestoreAll}>
          Restore All
        </Button>
      </div>
      <TaskList tasks={archivedTasks} showBulkActions={false} />
    </div>
  );
}
