"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Star,
  Trash2,
  Archive,
  Clock,
  AlertCircle,
  Calendar,
  GripVertical,
} from "lucide-react";
import { Task } from "@/types";
import { cn, formatDateShort, getPriorityColor, getStatusColor, isOverdue, isToday, getTimeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  isDraggable?: boolean;
  dragHandleProps?: any;
}

const priorityLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
  onFavorite,
  onArchive,
  isDraggable,
  dragHandleProps,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";
  const isTaskOverdue = isOverdue(task.dueDate) && !isCompleted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-border/60 hover:shadow-lg hover:shadow-black/5 transition-all duration-200 cursor-pointer",
        isCompleted && "opacity-60",
        isTaskOverdue && "border-red-500/30"
      )}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start gap-3">
        {isDraggable && dragHandleProps && (
          <div {...dragHandleProps} className="mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4" />
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
          className={cn(
            "mt-0.5 shrink-0 transition-all duration-200",
            isCompleted ? "text-emerald-500" : "text-muted-foreground hover:text-emerald-500"
          )}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
              <CheckCircle2 className="h-5 w-5" />
            </motion.div>
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn("text-sm font-medium truncate", isCompleted && "line-through text-muted-foreground")}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              {task.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5", getPriorityColor(task.priority))}>
              {priorityLabels[task.priority]}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5", getStatusColor(task.status))}>
              {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            {task.dueDate && (
              <span className={cn(
                "text-[10px] flex items-center gap-1",
                isTaskOverdue ? "text-red-500" : isToday(task.dueDate) ? "text-amber-500" : "text-muted-foreground"
              )}>
                <Calendar className="h-3 w-3" />
                {formatDateShort(task.dueDate)}
              </span>
            )}
            {task.duration && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.duration}
              </span>
            )}
          </div>

          {task.progress > 0 && task.progress < 100 && (
            <div className="mt-2">
              <Progress value={task.progress} className="h-1" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(task.id); }}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
              task.favorite ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"
            )}
            aria-label={task.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={cn("h-3.5 w-3.5", task.favorite && "fill-current")} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onArchive(task.id); }}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Archive task"
          >
            <Archive className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground">{getTimeAgo(task.createdAt)}</div>
    </motion.div>
  );
}
