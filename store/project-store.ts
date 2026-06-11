import { create } from "zustand";
import { Project } from "@/types";
import { generateId } from "@/lib/utils";
import { readProjects, writeProjects } from "@/utils/local-storage";

interface ProjectState {
  projects: Project[];
  loadProjects: () => Promise<void>;
  addProject: (name: string, description?: string, color?: string, icon?: string) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
}

const BASE = "/api";

async function syncToAPI(endpoint: string, method: string, body?: any): Promise<void> {
  try {
    await fetch(`${BASE}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {}
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: readProjects(),

  loadProjects: async () => {
    const local = readProjects();
    if (local.length > 0) {
      set({ projects: local });
    }
    try {
      const res = await fetch(`${BASE}/projects`);
      const server = await res.json();
      if (server.length > 0) {
        writeProjects(server);
        set({ projects: server });
      } else if (local.length > 0) {
        for (const p of local) {
          syncToAPI("/projects", "POST", p);
        }
      }
    } catch {}
  },

  addProject: async (name, description = "", color = "#8b5cf6", icon = "🚀") => {
    const now = new Date().toISOString();
    const newProject: Project = {
      id: generateId(),
      name,
      description,
      status: "active",
      color,
      icon,
      createdAt: now,
      updatedAt: now,
      startDate: null,
      dueDate: null,
      progress: 0,
      archived: false,
      taskCount: 0,
    };
    const projects = [...get().projects, newProject];
    writeProjects(projects);
    set({ projects });
    syncToAPI("/projects", "POST", newProject);
    return newProject;
  },

  updateProject: async (id, updates) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    writeProjects(projects);
    set({ projects });
    syncToAPI(`/projects/${id}`, "PATCH", updates);
  },

  deleteProject: async (id) => {
    const projects = get().projects.filter((p) => p.id !== id);
    writeProjects(projects);
    set({ projects });
    syncToAPI(`/projects/${id}`, "DELETE");
  },

  archiveProject: async (id) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, archived: true, updatedAt: new Date().toISOString() } : p
    );
    writeProjects(projects);
    set({ projects });
    syncToAPI(`/projects/${id}`, "PATCH", { archived: true });
  },
}));
