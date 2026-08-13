"use client";

import { AlertTriangle, ArrowRight, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=source, 2..4=translated lines, 5=warning, 6=export
const STEP_DELAYS = [0, 400, 900, 700, 700, 900, 1000];
const RESET_DELAY = 4200;

const lines = [
  {
    en: "The appeal is partly allowed.",
    mr: "अपील अंशतः मंजूर करण्यात येते.",
  },
  {
    en: "The impugned order dated 14.07.2026 is set aside.",
    mr: "दिनांक १४.०७.२०२६ चा विवादित आदेश रद्द करण्यात येतो.",
  },
  {
    en: "There shall be no order as to costs.",
    mr: "खर्चाबाबत आदेश नाही.",
    flagged: true,
  },
];

/**
 * Side-by-side review with a flagged passage — the point being that the
 * translation is handed to the advocate for judgement, not published for them.
 */
export function TranslationShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Legal Translator · judgement.pdf">
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <span>English</span>
            <ArrowRight className="h-3 w-3 text-primary" />
            <span>मराठी</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Source column */}
            <AnimatedItem visible={step >= 1}>
              <div className="h-full space-y-2 rounded-lg border border-border/60 bg-background/60 p-2.5">
                {lines.map((line) => (
                  <p key={line.en} className="text-[11px] leading-relaxed text-muted-foreground">
                    {line.en}
                  </p>
                ))}
              </div>
            </AnimatedItem>

            {/* Translation column — lands line by line */}
            <div className="h-full space-y-2 rounded-lg border border-border/60 bg-background/60 p-2.5">
              {lines.map((line, index) => (
                <AnimatedItem key={line.mr} visible={step >= index + 2}>
                  <p
                    className={cn(
                      "text-[11px] leading-relaxed text-foreground",
                      line.flagged && step >= 5 && "rounded bg-warning/60 px-1 text-warning-foreground"
                    )}
                  >
                    {line.mr}
                  </p>
                </AnimatedItem>
              ))}
            </div>
          </div>

          <AnimatedItem visible={step >= 5}>
            <div className="mt-2 flex items-start gap-2 rounded-lg border border-warning-foreground/30 bg-warning/40 px-2.5 py-2 text-[11px] text-warning-foreground">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>&ldquo;Costs&rdquo; — confirm the term before this leaves your hands.</span>
            </div>
          </AnimatedItem>

          <AnimatedItem visible={step >= 6}>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-[11px] text-primary">
              <FileDown className="h-3 w-3" />
              <span>Saved to the case file, beside the original</span>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
