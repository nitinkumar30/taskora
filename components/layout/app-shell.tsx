"use client";

import * as React from "react";
import { useUIStore } from "@/store/ui-store";
import { useTaskStore } from "@/store/task-store";
import { useFolderStore } from "@/store/folder-store";
import { useProjectStore } from "@/store/project-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toasts } from "@/components/ui/toast";
import { CommandPalette } from "@/components/command-palette";
import { FloatingActions } from "@/components/floating-actions";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  useKeyboardShortcuts();

  React.useEffect(() => {
    useTaskStore.getState().loadTasks();
    useFolderStore.getState().loadFolders();
    useProjectStore.getState().loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Toasts />
      <CommandPalette />
      <FloatingActions />
    </div>
  );
}
