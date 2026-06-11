"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  FolderPlus,
  Rocket,
  Archive,
  Settings,
  Calendar,
  BarChart3,
  LayoutDashboard,
  Command,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [search, setSearch] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { id: "new-task", label: "Create Task", description: "Add a new task", icon: Plus, action: () => { document.dispatchEvent(new CustomEvent("open-new-task")); }, shortcut: "N" },
    { id: "new-folder", label: "Create Folder", description: "Add a new folder", icon: FolderPlus, action: () => { document.dispatchEvent(new CustomEvent("open-new-folder")); } },
    { id: "new-project", label: "Create Project", description: "Add a new project", icon: Rocket, action: () => { document.dispatchEvent(new CustomEvent("open-new-project")); } },
    { id: "dashboard", label: "Dashboard", description: "Go to dashboard", icon: LayoutDashboard, action: () => router.push("/") },
    { id: "calendar", label: "Calendar", description: "Open calendar view", icon: Calendar, action: () => router.push("/calendar") },
    { id: "analytics", label: "Analytics", description: "View analytics", icon: BarChart3, action: () => router.push("/analytics") },
    { id: "archive", label: "Archive", description: "View archived tasks", icon: Archive, action: () => router.push("/archive") },
    { id: "settings", label: "Settings", description: "Open settings", icon: Settings, action: () => router.push("/settings") },
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    if (commandPaletteOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
      setCommandPaletteOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh]"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
              <Command className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border/50 text-muted-foreground">ESC</kbd>
            </div>

            <div className="p-2 max-h-72 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-100",
                      i === selectedIndex ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/50"
                    )}
                    onClick={() => { cmd.action(); setCommandPaletteOpen(false); }}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <cmd.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 text-left">
                      <span className="font-medium">{cmd.label}</span>
                      {cmd.description && (
                        <span className="text-muted-foreground ml-2">— {cmd.description}</span>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border/50">{cmd.shortcut}</kbd>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
