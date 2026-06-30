"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** Slide direction. Default: "up" */
  direction?: "up" | "down" | "left" | "right";
  /** Delay in seconds before animation starts. Default: 0 */
  delay?: number;
  /** Animation duration in seconds. Default: 0.6 */
  duration?: number;
  /** How far the element slides in pixels. Default: 24 */
  distance?: number;
  /** IntersectionObserver margin. Default: "-60px" (triggers slightly before element is in view) */
  viewMargin?: `${number}px ${number}px ${number}px ${number}px` | `${number}px ${number}px` | `${number}px`;
  /** Animate only once or every time element enters view. Default: true */
  once?: boolean;
  /** HTML tag to render. Default: "div" */
  as?: keyof typeof motion;
}

const directionMap = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

export function RevealOnScroll({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 24,
  viewMargin = "-60px",
  once = true,
  as = "div",
}: RevealOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: viewMargin });

  const { x: dx, y: dy } = directionMap[direction];
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, x: dx * distance, y: dy * distance }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
