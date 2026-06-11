"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor, Trash2 } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useTaskStore } from "@/store/task-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme, addToast } = useUIStore();
  const { tasks, loadTasks } = useTaskStore();

  const themeOptions = [
    { id: "dark" as const, icon: Moon, label: "Dark" },
    { id: "light" as const, icon: Sun, label: "Light" },
    { id: "system" as const, icon: Monitor, label: "System" },
  ];

  const handleClearData = async () => {
    const tasks = await (await fetch("/api/tasks")).json();
    for (const t of tasks) {
      await fetch(`/api/tasks/${t.id}`, { method: "DELETE" });
    }
    await loadTasks();
    addToast("warning", "All data cleared", "All tasks have been permanently deleted");
  };

  return (
    <div className="max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6"
      >
        <h3 className="text-sm font-semibold mb-4">Theme</h3>
        <div className="flex items-center gap-2">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all",
                theme === opt.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 hover:border-border hover:bg-accent/50"
              )}
            >
              <opt.icon className="h-4 w-4" />
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6"
      >
        <h3 className="text-sm font-semibold mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-2">
          {[
            { keys: "N", action: "New Task" },
            { keys: "F", action: "Search" },
            { keys: "⌘K", action: "Command Palette" },
            { keys: "ESC", action: "Close Modal" },
          ].map((shortcut) => (
            <div key={shortcut.keys} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{shortcut.action}</span>
              <kbd className="px-2 py-0.5 rounded bg-muted border border-border/50 text-xs font-mono">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-6"
      >
        <h3 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">
          This will permanently delete all your data. This action cannot be undone.
        </p>
        <Button variant="destructive" size="sm" onClick={handleClearData}>
          <Trash2 className="h-4 w-4 mr-1.5" /> Clear All Data
        </Button>
      </motion.div>
    </div>
  );
}
