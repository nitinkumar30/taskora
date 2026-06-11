"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useUIStore } from "@/store/ui-store";
import { FolderModal } from "@/components/folder-project/folder-modal";
import { ProjectModal } from "@/components/folder-project/project-modal";
import { ThreeBackground } from "@/components/three-background";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserName, setUserName } from "@/lib/utils";

export function Providers({ children }: { children: React.ReactNode }) {
  const [folderModalOpen, setFolderModalOpen] = React.useState(false);
  const [projectModalOpen, setProjectModalOpen] = React.useState(false);
  const [welcomeOpen, setWelcomeOpen] = React.useState(false);
  const [userName, setLocalName] = React.useState("");

  React.useEffect(() => {
    const theme = localStorage.getItem("todo-theme") || "dark";
    useUIStore.getState().setTheme(theme as "light" | "dark" | "system");

    const name = getUserName();
    if (!name) {
      setWelcomeOpen(true);
    }

    const openFolder = () => setFolderModalOpen(true);
    const openProject = () => setProjectModalOpen(true);

    document.addEventListener("open-new-folder", openFolder);
    document.addEventListener("open-new-project", openProject);

    return () => {
      document.removeEventListener("open-new-folder", openFolder);
      document.removeEventListener("open-new-project", openProject);
    };
  }, []);

  const handleWelcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = userName.trim() || "Friend";
    setUserName(name);
    setWelcomeOpen(false);
  };

  return (
    <>
      <ThreeBackground />
      <AppShell>{children}</AppShell>
      <FolderModal open={folderModalOpen} onOpenChange={setFolderModalOpen} />
      <ProjectModal open={projectModalOpen} onOpenChange={setProjectModalOpen} />

      <Modal open={welcomeOpen} onOpenChange={setWelcomeOpen} title="Welcome to Taskora!">
        <form onSubmit={handleWelcomeSubmit} className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Let us know what to call you so we can make your experience more personal.
          </p>
          <Input
            placeholder="Your name..."
            value={userName}
            onChange={(e) => setLocalName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-border/30">
            <Button type="submit">Get Started</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
