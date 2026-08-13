"use client";

import { FolderOpen, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=question, 2=reading, 3=cited answer, 4=follow-up, 5=tool call, 6=draft handed back
const STEP_DELAYS = [0, 500, 1000, 1300, 1400, 900, 1400];
const RESET_DELAY = 4500;

function Cite({ n }: { n: number }) {
  return (
    <span className="ml-0.5 align-super text-[9px] font-medium text-primary">[{n}]</span>
  );
}

/**
 * Two moves in one conversation: an answer grounded in the case's own files,
 * then the assistant running another tool without leaving the chat.
 */
export function AssistantShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="AI Assistant">
        <div className="flex flex-col gap-3 p-4">
          {/* Question, scoped to a case */}
          <AnimatedItem visible={step >= 1}>
            <div className="flex flex-col items-end gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground">
                <FolderOpen className="h-2.5 w-2.5" />
                R.C.S. 412/2026
              </span>
              <div className="max-w-[80%] rounded-lg bg-accent px-3 py-2 text-xs leading-relaxed text-accent-foreground">
                What did the court say about limitation on the last date?
              </div>
            </div>
          </AnimatedItem>

          {/* Reading the record */}
          <div className="relative h-4">
            <span
              className={cn(
                "absolute text-[11px] text-muted-foreground transition-opacity duration-300",
                step === 2 ? "animate-pulse opacity-100" : "opacity-0"
              )}
            >
              Reading the case file…
            </span>
            <span
              className={cn(
                "absolute text-[11px] text-muted-foreground transition-opacity duration-300",
                step >= 3 ? "opacity-100" : "opacity-0"
              )}
            >
              Read 3 files from this case
            </span>
          </div>

          {/* Cited answer */}
          <AnimatedItem visible={step >= 3}>
            <div className="text-xs leading-relaxed text-foreground">
              <p>
                The court recorded that the objection on limitation was kept open and not decided
                on 14 July.
                <Cite n={1} />
              </p>
              <ul className="mt-1.5 space-y-1">
                <li className="flex items-start gap-1.5 text-foreground/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                  <span>
                    Reply was directed to be filed within four weeks
                    <Cite n={2} />
                  </span>
                </li>
              </ul>
            </div>
          </AnimatedItem>

          {/* Follow-up that triggers a tool */}
          <AnimatedItem visible={step >= 4}>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-accent px-3 py-2 text-xs leading-relaxed text-accent-foreground">
                Draft the reply then.
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 5}>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary">
              <PenLine className="h-2.5 w-2.5" />
              Running Drafting
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 6}>
            <div className="rounded-lg border border-border/60 bg-background/60 p-2.5">
              <p className="text-[11px] font-semibold text-foreground">Reply to application</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Parties and case details already filled in · saved to the case
              </p>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
