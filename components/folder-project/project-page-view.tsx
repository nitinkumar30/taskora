"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Settings, Trash2, Archive, BarChart3 } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { TaskList } from "@/components/tasks/task-list";
import { ProjectModal } from "@/components/folder-project/project-modal";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function ProjectPageView() {
  const params = useParams();
  const router = useRouter();
  const { projects, deleteProject, archiveProject } = useProjectStore();
  const { tasks, setFilters } = useTaskStore();
  const { addToast } = useUIStore();
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const project = projects.find((p) => p.id === params.id);

  React.useEffect(() => {
    if (project) {
      setFilters({ projectId: project.id });
    }
    return () => setFilters({ projectId: null });
  }, [project, setFilters]);

  if (!project) {
    return <EmptyState title="Project not found" description="This project does not exist." />;
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedCount = projectTasks.filter((t) => t.status === "completed").length;
  const pendingCount = projectTasks.filter((t) => t.status === "pending").length;
  const inProgressCount = projectTasks.filter((t) => t.status === "in-progress").length;
  const progress = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-2xl">{project.icon}</span>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{project.name}</h1>
          {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/analytics')}>
            <BarChart3 className="h-4 w-4 mr-1" /> Analytics
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(true)}>
            <Settings className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { archiveProject(project.id); addToast("info", "Project archived"); router.push("/"); }}>
            <Archive className="h-4 w-4 mr-1" /> Archive
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { deleteProject(project.id); addToast("info", "Project deleted"); router.push("/"); }}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/40 bg-card/50 p-4 text-center">
          <span className="text-2xl font-bold">{projectTasks.length}</span>
          <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-border/40 bg-card/50 p-4 text-center">
          <span className="text-2xl font-bold text-emerald-500">{completedCount}</span>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-border/40 bg-card/50 p-4 text-center">
          <span className="text-2xl font-bold text-amber-500">{pendingCount}</span>
          <p className="text-xs text-muted-foreground mt-1">Pending</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl border border-border/40 bg-card/50 p-4 text-center">
          <span className="text-2xl font-bold text-blue-500">{inProgressCount}</span>
          <p className="text-xs text-muted-foreground mt-1">In Progress</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-xl border border-border/40 bg-card/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Project Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} />
      </motion.div>

      <TaskList tasks={projectTasks} />

      <ProjectModal open={editModalOpen} onOpenChange={setEditModalOpen} editProject={{ ...project, startDate: project.startDate || "", dueDate: project.dueDate || "" }} />
    </div>
  );
}
