"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderPlus, Rocket, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [isOpen, setIsOpen] = React.useState(false);

  const actions = [
    { icon: Plus, label: "New Task", color: "from-indigo-500 to-purple-600", event: "open-new-task" },
    { icon: FolderPlus, label: "New Folder", color: "from-emerald-500 to-teal-600", event: "open-new-folder" },
    { icon: Rocket, label: "New Project", color: "from-orange-500 to-pink-600", event: "open-new-project" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ delay: i * 0.05, duration: 0.15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r shadow-lg text-white text-sm font-medium",
              action.color
            )}
            onClick={() => {
              document.dispatchEvent(new CustomEvent(action.event));
              setIsOpen(false);
            }}
          >
            <action.icon className="h-4 w-4" />
            <span>{action.label}</span>
          </motion.button>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25 flex items-center justify-center text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close actions" : "Open actions"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
