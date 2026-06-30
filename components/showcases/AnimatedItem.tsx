"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function AnimatedItem({
  visible,
  children,
  className,
}: {
  visible: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible && !mounted) {
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    }
    if (!visible) setMounted(false);
  }, [visible, mounted]);

  const show = visible && mounted;

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
