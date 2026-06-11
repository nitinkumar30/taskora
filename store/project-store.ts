import { create } from "zustand";
import { Project } from "@/types";
import { generateId } from "@/lib/utils";

interface ProjectState {
  projects: Project[];
  loadProjects: () => Promise<void>;
  addProject: (name: string, description?: string, color?: string, icon?: string) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
}

const BASE = "/api";

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],

  loadProjects: async () => {
    try {
      const res = await fetch(`${BASE}/projects`);
      const projects = await res.json();
      set({ projects });
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
    const res = await fetch(`${BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });
    const projects = await res.json();
    set({ projects });
    return newProject;
  },

  updateProject: async (id, updates) => {
    const res = await fetch(`${BASE}/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const projects = await res.json();
    set({ projects });
  },

  deleteProject: async (id) => {
    const res = await fetch(`${BASE}/projects/${id}`, { method: "DELETE" });
    const projects = await res.json();
    set({ projects });
  },

  archiveProject: async (id) => {
    const res = await fetch(`${BASE}/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    const projects = await res.json();
    set({ projects });
  },
}));
