"use client";

import { FileText, FolderInput, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=page captured, 2=scan sweep, 3=digitised file, 4=filed to case
const STEP_DELAYS = [0, 500, 900, 2000, 1200];
const RESET_DELAY = 4200;

/**
 * Paper in, working file out — the page sharpens from a skewed capture into a
 * clean document, then lands in its case.
 */
export function ScannerShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Document Scanner">
        <div className="flex flex-col gap-3 p-4">
          <AnimatedItem visible={step >= 1}>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Smartphone className="h-3 w-3 text-primary" />
              <span>Captured from phone: certified copy, 3 pages</span>
            </div>
          </AnimatedItem>

          {/* The page: skewed grey capture → straightened clean document.
              The sweep line rides the transition. */}
          <AnimatedItem visible={step >= 1}>
            <div className="relative mx-auto w-40">
              <div
                className={cn(
                  "relative overflow-hidden rounded-md border p-3 transition-all duration-700",
                  step >= 3
                    ? "rotate-0 border-border/60 bg-background shadow-sm"
                    : "rotate-2 border-border/40 bg-muted/70"
                )}
              >
                {/* Scan sweep */}
                {step === 2 && (
                  <span
                    aria-hidden
                    className="absolute left-0 h-0.5 w-full bg-primary/70 shadow-[0_0_8px_var(--primary)]"
                    style={{ animation: "scan-down 1.8s ease-in-out 1" }}
                  />
                )}
                <div className="space-y-1.5">
                  {[
                    "w-3/4", "w-full", "w-5/6", "w-full", "w-2/3", "w-full", "w-4/5",
                  ].map((width, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={cn(
                        "h-1.5 rounded-sm transition-all duration-700",
                        width,
                        step >= 3 ? "bg-foreground/25" : "bg-foreground/10 blur-[1px]"
                      )}
                    />
                  ))}
                </div>
                {/* The stamp across the signature block */}
                <div
                  className={cn(
                    "mt-2 flex h-6 w-16 -rotate-6 items-center justify-center rounded-sm border text-[7px] font-semibold uppercase tracking-wider transition-all duration-700",
                    step >= 3
                      ? "border-primary/40 text-primary/60"
                      : "border-foreground/20 text-foreground/30 blur-[1px]"
                  )}
                >
                  Stamped
                </div>
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 3}>
            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <FileText className="h-3 w-3 text-primary" />
              <span>certified-copy.doc · editable, ready to work with</span>
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 4}>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-[11px] text-primary">
              <FolderInput className="h-3 w-3" />
              <span>Filed to Deshmukh v. State of Maharashtra · case files</span>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
