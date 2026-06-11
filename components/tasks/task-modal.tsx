"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { useFolderStore } from "@/store/folder-store";
import { useProjectStore } from "@/store/project-store";
import { useUndoStore } from "@/store/undo-store";
import { useConfetti } from "@/components/confetti";
import { Confetti } from "@/components/confetti";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["pending", "in-progress", "completed", "archived"]),
  category: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
  color: z.string().optional(),
  tags: z.string().optional(),
  folderId: z.string().optional(),
  projectId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTask?: Task | null;
}

export function TaskModal({ open, onOpenChange, editTask }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore();
  const { addToast } = useUIStore();
  const { folders } = useFolderStore();
  const { projects } = useProjectStore();
  const { addAction } = useUndoStore();
  const { particles, fire } = useConfetti();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      category: "",
      startDate: "",
      dueDate: "",
      estimatedHours: 0,
      color: "#6366f1",
      tags: "",
      folderId: "",
      projectId: "",
    },
  });

  React.useEffect(() => {
    if (editTask) {
      reset({
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        status: editTask.status,
        category: editTask.category,
        startDate: editTask.startDate || "",
        dueDate: editTask.dueDate || "",
        estimatedHours: editTask.estimatedHours || 0,
        color: editTask.color || "#6366f1",
        tags: editTask.tags.join(", "),
        folderId: editTask.folderId || "",
        projectId: editTask.projectId || "",
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        category: "",
        startDate: "",
        dueDate: "",
        estimatedHours: 0,
        color: "#6366f1",
        tags: "",
        folderId: "",
        projectId: "",
      });
    }
  }, [editTask, reset, open]);

  const onSubmit = async (data: TaskFormData) => {
    const tags = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    if (editTask) {
      await updateTask(editTask.id, {
        title: data.title,
        description: data.description || "",
        priority: data.priority as TaskPriority,
        status: data.status as TaskStatus,
        category: data.category || "",
        startDate: data.startDate || null,
        dueDate: data.dueDate || null,
        estimatedHours: data.estimatedHours || 0,
        color: data.color || "#6366f1",
        tags,
        folderId: data.folderId || null,
        projectId: data.projectId || null,
      });
      addToast("success", "Task updated", "Changes saved successfully");
    } else {
      const newTask = await addTask({
        title: data.title,
        description: data.description || "",
        priority: data.priority as TaskPriority,
        status: data.status as TaskStatus,
        category: data.category || "",
        startDate: data.startDate || null,
        dueDate: data.dueDate || null,
        estimatedHours: data.estimatedHours || 0,
        actualHours: 0,
        color: data.color || "#6366f1",
        tags,
        favorite: false,
        archived: false,
        completedAt: null,
        folderId: data.folderId || null,
        projectId: data.projectId || null,
      });

      addAction({ type: "create", description: `Created "${data.title}"`, data: newTask });
      addToast("success", "Task created", "New task has been added");

      if (data.status === "completed") {
        fire();
      }
    }

    onOpenChange(false);
  };

  return (
    <>
      <Confetti particles={particles} />
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={editTask ? "Edit Task" : "Create Task"}
        description={editTask ? "Update task details" : "Add a new task to your list"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Enter task title" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Add a description..."
              rows={3}
              className="flex w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                {...register("priority")}
                className="flex h-10 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register("status")}
                className="flex h-10 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} placeholder="e.g., Work, Personal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input id="estimatedHours" type="number" min="0" step="0.5" {...register("estimatedHours", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" {...register("tags")} placeholder="e.g., design, frontend, urgent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folderId">Folder</Label>
              <select
                id="folderId"
                {...register("folderId")}
                className="flex h-10 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">No folder</option>
                {folders.filter((f) => !f.archived).map((f) => (
                  <option key={f.id} value={f.id}>{f.icon} {f.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
              <select
                id="projectId"
                {...register("projectId")}
                className="flex h-10 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">No project</option>
                {projects.filter((p) => !p.archived).map((p) => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register("color")}
                className="h-10 w-16 rounded-lg border border-border cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editTask ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
