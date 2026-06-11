"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";

export function useKeyboardShortcuts() {
  const { setCommandPaletteOpen } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        useUIStore.getState().setCommandPaletteOpen(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      if (e.key === "n" && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("open-new-task"));
        return;
      }

      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
        searchInput?.focus();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);
}

function isInputFocused(): boolean {
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || (active as HTMLElement).contentEditable === "true";
}
