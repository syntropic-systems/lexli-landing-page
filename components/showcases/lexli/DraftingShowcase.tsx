"use client";

import { Check, FileText, Loader2, X } from "lucide-react";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=ask, 2=drafting, 3=document opens, 4=revision asked, 5=tracked change, 6=accepted
const STEP_DELAYS = [0, 400, 900, 1200, 1000, 900, 1100];
const RESET_DELAY = 4000;

/**
 * Drafting as the product does it: asked for in chat, written from the case
 * papers, opened as a Word document beside the conversation, and revised
 * through tracked changes the advocate accepts or rejects.
 */
export function DraftingShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Drafting · Deshmukh v. State of Maharashtra">
        <div className="flex flex-col gap-2.5 p-4">
          <AnimatedItem visible={step >= 1}>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-accent px-3 py-2 text-xs leading-relaxed text-accent-foreground">
                Draft the reply to the interim application.
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 2}>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary">
              {step < 3 ? (
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
              ) : (
                <Check className="h-2.5 w-2.5" />
              )}
              Drafting from the case papers
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 3}>
            <div className="rounded-lg border border-border/60 bg-background/60 p-2.5">
              <div className="flex items-center gap-1.5 pb-2 text-[11px] font-semibold text-foreground">
                <FileText className="h-3 w-3 text-primary" />
                reply-interim-application.docx
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                4. The Applicant has not shown a prima facie case, and the balance of
                convenience lies{" "}
                {step >= 5 && step < 6 ? (
                  <>
                    <span className="text-muted-foreground/60 line-through">clearly</span>{" "}
                    <span className="rounded bg-primary/10 px-0.5 text-primary underline">
                      entirely
                    </span>
                  </>
                ) : step >= 6 ? (
                  <span className="text-foreground">entirely</span>
                ) : (
                  "clearly"
                )}{" "}
                with the Respondent.
              </p>
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 4}>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-accent px-3 py-2 text-xs leading-relaxed text-accent-foreground">
                Make paragraph 4 firmer.
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 5}>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-[11px] text-primary">
              <span>{step >= 6 ? "Change accepted · saved as a new version" : "1 suggested change"}</span>
              {step < 6 && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    <X className="h-2.5 w-2.5" /> Reject
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                    <Check className="h-2.5 w-2.5" /> Accept
                  </span>
                </span>
              )}
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
