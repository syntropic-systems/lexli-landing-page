"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  /** Delay between each child animation in seconds. Default: 0.1 */
  stagger?: number;
  /** Animation duration for each child in seconds. Default: 0.5 */
  duration?: number;
  /** Initial delay before the first child animates. Default: 0 */
  delay?: number;
  /** How far each child slides up in pixels. Default: 20 */
  distance?: number;
  /** IntersectionObserver margin. Default: "-60px" */
  viewMargin?: `${number}px ${number}px ${number}px ${number}px` | `${number}px ${number}px` | `${number}px`;
  /** Animate only once. Default: true */
  once?: boolean;
}

export function StaggerChildren({
  children,
  className,
  stagger = 0.1,
  duration = 0.5,
  delay = 0,
  distance = 20,
  viewMargin = "-60px",
  once = true,
}: StaggerChildrenProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: viewMargin });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/** Wrap each direct child of StaggerChildren with this for the fade-up effect. */
export function StaggerItem({
  children,
  className,
  duration = 0.5,
  distance = 20,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
