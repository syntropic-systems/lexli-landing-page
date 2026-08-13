"use client";

import { Check, FolderOpen, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=case chosen, 2=eDraft fields fill, 3..6=packet ops tick, 7=approval
const STEP_DELAYS = [0, 500, 1300, 700, 550, 550, 550, 1300];
const RESET_DELAY = 4500;

const packetOps = ["OCR conversion", "Merging", "Blank-page removal", "Indexing"];

/**
 * The packet assembling, then stopping at the only gate that matters: the
 * advocate's approval. Register is flat by design — no wit on filing.
 */
export function EfilingShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="eFiling Support">
        <div className="flex flex-col gap-3 p-4">
          <AnimatedItem visible={step >= 1}>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground">
              <FolderOpen className="h-2.5 w-2.5" />
              R.C.S. 412/2026 · District Court, Nagpur
            </div>
          </AnimatedItem>

          {/* eDraft fields */}
          <AnimatedItem visible={step >= 1}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Applicant", value: "Shri R. B. Deshmukh" },
                { label: "Respondent", value: "State of Maharashtra" },
              ].map((field) => (
                <div
                  key={field.label}
                  className="rounded-lg border border-border/60 bg-background/60 px-2.5 py-2"
                >
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {field.label}
                  </p>
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-[11px] transition-all duration-500",
                      step >= 2
                        ? "font-medium text-foreground"
                        : "w-20 rounded bg-foreground/10 text-transparent select-none"
                    )}
                  >
                    {step >= 2 ? field.value : "placeholder"}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 2}>
            <p className="text-[11px] text-muted-foreground">
              Fields extracted from the case files, every one editable.
            </p>
          </AnimatedItem>

          {/* Packet readiness */}
          <div className="rounded-lg border border-border/60 bg-background/60 p-2.5">
            <p className="mb-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              Document readiness
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {packetOps.map((op, opIndex) => {
                const done = step >= opIndex + 3;
                return (
                  <div key={op} className="flex items-center gap-1.5 text-[11px]">
                    <span
                      className={cn(
                        "flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors duration-300",
                        done ? "bg-primary/15 text-primary" : "bg-foreground/5 text-transparent"
                      )}
                    >
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span className={done ? "text-foreground" : "text-muted-foreground/60"}>
                      {op}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The gate */}
          <AnimatedItem visible={step >= 7}>
            <div className="flex items-start gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-[11px] text-primary">
              <KeyRound className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                Awaiting your review and approval. Submission goes through your own portal
                credentials.
              </span>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
