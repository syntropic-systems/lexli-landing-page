"use client";

import { CalendarClock, FileText, Loader2, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

// 0=idle, 1=reading, 2..4=cases landing, 5=source footer, 6=the board moves
const STEP_DELAYS = [0, 400, 1000, 700, 700, 800, 1400];
const RESET_DELAY = 4000;

const tabs = ["Cases", "Cause List", "Display Board"];

/**
 * The team's hero mock (Calendar draft, 15 Oct 2026), animated: the day's
 * cases land, the source line confirms the list, then the display board
 * moves one case closer. Fictional parties, as on the rest of the site.
 */
export function CalendarShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  const cases = [
    {
      title: "Deshmukh v. State of Maharashtra",
      meta: "Sr. 913 · Court A",
      live: "Your case is active · Called 1 h ago",
      active: true,
    },
    {
      title: "Patil v. Kulkarni",
      meta: "Sr. 30 · Court C",
      live:
        step >= 6
          ? "Court C is on Sr. 29 · Yours is next"
          : "Court C is on Sr. 26 · 4 before yours",
      active: false,
    },
    {
      title: "Sharma v. Anand Traders",
      meta: "District Court, Nagpur · Evidence",
      live: "Last heard 28 Aug",
      active: false,
    },
  ];

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Calendar · Thursday, 15 October · 14 listed">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex gap-1 pb-1">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={cn(
                  "rounded-md px-2 py-1 text-[10px] font-medium",
                  tab === "Cases" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pb-1 text-[11px] text-muted-foreground">
            {step < 2 ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span>Reading the published cause list…</span>
              </>
            ) : (
              <>
                <CalendarClock className="h-3 w-3 text-primary" />
                <span>Your cases ({Math.min(Math.max(step - 1, 0), cases.length)})</span>
              </>
            )}
          </div>

          {cases.map((entry, index) => (
            <AnimatedItem key={entry.title} visible={step >= index + 2}>
              <div className="rounded-lg border border-border/60 bg-background/60 p-2.5">
                <p className="truncate text-xs font-semibold text-foreground">{entry.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">{entry.meta}</p>
                <p
                  className={cn(
                    "mt-0.5 flex items-center gap-1 truncate text-[11px] transition-colors duration-500",
                    entry.active || (index === 1 && step >= 6)
                      ? "text-primary"
                      : "text-muted-foreground/80"
                  )}
                >
                  {index < 2 && <Radio className="h-2.5 w-2.5 shrink-0" />}
                  {entry.live}
                </p>
              </div>
            </AnimatedItem>
          ))}

          <AnimatedItem visible={step >= 5}>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-[11px] text-primary">
              <FileText className="h-3 w-3" />
              <span>Checked against the published cause list · Source, p. 9</span>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
