"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  error: "border-red-500/30 bg-red-500/10 text-red-500",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-500",
};

export function Toasts() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-xl",
                toastStyles[toast.type]
              )}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 h-5 w-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
