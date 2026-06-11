"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import { useFolderStore } from "@/store/folder-store";
import { useTaskStore } from "@/store/task-store";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function FoldersPage() {
  const { folders } = useFolderStore();
  const { tasks } = useTaskStore();
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setModalOpen(true);
    document.addEventListener("open-new-folder", handler);
    return () => document.removeEventListener("open-new-folder", handler);
  }, []);

  if (folders.filter((f) => !f.archived).length === 0) {
    return (
      <EmptyState
        icon="📁"
        title="Create your first folder"
        description="Folders help you organize tasks by category."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> New Folder
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Folders</h2>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> New Folder
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.filter((f) => !f.archived).map((folder, i) => {
          const folderTasks = tasks.filter((t) => t.folderId === folder.id);
          const completed = folderTasks.filter((t) => t.status === "completed").length;
          const progress = folderTasks.length > 0 ? Math.round((completed / folderTasks.length) * 100) : 0;
          return (
            <Link key={folder.id} href={`/folders/${folder.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 hover:bg-card/80 hover:border-border/60 transition-all hover:shadow-lg hover:shadow-black/5 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{folder.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{folder.name}</h3>
                    {folder.description && <p className="text-xs text-muted-foreground">{folder.description}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{folderTasks.length} tasks</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
