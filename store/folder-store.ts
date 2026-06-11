import { create } from "zustand";
import { Folder } from "@/types";
import { generateId } from "@/lib/utils";
import { readFolders, writeFolders } from "@/utils/local-storage";

interface FolderState {
  folders: Folder[];
  loadFolders: () => Promise<void>;
  addFolder: (name: string, description?: string, color?: string, icon?: string) => Promise<Folder>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  archiveFolder: (id: string) => Promise<void>;
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

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: readFolders(),

  loadFolders: async () => {
    const local = readFolders();
    if (local.length > 0) {
      set({ folders: local });
    }
    try {
      const res = await fetch(`${BASE}/folders`);
      const server = await res.json();
      if (server.length > 0) {
        writeFolders(server);
        set({ folders: server });
      } else if (local.length > 0) {
        for (const f of local) {
          syncToAPI("/folders", "POST", f);
        }
      }
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
    const folders = [...get().folders, newFolder];
    writeFolders(folders);
    set({ folders });
    syncToAPI("/folders", "POST", newFolder);
    return newFolder;
  },

  updateFolder: async (id, updates) => {
    const folders = get().folders.map((f) =>
      f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
    );
    writeFolders(folders);
    set({ folders });
    syncToAPI(`/folders/${id}`, "PATCH", updates);
  },

  deleteFolder: async (id) => {
    const folders = get().folders.filter((f) => f.id !== id);
    writeFolders(folders);
    set({ folders });
    syncToAPI(`/folders/${id}`, "DELETE");
  },

  archiveFolder: async (id) => {
    const folders = get().folders.map((f) =>
      f.id === id ? { ...f, archived: true, updatedAt: new Date().toISOString() } : f
    );
    writeFolders(folders);
    set({ folders });
    syncToAPI(`/folders/${id}`, "PATCH", { archived: true });
  },
}));
