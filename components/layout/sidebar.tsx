"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  Clock,
  CheckCircle2,
  Star,
  Archive,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  FolderOpen,
  Plus,
  Ellipsis,
  Command,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { useFolderStore } from "@/store/folder-store";
import { useProjectStore } from "@/store/project-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/inbox", icon: Inbox, label: "Inbox" },
  { href: "/today", icon: Clock, label: "Today" },
  { href: "/upcoming", icon: Calendar, label: "Upcoming" },
  { href: "/completed", icon: CheckCircle2, label: "Completed" },
  { href: "/favorites", icon: Star, label: "Favorites" },
];

const bottomItems = [
  { href: "/archive", icon: Archive, label: "Archive" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setCommandPaletteOpen } = useUIStore();
  const { folders } = useFolderStore();
  const { projects } = useProjectStore();

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border/40 bg-sidebar/80 backdrop-blur-xl flex flex-col transition-colors",
        sidebarOpen ? "w-64" : "w-16"
      )}
      animate={{ width: sidebarOpen ? 256 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between h-14 px-4 border-b border-border/30">
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg viewBox="0 0 128 128" className="h-5 w-5 text-white">
                <path d="M48 36h32v6H70v50h-6V42H48z" fill="currentColor" transform="translate(0,2)"/>
                <path d="M50 72l8 8 20-20" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,2)"/>
              </svg>
            </div>
            <span className="font-semibold text-sm bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Taskora</span>
          </motion.div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors",
            !sidebarOpen && "mx-auto"
          )}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                    isActive
                      ? "text-foreground bg-accent/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  )}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && (
                    <span>{item.label}</span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {sidebarOpen && (
          <>
            <div className="mt-6 mb-2 px-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Folders</span>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent("open-new-folder"))}
                className="h-5 w-5 rounded flex items-center justify-center hover:bg-accent/50 transition-colors"
                aria-label="Add folder"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-0.5">
              {folders.filter((f) => !f.archived).map((folder) => (
                <Link key={folder.id} href={`/folders/${folder.id}`}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      pathname === `/folders/${folder.id}`
                        ? "text-foreground bg-accent/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    )}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base">{folder.icon || "📁"}</span>
                    <span className="flex-1 truncate">{folder.name}</span>
                    {folder.taskCount > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                        {folder.taskCount}
                      </span>
                    )}
                  </motion.div>
                </Link>
              ))}
              {folders.filter((f) => !f.archived).length === 0 && (
                <p className="px-3 text-xs text-muted-foreground">No folders yet</p>
              )}
            </div>

            <div className="mt-6 mb-2 px-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</span>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent("open-new-project"))}
                className="h-5 w-5 rounded flex items-center justify-center hover:bg-accent/50 transition-colors"
                aria-label="Add project"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-0.5">
              {projects.filter((p) => !p.archived).map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      pathname === `/projects/${project.id}`
                        ? "text-foreground bg-accent/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    )}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base">{project.icon || "🚀"}</span>
                    <span className="flex-1 truncate">{project.name}</span>
                    {project.taskCount > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                        {project.taskCount}
                      </span>
                    )}
                  </motion.div>
                </Link>
              ))}
              {projects.filter((p) => !p.archived).length === 0 && (
                <p className="px-3 text-xs text-muted-foreground">No projects yet</p>
              )}
            </div>
          </>
        )}
      </ScrollArea>

      <div className="border-t border-border/30 px-2 py-2">
        {sidebarOpen && (
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent/30 transition-colors"
          >
            <Command className="h-4 w-4" />
            <span className="flex-1 text-left">Command palette</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border/50">⌘K</kbd>
          </button>
        )}
        <div className="space-y-1 mt-1">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  pathname === item.href
                    ? "text-foreground bg-accent/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
