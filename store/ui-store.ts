import { create } from "zustand";
import { Toast, ToastType } from "@/types";

interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  commandPaletteOpen: boolean;
  toasts: Toast[];
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  sidebarOpen: true,
  mobileSidebarOpen: false,
  commandPaletteOpen: false,
  toasts: [],

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("todo-theme", theme);
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  addToast: (type, title, message, duration = 4000) => {
    const id = Math.random().toString(36).substring(2);
    const toast: Toast = { id, type, title, message, duration };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
