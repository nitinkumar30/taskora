export type TaskStatus = "pending" | "in-progress" | "completed" | "archived";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  startDate: string | null;
  dueDate: string | null;
  duration: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  tags: string[];
  category: string;
  color: string;
  favorite: boolean;
  archived: boolean;
  folderId: string | null;
  projectId: string | null;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  taskCount: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  startDate: string | null;
  dueDate: string | null;
  progress: number;
  archived: boolean;
  taskCount: number;
}

export type UndoAction = {
  id: string;
  type: "create" | "update" | "delete" | "archive" | "restore" | "bulk";
  description: string;
  timestamp: number;
  data: any;
};

export type ViewType = "list" | "board" | "calendar" | "timeline";

export type SortField = "createdAt" | "dueDate" | "priority" | "title" | "duration";

export type SortDirection = "asc" | "desc";

export interface FilterOptions {
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  category: string;
  search: string;
  favorite: boolean | null;
  overdue: boolean | null;
  folderId: string | null;
  projectId: string | null;
  sortField: SortField;
  sortDirection: SortDirection;
  tags: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  archived: number;
  overdue: number;
  productivityScore: number;
  completionRate: number;
}

export interface ProjectInsights {
  completionPercentage: number;
  estimatedCompletionDate: string;
  remainingHours: number;
  overdueTasks: number;
  priorityBreakdown: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
