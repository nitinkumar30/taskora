"use client";

import React, { Suspense, useRef, useMemo } from "react";

const Scene = React.lazy(() => import("@/components/three-scene"));

export function ThreeBackground() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-30 dark:opacity-20">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  );
}
