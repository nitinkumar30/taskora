import { create } from "zustand";
import { Task, TaskStatus, TaskPriority, FilterOptions, SortField } from "@/types";
import { calculateDuration } from "@/utils/duration";
import { generateId } from "@/lib/utils";
import { readTasks, writeTasks } from "@/utils/local-storage";

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  viewType: "list" | "board" | "calendar" | "timeline";
  filters: FilterOptions;
  selectedTasks: string[];
  isLoading: boolean;
  
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "duration" | "progress">) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  archiveTask: (id: string) => Promise<void>;
  restoreTask: (id: string) => Promise<void>;
  setViewType: (view: "list" | "board" | "calendar" | "timeline") => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  selectTask: (id: string) => void;
  deselectTask: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  bulkComplete: () => Promise<void>;
  bulkDelete: () => Promise<void>;
  bulkArchive: () => Promise<void>;
  bulkChangePriority: (priority: TaskPriority) => Promise<void>;
  bulkMoveToFolder: (folderId: string | null) => Promise<void>;
  bulkMoveToProject: (projectId: string | null) => Promise<void>;
  applyFilters: () => void;
}

const defaultFilters: FilterOptions = {
  status: "all",
  priority: "all",
  category: "",
  search: "",
  favorite: null,
  overdue: null,
  folderId: null,
  projectId: null,
  sortField: "createdAt",
  sortDirection: "desc",
  tags: [],
};

const BASE = "/api";

async function syncToAPI(endpoint: string, method: string, body?: any): Promise<void> {
  try {
    await fetch(`${BASE}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // API sync is best-effort; localStorage is the source of truth
  }
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: readTasks(),
  filteredTasks: [],
  viewType: "list",
  filters: defaultFilters,
  selectedTasks: [],
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    const local = readTasks();
    if (local.length > 0) {
      set({ tasks: local, isLoading: false });
      get().applyFilters();
    }
    try {
      const res = await fetch(`${BASE}/tasks`);
      const server = await res.json();
      if (server.length > 0) {
        writeTasks(server);
        set({ tasks: server, isLoading: false });
      } else if (local.length > 0) {
        syncToAPI("/tasks/bulk", "PATCH", { ids: local.map((t: Task) => t.id), updates: {} });
        for (const t of local) {
          syncToAPI("/tasks", "POST", t);
        }
      }
      get().applyFilters();
    } catch {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const now = new Date().toISOString();
    const duration = calculateDuration(taskData.startDate, taskData.dueDate);
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      duration,
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };
    const tasks = [...get().tasks, newTask];
    writeTasks(tasks);
    set({ tasks });
    get().applyFilters();
    syncToAPI("/tasks", "POST", newTask);
    return newTask;
  },

  updateTask: async (id, updates) => {
    const tasks = get().tasks.map((t) => {
      if (t.id !== id) return t;
      const startDate = updates.startDate ?? t.startDate;
      const dueDate = updates.dueDate ?? t.dueDate;
      const duration = updates.startDate || updates.dueDate ? calculateDuration(startDate, dueDate) : t.duration;
      return { ...t, ...updates, duration, updatedAt: new Date().toISOString() };
    });
    writeTasks(tasks);
    set({ tasks });
    get().applyFilters();
    syncToAPI(`/tasks/${id}`, "PATCH", updates);
  },

  deleteTask: async (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id);
    writeTasks(tasks);
    set({ tasks });
    get().applyFilters();
    syncToAPI(`/tasks/${id}`, "DELETE");
  },

  toggleComplete: async (id) => {
    const tasks = get().tasks.map((t) => {
      if (t.id !== id) return t;
      const isCompleted = t.status === "completed";
      return {
        ...t,
        status: isCompleted ? "pending" as TaskStatus : "completed" as TaskStatus,
        completedAt: isCompleted ? null : new Date().toISOString(),
        progress: isCompleted ? 0 : 100,
        updatedAt: new Date().toISOString(),
      };
    });
    writeTasks(tasks);
    set({ tasks });
    get().applyFilters();
    const task = tasks.find((t) => t.id === id);
    if (task) syncToAPI(`/tasks/${id}`, "PATCH", { status: task.status, completedAt: task.completedAt, progress: task.progress });
  },

  toggleFavorite: async (id) => {
    const tasks = get().tasks.map((t) => {
      if (t.id !== id) return t;
      return { ...t, favorite: !t.favorite, updatedAt: new Date().toISOString() };
    });
    writeTasks(tasks);
    set({ tasks });
    get().applyFilters();
    const task = tasks.find((t) => t.id === id);
    if (task) syncToAPI(`/tasks/${id}`, "PATCH", { favorite: task.favorite });
  },

  archiveTask: async (id) => {
    const tasks = get().tasks.map((t) => {
      if (t.id !== id) return t;
      return { ...t, status: "archived" as TaskStatus, archived: true, updatedAt: new Date().toISOString() };
    });
    writeTasks(tasks);
    set({ tasks });
    get().applyFilters();
    syncToAPI(`/tasks/${id}`, "PATCH", { status: "archived", archived: true });
  },

  restoreTask: async (id) => {
    const tasks = get().tasks.map((t) => {
      if (t.id !== id) return t;
      return { ...t, archived: false, status: "pending" as TaskStatus, updatedAt: new Date().toISOString() };
    });
    writeTasks(tasks);
    set({ tasks });
    get().applyFilters();
    syncToAPI(`/tasks/${id}`, "PATCH", { archived: false, status: "pending" });
  },

  setViewType: (view) => set({ viewType: view }),

  setFilters: (filterUpdates) => {
    set((state) => ({ filters: { ...state.filters, ...filterUpdates } }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().applyFilters();
  },

  selectTask: (id) => {
    set((state) => ({
      selectedTasks: state.selectedTasks.includes(id)
        ? state.selectedTasks.filter((tid) => tid !== id)
        : [...state.selectedTasks, id],
    }));
  },

  deselectTask: (id) => {
    set((state) => ({
      selectedTasks: state.selectedTasks.filter((tid) => tid !== id),
    }));
  },

  selectAll: () => {
    set((state) => ({
      selectedTasks: state.filteredTasks.map((t) => t.id),
    }));
  },

  clearSelection: () => set({ selectedTasks: [] }),

  bulkComplete: async () => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const now = new Date().toISOString();
    const tasks = get().tasks.map((t) => {
      if (!selectedTasks.includes(t.id)) return t;
      return { ...t, status: "completed" as TaskStatus, completedAt: now, progress: 100, updatedAt: now };
    });
    writeTasks(tasks);
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
    syncToAPI("/tasks/bulk", "PATCH", { ids: selectedTasks, updates: { status: "completed", completedAt: now, progress: 100 } });
  },

  bulkDelete: async () => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const tasks = get().tasks.filter((t) => !selectedTasks.includes(t.id));
    writeTasks(tasks);
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
    syncToAPI("/tasks/bulk", "DELETE", { ids: selectedTasks });
  },

  bulkArchive: async () => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const now = new Date().toISOString();
    const tasks = get().tasks.map((t) => {
      if (!selectedTasks.includes(t.id)) return t;
      return { ...t, status: "archived" as TaskStatus, archived: true, updatedAt: now };
    });
    writeTasks(tasks);
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
    syncToAPI("/tasks/bulk", "PATCH", { ids: selectedTasks, updates: { status: "archived", archived: true } });
  },

  bulkChangePriority: async (priority) => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const now = new Date().toISOString();
    const tasks = get().tasks.map((t) => {
      if (!selectedTasks.includes(t.id)) return t;
      return { ...t, priority, updatedAt: now };
    });
    writeTasks(tasks);
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
    syncToAPI("/tasks/bulk", "PATCH", { ids: selectedTasks, updates: { priority } });
  },

  bulkMoveToFolder: async (folderId) => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const now = new Date().toISOString();
    const tasks = get().tasks.map((t) => {
      if (!selectedTasks.includes(t.id)) return t;
      return { ...t, folderId, updatedAt: now };
    });
    writeTasks(tasks);
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
    syncToAPI("/tasks/bulk", "PATCH", { ids: selectedTasks, updates: { folderId } });
  },

  bulkMoveToProject: async (projectId) => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const now = new Date().toISOString();
    const tasks = get().tasks.map((t) => {
      if (!selectedTasks.includes(t.id)) return t;
      return { ...t, projectId, updatedAt: now };
    });
    writeTasks(tasks);
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
    syncToAPI("/tasks/bulk", "PATCH", { ids: selectedTasks, updates: { projectId } });
  },

  applyFilters: () => {
    const { tasks, filters } = get();
    let filtered = [...tasks];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters.priority !== "all") {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.favorite !== null) {
      filtered = filtered.filter((t) => t.favorite === filters.favorite);
    }

    if (filters.overdue !== null) {
      const now = new Date();
      filtered = filtered.filter((t) => {
        if (!t.dueDate) return false;
        return filters.overdue ? new Date(t.dueDate) < now && t.status !== "completed" : new Date(t.dueDate) >= now;
      });
    }

    if (filters.folderId !== null) {
      filtered = filtered.filter((t) => t.folderId === filters.folderId);
    }

    if (filters.projectId !== null) {
      filtered = filtered.filter((t) => t.projectId === filters.projectId);
    }

    const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortField) {
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "dueDate": {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = aDate - bDate;
          break;
        }
        case "priority":
          comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "duration": {
          const aDur = a.duration ? parseInt(a.duration) : 0;
          const bDur = b.duration ? parseInt(b.duration) : 0;
          comparison = aDur - bDur;
          break;
        }
      }
      return filters.sortDirection === "asc" ? comparison : -comparison;
    });

    set({ filteredTasks: filtered });
  },
}));
