"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project-store";
import { useUIStore } from "@/store/ui-store";
import { Palette } from "lucide-react";

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProject?: { id: string; name: string; description: string; color: string; icon: string; startDate: string; dueDate: string } | null;
}

const projectIcons = ["🚀", "📱", "🌐", "🎯", "🎨", "📊", "⚡", "🛠️", "🎮", "📝", "🏗️", "💡", "🔬", "📈", "🤖"];

export function ProjectModal({ open, onOpenChange, editProject }: ProjectModalProps) {
  const { addProject, updateProject } = useProjectStore();
  const { addToast } = useUIStore();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [color, setColor] = React.useState("#8b5cf6");
  const [icon, setIcon] = React.useState("🚀");
  const [startDate, setStartDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");

  React.useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setDescription(editProject.description);
      setColor(editProject.color);
      setIcon(editProject.icon);
      setStartDate(editProject.startDate || "");
      setDueDate(editProject.dueDate || "");
    } else {
      setName("");
      setDescription("");
      setColor("#8b5cf6");
      setIcon("🚀");
      setStartDate("");
      setDueDate("");
    }
  }, [editProject, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editProject) {
      updateProject(editProject.id, { name, description, color, icon, startDate: startDate || null, dueDate: dueDate || null });
      addToast("success", "Project updated");
    } else {
      addProject(name, description, color, icon);
      addToast("success", "Project created");
    }
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={editProject ? "Edit Project" : "Create Project"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="project-name">Name</Label>
          <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-desc">Description</Label>
          <Input id="project-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project-start">Start Date</Label>
            <DateInput id="project-start" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-due">Due Date</Label>
            <DateInput id="project-due" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-2">
            {projectIcons.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                  icon === ic ? "bg-primary/20 ring-2 ring-primary scale-110" : "hover:bg-accent/50 hover:scale-105"
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-16 rounded-lg border border-border cursor-pointer bg-transparent p-0.5"
            />
            <div className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center" style={{ backgroundColor: color + "20" }}>
              <Palette className="h-4 w-4" style={{ color }} />
            </div>
            <span className="text-xs text-muted-foreground font-mono">{color}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border/30">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit">{editProject ? "Save" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}
