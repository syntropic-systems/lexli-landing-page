"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  /** Target number to count up to */
  target: number;
  /** Duration of the count animation in ms. Default: 2000 */
  duration?: number;
  /** Prefix displayed before the number (e.g. "$") */
  prefix?: string;
  /** Suffix displayed after the number (e.g. "%", "x") */
  suffix?: string;
  /** Number of decimal places. Default: 0 */
  decimals?: number;
  className?: string;
  /** IntersectionObserver margin. Default: "-60px" */
  viewMargin?: `${number}px ${number}px ${number}px ${number}px` | `${number}px ${number}px` | `${number}px`;
  /** Animate only once. Default: true */
  once?: boolean;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUp({
  target,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  viewMargin = "-60px",
  once = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: viewMargin });
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView) return;
    if (once && hasAnimated.current) return;
    hasAnimated.current = true;

    let start: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = easedProgress * target;

      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, duration, prefix, suffix, decimals, once]);

  return (
    <span ref={ref} className={cn(className)}>
      {display}
    </span>
  );
}
