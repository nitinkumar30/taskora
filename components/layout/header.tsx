"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  Moon,
  Sun,
  Monitor,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/inbox": "Inbox",
  "/today": "Today",
  "/upcoming": "Upcoming",
  "/completed": "Completed",
  "/favorites": "Favorites",
  "/archive": "Archive",
  "/settings": "Settings",
  "/analytics": "Analytics",
  "/calendar": "Calendar",
  "/timeline": "Timeline",
  "/folders": "Folders",
  "/projects": "Projects",
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme, setMobileSidebarOpen, setCommandPaletteOpen, sidebarOpen } = useUIStore();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const title = pageTitles[pathname] || "Todo App";
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-14 flex items-center gap-4 px-4 md:px-6 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/30" : "bg-transparent"
      )}
    >
      {!sidebarOpen && (
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      <div className="flex-1">
        <motion.h1
          key={pathname}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold"
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex items-center gap-2">
        {!isHome && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              data-search-input
              type="text"
              placeholder="Search tasks..."
              className="h-9 w-48 lg:w-64 rounded-lg border border-border/50 bg-background/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              onFocus={() => setCommandPaletteOpen(true)}
            />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const modes: Array<"light" | "dark" | "system"> = ["dark", "light", "system"];
            const next = modes[(modes.indexOf(theme) + 1) % modes.length];
            setTheme(next);
          }}
          aria-label={`Current theme: ${theme}. Click to change.`}
        >
          {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
        </Button>

        <Button
          variant="default"
          size="sm"
          className="gap-1.5"
          onClick={() => document.dispatchEvent(new CustomEvent("open-new-task"))}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>
    </header>
  );
}
