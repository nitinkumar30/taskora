"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { useTaskStore } from "@/store/task-store";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ProjectsPage() {
  const { projects } = useProjectStore();
  const { tasks } = useTaskStore();
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setModalOpen(true);
    document.addEventListener("open-new-project", handler);
    return () => document.removeEventListener("open-new-project", handler);
  }, []);

  if (projects.filter((p) => !p.archived).length === 0) {
    return (
      <EmptyState
        icon="🚀"
        title="Create your first project"
        description="Projects help you manage larger goals and track progress."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> New Project
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.filter((p) => !p.archived).map((project, i) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completed = projectTasks.filter((t) => t.status === "completed").length;
          const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 hover:bg-card/80 hover:border-border/60 transition-all hover:shadow-lg hover:shadow-black/5 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: project.color + "20" }}>
                    {project.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{project.name}</h3>
                    {project.description && <p className="text-xs text-muted-foreground truncate">{project.description}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{projectTasks.length} tasks</span>
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
