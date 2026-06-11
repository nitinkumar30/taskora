"use client";

import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { TaskPriority, TaskStatus, SortField } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TaskFilters() {
  const { filters, setFilters, resetFilters } = useTaskStore();

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "" ||
    filters.favorite !== null ||
    filters.overdue !== null;

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            data-search-input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="h-10 w-full rounded-xl border border-border/50 bg-background/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as TaskStatus | "all" })}
            className="h-10 rounded-xl border border-border/50 bg-background/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value as TaskPriority | "all" })}
            className="h-10 rounded-xl border border-border/50 bg-background/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Filter by priority"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={`${filters.sortField}-${filters.sortDirection}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split("-");
              setFilters({ sortField: field as SortField, sortDirection: dir as "asc" | "desc" });
            }}
            className="h-10 rounded-xl border border-border/50 bg-background/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Sort by"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="dueDate-asc">Due Date ↑</option>
            <option value="dueDate-desc">Due Date ↓</option>
            <option value="priority-desc">Priority ↑</option>
            <option value="priority-asc">Priority ↓</option>
            <option value="title-asc">A-Z</option>
            <option value="title-desc">Z-A</option>
          </select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFilters({ favorite: filters.favorite === true ? null : true })}
            className={filters.favorite ? "text-amber-500" : ""}
            aria-label="Show favorites only"
          >
            <svg className="h-4 w-4" fill={filters.favorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFilters({ overdue: filters.overdue === true ? null : true })}
            className={filters.overdue ? "text-red-500" : ""}
            aria-label="Show overdue only"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={resetFilters} aria-label="Reset filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filters.status !== "all" && (
            <Badge variant="secondary" className="text-[10px] h-5">
              {filters.status}
              <button onClick={() => setFilters({ status: "all" })} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.priority !== "all" && (
            <Badge variant="secondary" className="text-[10px] h-5">
              {filters.priority}
              <button onClick={() => setFilters({ priority: "all" })} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.favorite && (
            <Badge variant="secondary" className="text-[10px] h-5">
              Favorites
              <button onClick={() => setFilters({ favorite: null })} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.overdue && (
            <Badge variant="secondary" className="text-[10px] h-5 text-red-500">
              Overdue
              <button onClick={() => setFilters({ overdue: null })} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
