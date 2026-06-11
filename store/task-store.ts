import { create } from "zustand";
import { Task, TaskStatus, TaskPriority, FilterOptions, SortField } from "@/types";
import { calculateDuration } from "@/utils/duration";
import { generateId } from "@/lib/utils";

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

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  viewType: "list",
  filters: defaultFilters,
  selectedTasks: [],
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${BASE}/tasks`);
      const tasks = await res.json();
      set({ tasks, isLoading: false });
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
    const res = await fetch(`${BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    const tasks = await res.json();
    set({ tasks });
    get().applyFilters();
    return newTask;
  },

  updateTask: async (id, updates) => {
    const currentTask = get().tasks.find((t) => t.id === id);
    if (!currentTask) return;
    
    const startDate = updates.startDate ?? currentTask.startDate;
    const dueDate = updates.dueDate ?? currentTask.dueDate;
    if (updates.startDate || updates.dueDate) {
      updates.duration = calculateDuration(startDate, dueDate);
    }
    
    const res = await fetch(`${BASE}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const tasks = await res.json();
    set({ tasks });
    get().applyFilters();
  },

  deleteTask: async (id) => {
    const res = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
    const tasks = await res.json();
    set({ tasks });
    get().applyFilters();
  },

  toggleComplete: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const isCompleted = task.status === "completed";
    await get().updateTask(id, {
      status: isCompleted ? "pending" : "completed",
      completedAt: isCompleted ? null : new Date().toISOString(),
      progress: isCompleted ? 0 : 100,
    });
  },

  toggleFavorite: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    await get().updateTask(id, { favorite: !task.favorite });
  },

  archiveTask: async (id) => {
    await get().updateTask(id, { status: "archived", archived: true });
  },

  restoreTask: async (id) => {
    const res = await fetch(`${BASE}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: false, status: "pending" }),
    });
    const tasks = await res.json();
    set({ tasks });
    get().applyFilters();
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
    const res = await fetch(`${BASE}/tasks/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedTasks, updates: { status: "completed", completedAt: new Date().toISOString(), progress: 100 } }),
    });
    const tasks = await res.json();
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
  },

  bulkDelete: async () => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const res = await fetch(`${BASE}/tasks/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedTasks }),
    });
    const tasks = await res.json();
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
  },

  bulkArchive: async () => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const res = await fetch(`${BASE}/tasks/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedTasks, updates: { status: "archived", archived: true } }),
    });
    const tasks = await res.json();
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
  },

  bulkChangePriority: async (priority) => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const res = await fetch(`${BASE}/tasks/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedTasks, updates: { priority } }),
    });
    const tasks = await res.json();
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
  },

  bulkMoveToFolder: async (folderId) => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const res = await fetch(`${BASE}/tasks/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedTasks, updates: { folderId } }),
    });
    const tasks = await res.json();
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
  },

  bulkMoveToProject: async (projectId) => {
    const { selectedTasks } = get();
    if (selectedTasks.length === 0) return;
    const res = await fetch(`${BASE}/tasks/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedTasks, updates: { projectId } }),
    });
    const tasks = await res.json();
    set({ tasks, selectedTasks: [] });
    get().applyFilters();
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
