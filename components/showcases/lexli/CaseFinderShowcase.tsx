"use client";

import { FolderPlus, Landmark, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=query typed, 2=result row, 3=record opens, 4=saved to workspace
const STEP_DELAYS = [0, 500, 1100, 1200, 1400];
const RESET_DELAY = 4200;

const record = [
  { label: "Status", value: "Pending · reply awaited" },
  { label: "Parties", value: "Deshmukh v. State of Maharashtra" },
  { label: "Last hearing", value: "14 Jul · Adjourned" },
  { label: "Orders", value: "6 on record" },
];

/**
 * Search → record → kept. The tool's whole pitch in one loop: a found case
 * becomes a managed case.
 */
export function CaseFinderShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Case Finder">
        <div className="flex flex-col gap-3 p-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span
              className={cn(
                "text-xs transition-colors duration-300",
                step >= 1 ? "text-foreground" : "text-muted-foreground/60"
              )}
            >
              {step >= 1 ? "Adv. S. R. Kulkarni, Bombay High Court" : "Case number or advocate name…"}
            </span>
          </div>

          {/* Result row */}
          <AnimatedItem visible={step >= 2}>
            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-2.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Landmark className="h-3 w-3 text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  Deshmukh v. State of Maharashtra
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  W.P. 2214/2025 · Bombay High Court
                </p>
              </div>
            </div>
          </AnimatedItem>

          {/* Record detail */}
          <AnimatedItem visible={step >= 3}>
            <div className="grid grid-cols-2 gap-2">
              {record.map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg border border-border/60 bg-background/60 px-2.5 py-2"
                >
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-foreground">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedItem>

          {/* Kept */}
          <AnimatedItem visible={step >= 4}>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-[11px] text-primary">
              <FolderPlus className="h-3 w-3" />
              <span>Saved to your workspace: record, orders, and updates attached</span>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
