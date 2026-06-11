import { create } from "zustand";
import { UndoAction } from "@/types";

interface UndoState {
  actions: UndoAction[];
  addAction: (action: Omit<UndoAction, "id" | "timestamp">) => void;
  undo: () => UndoAction | null;
  clearActions: () => void;
}

export const useUndoStore = create<UndoState>((set, get) => ({
  actions: [],

  addAction: (action) => {
    const newAction: UndoAction = {
      ...action,
      id: Math.random().toString(36).substring(2),
      timestamp: Date.now(),
    };
    set((state) => ({
      actions: [...state.actions, newAction].slice(-20),
    }));
    setTimeout(() => {
      set((state) => ({
        actions: state.actions.filter((a) => a.id !== newAction.id),
      }));
    }, 10000);
  },

  undo: () => {
    const { actions } = get();
    if (actions.length === 0) return null;
    const lastAction = actions[actions.length - 1];
    set((state) => ({
      actions: state.actions.slice(0, -1),
    }));
    return lastAction;
  },

  clearActions: () => set({ actions: [] }),
}));
