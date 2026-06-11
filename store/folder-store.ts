import { create } from "zustand";
import { Folder } from "@/types";
import { generateId } from "@/lib/utils";

interface FolderState {
  folders: Folder[];
  loadFolders: () => Promise<void>;
  addFolder: (name: string, description?: string, color?: string, icon?: string) => Promise<Folder>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  archiveFolder: (id: string) => Promise<void>;
}

const BASE = "/api";

export const useFolderStore = create<FolderState>((set) => ({
  folders: [],

  loadFolders: async () => {
    try {
      const res = await fetch(`${BASE}/folders`);
      const folders = await res.json();
      set({ folders });
    } catch {}
  },

  addFolder: async (name, description = "", color = "#6366f1", icon = "📁") => {
    const now = new Date().toISOString();
    const newFolder: Folder = {
      id: generateId(),
      name,
      description,
      color,
      icon,
      createdAt: now,
      updatedAt: now,
      archived: false,
      taskCount: 0,
    };
    const res = await fetch(`${BASE}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFolder),
    });
    const folders = await res.json();
    set({ folders });
    return newFolder;
  },

  updateFolder: async (id, updates) => {
    const res = await fetch(`${BASE}/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const folders = await res.json();
    set({ folders });
  },

  deleteFolder: async (id) => {
    const res = await fetch(`${BASE}/folders/${id}`, { method: "DELETE" });
    const folders = await res.json();
    set({ folders });
  },

  archiveFolder: async (id) => {
    const res = await fetch(`${BASE}/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    const folders = await res.json();
    set({ folders });
  },
}));
