"use client";

import {
  CalendarClock,
  FileText,
  FolderKanban,
  MessagesSquare,
} from "lucide-react";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

/**
 * The spine, shown as the receiving end: every other showcase ends with
 * "saved to the case" — this is the case those files land in, source-tagged
 * per tool. Same record (Deshmukh) and file names as the sibling showcases,
 * so the set reads as one story.
 */

// 0=idle, 1=case header, 2=status chips, 3-5=files arrive, 6=hearings, 7=chat, 8=close
const STEP_DELAYS = [0, 500, 900, 900, 700, 700, 900, 900, 1000];
const RESET_DELAY = 4200;

const CASE_FILES = [
  { name: "order_14-Jul_certified.pdf", source: "via Case Finder" },
  { name: "annexure-A_scan.pdf", source: "via Scanner" },
  { name: "reply-draft.docx", source: "via Drafting" },
];

export function CaseRecordShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Case record">
        <div className="flex flex-col gap-3 p-4">
          {/* Case header */}
          <AnimatedItem visible={step >= 1}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <FolderKanban className="h-3.5 w-3.5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  Deshmukh v. State of Maharashtra
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  W.P. 2214/2025 · Bombay High Court
                </p>
              </div>
            </div>
          </AnimatedItem>

          {/* Status chips, from the court record */}
          <AnimatedItem visible={step >= 2}>
            <div className="flex flex-wrap gap-1.5">
              {["Status · Reply awaited", "Next date · 22 Aug", "Orders · 6 on record"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-[10px] font-medium text-muted-foreground"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </AnimatedItem>

          {/* Files arriving, source-tagged per tool */}
          <div className="flex flex-col gap-1.5">
            <AnimatedItem visible={step >= 3}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Case files
              </p>
            </AnimatedItem>
            {CASE_FILES.map((file, index) => (
              <AnimatedItem key={file.name} visible={step >= index + 3}>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-2.5 py-2">
                  <FileText className="h-3 w-3 shrink-0 text-primary" />
                  <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground">
                    {file.name}
                  </p>
                  <span className="shrink-0 text-[9px] font-medium text-primary/80">
                    {file.source}
                  </span>
                </div>
              </AnimatedItem>
            ))}
          </div>

          {/* Hearing history */}
          <AnimatedItem visible={step >= 6}>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <CalendarClock className="h-3 w-3 text-primary" />
              <span>
                Hearing history · 6 entries · last: 14 Jul, adjourned
              </span>
            </div>
          </AnimatedItem>

          {/* Conversation tied to the case */}
          <AnimatedItem visible={step >= 7}>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <MessagesSquare className="h-3 w-3 text-primary" />
              <span>Chat tied to this case. Context carries to the next hearing</span>
            </div>
          </AnimatedItem>

          {/* Close */}
          <AnimatedItem visible={step >= 8}>
            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-[11px] text-primary">
              The record the rest of the platform works from.
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
