"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFolderStore } from "@/store/folder-store";
import { useUIStore } from "@/store/ui-store";
import { Palette } from "lucide-react";

interface FolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editFolder?: { id: string; name: string; description: string; color: string; icon: string } | null;
}

const folderIcons = ["📁", "📂", "🎓", "💼", "💰", "🏠", "🚀", "💻", "🎨", "📊", "❤️", "⭐", "🎯", "📝", "🏆"];

export function FolderModal({ open, onOpenChange, editFolder }: FolderModalProps) {
  const { addFolder, updateFolder } = useFolderStore();
  const { addToast } = useUIStore();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [color, setColor] = React.useState("#6366f1");
  const [icon, setIcon] = React.useState("📁");

  React.useEffect(() => {
    if (editFolder) {
      setName(editFolder.name);
      setDescription(editFolder.description);
      setColor(editFolder.color);
      setIcon(editFolder.icon);
    } else {
      setName("");
      setDescription("");
      setColor("#6366f1");
      setIcon("📁");
    }
  }, [editFolder, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editFolder) {
      updateFolder(editFolder.id, { name, description, color, icon });
      addToast("success", "Folder updated");
    } else {
      addFolder(name, description, color, icon);
      addToast("success", "Folder created");
    }
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={editFolder ? "Edit Folder" : "Create Folder"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="folder-name">Name</Label>
          <Input id="folder-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Folder name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="folder-desc">Description</Label>
          <Input id="folder-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
        </div>
        <div className="space-y-2">
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-2">
            {folderIcons.map((ic) => (
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
          <Button type="submit">{editFolder ? "Save" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}
