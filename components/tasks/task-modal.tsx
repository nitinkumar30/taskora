"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { useFolderStore } from "@/store/folder-store";
import { useProjectStore } from "@/store/project-store";
import { useUndoStore } from "@/store/undo-store";
import { useConfetti } from "@/components/confetti";
import { Confetti } from "@/components/confetti";
import { ChevronDown, Palette } from "lucide-react";

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

const selectStyles = "flex h-10 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_8px_center] bg-no-repeat";

export function TaskModal({ open, onOpenChange, editTask }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore();
  const { addToast } = useUIStore();
  const { folders } = useFolderStore();
  const { projects } = useProjectStore();
  const { addAction } = useUndoStore();
  const { particles, fire } = useConfetti();
  const colorRef = React.useRef<HTMLInputElement>(null);
  const [currentColor, setCurrentColor] = React.useState("#6366f1");

  const {
    register,
    handleSubmit,
    reset,
    watch,
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
      setCurrentColor(editTask.color || "#6366f1");
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
      setCurrentColor("#6366f1");
    }
  }, [editTask, reset, open]);

  const watchedColor = watch("color");

  React.useEffect(() => {
    if (watchedColor) setCurrentColor(watchedColor);
  }, [watchedColor]);

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              className="flex w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <div className="relative">
                <select id="priority" {...register("priority")} className={selectStyles}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <div className="relative">
                <select id="status" {...register("status")} className={selectStyles}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DateInput id="startDate" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <DateInput id="dueDate" {...register("dueDate")} />
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
              <div className="relative">
                <select id="folderId" {...register("folderId")} className={selectStyles}>
                  <option value="">No folder</option>
                  {folders.filter((f) => !f.archived).map((f) => (
                    <option key={f.id} value={f.id}>{f.icon} {f.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
              <div className="relative">
                <select id="projectId" {...register("projectId")} className={selectStyles}>
                  <option value="">No project</option>
                  {projects.filter((p) => !p.archived).map((p) => (
                    <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  {...register("color")}
                  className="h-10 w-16 rounded-lg border border-border cursor-pointer bg-transparent p-0.5"
                  style={{ accentColor: currentColor }}
                />
              </div>
              <div
                className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center text-xs font-mono"
                style={{ backgroundColor: currentColor + "20", color: currentColor }}
              >
                <Palette className="h-4 w-4" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{currentColor}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/30">
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
