"use client";

import { Check, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=blank form, 2=case attached, 3..6=fields filling, 7=body left to you
const STEP_DELAYS = [0, 400, 900, 900, 550, 550, 550, 900];
const RESET_DELAY = 4000;

const fields = [
  { label: "In the court of", value: "District Court, Nagpur" },
  { label: "Case", value: "R.C.S. No. 412 of 2026" },
  { label: "Applicant", value: "Shri R. B. Deshmukh" },
  { label: "Respondent", value: "State of Maharashtra" },
];

/**
 * The clerical half of a draft filling itself from the case record — the page's
 * headline claim, made literal.
 */
export function DraftingShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Drafting · Application for interim relief">
        <div className="p-4">
          <AnimatedItem visible={step >= 2}>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground">
              <FolderOpen className="h-2.5 w-2.5" />
              CASE ATTACHED · R.C.S. 412/2026
            </div>
          </AnimatedItem>

          <div className="space-y-2.5">
            {fields.map((field, index) => {
              const filled = step >= index + 3;
              return (
                <AnimatedItem key={field.label} visible={step >= 1}>
                  <div className="rounded-lg border border-border/60 bg-background/60 px-2.5 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {field.label}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-xs transition-all duration-500",
                          filled
                            ? "font-medium text-foreground"
                            : "w-32 rounded bg-foreground/10 text-transparent select-none"
                        )}
                      >
                        {filled ? field.value : "placeholder"}
                      </span>
                      {filled && <Check className="h-3 w-3 shrink-0 text-primary" />}
                    </div>
                  </div>
                </AnimatedItem>
              );
            })}
          </div>

          <AnimatedItem visible={step >= 7}>
            <div className="mt-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-2.5">
              <p className="text-[11px] font-medium text-primary">Grounds</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                The cursor is here. This part was always yours.
              </p>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
