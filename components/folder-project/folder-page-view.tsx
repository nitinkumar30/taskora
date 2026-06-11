"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Settings, Trash2, Archive } from "lucide-react";
import { useFolderStore } from "@/store/folder-store";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { TaskList } from "@/components/tasks/task-list";
import { FolderModal } from "@/components/folder-project/folder-modal";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function FolderPageView() {
  const params = useParams();
  const router = useRouter();
  const { folders, deleteFolder, archiveFolder } = useFolderStore();
  const { tasks, setFilters, filters } = useTaskStore();
  const { addToast } = useUIStore();
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const folder = folders.find((f) => f.id === params.id);

  React.useEffect(() => {
    if (folder) {
      setFilters({ folderId: folder.id });
    }
    return () => setFilters({ folderId: null });
  }, [folder, setFilters]);

  if (!folder) {
    return <EmptyState title="Folder not found" description="This folder does not exist." />;
  }

  const folderTasks = tasks.filter((t) => t.folderId === folder.id);
  const completedCount = folderTasks.filter((t) => t.status === "completed").length;
  const progress = folderTasks.length > 0 ? Math.round((completedCount / folderTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-2xl">{folder.icon}</span>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{folder.name}</h1>
          {folder.description && <p className="text-sm text-muted-foreground">{folder.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(true)}>
            <Settings className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { archiveFolder(folder.id); addToast("info", "Folder archived"); router.push("/"); }}>
            <Archive className="h-4 w-4 mr-1" /> Archive
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { deleteFolder(folder.id); addToast("info", "Folder deleted"); router.push("/"); }}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card/50">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="text-center px-4">
          <span className="text-2xl font-bold">{folderTasks.length}</span>
          <p className="text-xs text-muted-foreground">Tasks</p>
        </div>
        <div className="text-center px-4">
          <span className="text-2xl font-bold text-emerald-500">{completedCount}</span>
          <p className="text-xs text-muted-foreground">Done</p>
        </div>
      </motion.div>

      <TaskList tasks={folderTasks} />

      <FolderModal open={editModalOpen} onOpenChange={setEditModalOpen} editFolder={folder} />
    </div>
  );
}
