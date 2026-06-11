export function calculateDuration(startDate: string | null, dueDate: string | null): string {
  if (!startDate || !dueDate) return "";
  
  const start = new Date(startDate);
  const end = new Date(dueDate);
  
  if (end < start) return "Invalid";
  
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMonths >= 1) {
    const remainder = diffDays % 30;
    if (remainder >= 7) {
      return `${diffMonths}mo ${Math.floor(remainder / 7)}w`;
    }
    if (remainder > 0) {
      return `${diffMonths}mo ${remainder}d`;
    }
    return `${diffMonths}mo`;
  }
  
  if (diffWeeks >= 1) {
    const remainder = diffDays % 7;
    if (remainder > 0) {
      return `${diffWeeks}w ${remainder}d`;
    }
    return `${diffWeeks}w`;
  }
  
  if (diffDays >= 1) {
    return `${diffDays}d`;
  }
  
  if (diffHours >= 1) {
    return `${diffHours}h`;
  }
  
  return "< 1h";
}

export function calculateProgress(startDate: string | null, dueDate: string | null): number {
  if (!startDate || !dueDate) return 0;
  
  const start = new Date(startDate).getTime();
  const end = new Date(dueDate).getTime();
  const now = new Date().getTime();
  
  if (now <= start) return 0;
  if (now >= end) return 100;
  
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.round((elapsed / total) * 100));
}
