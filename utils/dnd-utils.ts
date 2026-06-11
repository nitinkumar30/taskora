import { Task, TaskStatus } from "@/types";

export const STATUS_ORDER: TaskStatus[] = ["pending", "in-progress", "completed", "archived"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
};

export function getTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const grouped: Record<TaskStatus, Task[]> = {
    pending: [],
    "in-progress": [],
    completed: [],
    archived: [],
  };
  
  tasks.forEach((task) => {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  });
  
  return grouped;
}

export function filterTasks(tasks: Task[], search: string): Task[] {
  if (!search.trim()) return tasks;
  const q = search.toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
