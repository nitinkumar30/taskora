"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useUIStore } from "@/store/ui-store";
import { FolderModal } from "@/components/folder-project/folder-modal";
import { ProjectModal } from "@/components/folder-project/project-modal";
import { ThreeBackground } from "@/components/three-background";

export function Providers({ children }: { children: React.ReactNode }) {
  const [folderModalOpen, setFolderModalOpen] = React.useState(false);
  const [projectModalOpen, setProjectModalOpen] = React.useState(false);

  React.useEffect(() => {
    const theme = localStorage.getItem("todo-theme") || "dark";
    useUIStore.getState().setTheme(theme as "light" | "dark" | "system");

    document.addEventListener("open-new-folder", () => setFolderModalOpen(true));
    document.addEventListener("open-new-project", () => setProjectModalOpen(true));

    return () => {
      document.removeEventListener("open-new-folder", () => setFolderModalOpen(true));
      document.removeEventListener("open-new-project", () => setProjectModalOpen(true));
    };
  }, []);

  return (
    <>
      <ThreeBackground />
      <AppShell>{children}</AppShell>
      <FolderModal open={folderModalOpen} onOpenChange={setFolderModalOpen} />
      <ProjectModal open={projectModalOpen} onOpenChange={setProjectModalOpen} />
    </>
  );
}
