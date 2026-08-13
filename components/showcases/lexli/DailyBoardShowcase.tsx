"use client";

import { CalendarClock, FileText, Loader2 } from "lucide-react";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=pulling lists, 2..5=entries landing one per court, 6=export row
const STEP_DELAYS = [0, 400, 1100, 800, 800, 800, 900];
const RESET_DELAY = 4000;

const entries = [
  {
    item: "12",
    court: "Bombay HC · Court 21",
    title: "Deshmukh v. State of Maharashtra",
    detail: "Last order: 14 Jul · Adjourned",
  },
  {
    item: "27",
    court: "District Court, Nagpur · Court 4",
    title: "Patil v. Kulkarni",
    detail: "Opposition: Adv. S. Rane",
  },
  {
    item: "31",
    court: "District Court, Nagpur · Court 9",
    title: "Sharma v. Anand Traders",
    detail: "Last order: 02 Aug · Reply filed",
  },
  {
    item: "48",
    court: "Bombay HC · Court 6",
    title: "Iyer v. Municipal Corporation",
    detail: "Opposition: Adv. M. Fernandes",
  },
];

/**
 * The board assembling itself from published cause lists — the Daily Board's
 * whole claim, shown rather than asserted.
 */
export function DailyBoardShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Daily Board · Wednesday, 12 August">
        <div className="flex flex-col gap-2 p-4">
          {/* Status line: pulling → built */}
          <div className="flex items-center gap-2 pb-1 text-[11px] text-muted-foreground">
            {step < 2 ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span>Reading published cause lists…</span>
              </>
            ) : (
              <>
                <CalendarClock className="h-3 w-3 text-primary" />
                <span>
                  {Math.min(Math.max(step - 1, 0), entries.length)} hearings · 2 courts
                </span>
              </>
            )}
          </div>

          {entries.map((entry, index) => (
            <AnimatedItem key={entry.title} visible={step >= index + 2}>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
                  {entry.item}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{entry.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{entry.court}</p>
                  <p className="truncate text-[11px] text-muted-foreground/80">{entry.detail}</p>
                </div>
              </div>
            </AnimatedItem>
          ))}

          <AnimatedItem visible={step >= 6}>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-[11px] text-primary">
              <FileText className="h-3 w-3" />
              <span>Exported: board-12-Aug.pdf, with the last orders attached</span>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
