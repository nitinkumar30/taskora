"use client";

import { useEffect, useRef } from "react";

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => void,
  delay: number = 1000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);

  useEffect(() => {
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) return;
    
    previousDataRef.current = data;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveFn(data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFn, delay]);
}
