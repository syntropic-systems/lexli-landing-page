"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText, FolderKanban, ScrollText, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

/**
 * The section's single idea, shown: a plain-language query, answered across
 * types. Two queries from the page's own copy cycle per loop.
 */

// 0=idle, 1=query one, 2-4=its results, 5=query two, 6-7=its results
const STEP_DELAYS = [0, 500, 1000, 500, 500, 2200, 1000, 500];
const RESET_DELAY = 4200;

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-primary/15 px-0.5 text-foreground">{children}</span>;
}

/** Type → colour: files red (PDF), orders green, cases brand primary. */
const KIND_COLORS: Record<string, string> = {
  Order: '--pdf-anno-list',
  Case: '--primary',
  File: '--pdf-anno-image',
};

function ResultRow({
  icon: Icon,
  kind,
  title,
  snippet,
}: {
  icon: typeof FileText;
  kind: string;
  title: string;
  snippet: React.ReactNode;
}) {
  const colorVar = KIND_COLORS[kind] ?? '--pdf-anno-meta';
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-2.5">
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `color-mix(in oklab, var(${colorVar}) 14%, transparent)` }}
      >
        <Icon className="h-3 w-3" style={{ color: `var(${colorVar})` }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">{title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{snippet}</p>
      </div>
      <span
        className="mt-0.5 shrink-0 text-[9px] font-medium uppercase tracking-wide"
        style={{ color: `var(${colorVar})` }}
      >
        {kind}
      </span>
    </div>
  );
}

export function AdvancedSearchShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  const secondQuery = step >= 5;
  const query = secondQuery
    ? "files from the March hearing"
    : "the order where costs were imposed";

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Advanced Search">
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
              {step >= 1 ? query : "Ask for anything…"}
            </span>
          </div>

          {/* Result sets are MOUNTED conditionally, not just faded —
              AnimatedItem keeps hidden children in the DOM, so an invisible
              set would still hold its layout space under the other one.
              The wrapper is sized to the LARGER set (3 rows) so the frame
              holds one height across both queries instead of shifting. */}
          <div className="flex min-h-[12.25rem] flex-col gap-3">
          {/* mode="wait": the leaving set fades out fully before the next
              mounts — without it the swap is an instant unmount. */}
          <AnimatePresence mode="wait" initial={false}>
          {!secondQuery ? (
            <motion.div
              key="query-one"
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeIn' }}
              className="flex flex-col gap-3"
            >
              <AnimatedItem visible={step >= 2}>
                <ResultRow
                  icon={ScrollText}
                  kind="Order"
                  title="Deshmukh v. State · order, 14 Jul"
                  snippet={
                    <>
                      …exemplary <Highlight>costs imposed</Highlight> on the respondent…
                    </>
                  }
                />
              </AnimatedItem>
              <AnimatedItem visible={step >= 3}>
                <ResultRow
                  icon={FolderKanban}
                  kind="Case"
                  title="Patil v. Kulkarni · hearing history"
                  snippet={
                    <>
                      …application dismissed with <Highlight>costs</Highlight>, 02 Aug…
                    </>
                  }
                />
              </AnimatedItem>
              <AnimatedItem visible={step >= 4}>
                <ResultRow
                  icon={FileText}
                  kind="File"
                  title="order_14-Jul_certified.pdf"
                  snippet={
                    <>
                      Deshmukh v. State · certified copy, <Highlight>costs imposed</Highlight>
                    </>
                  }
                />
              </AnimatedItem>
            </motion.div>
          ) : (
            <motion.div
              key="query-two"
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeIn' }}
              className="flex flex-col gap-3"
            >
              <AnimatedItem visible={step >= 6}>
                <ResultRow
                  icon={FileText}
                  kind="File"
                  title="hearing-notes_12-Mar.docx"
                  snippet={
                    <>
                      R.C.S. 412/2026 · <Highlight>March</Highlight> hearing notes
                    </>
                  }
                />
              </AnimatedItem>
              <AnimatedItem visible={step >= 7}>
                <ResultRow
                  icon={FileText}
                  kind="File"
                  title="annexure-C_scan_18-Mar.pdf"
                  snippet={
                    <>
                      R.C.S. 412/2026 · scanned <Highlight>18 March</Highlight>, filed to case
                    </>
                  }
                />
              </AnimatedItem>
            </motion.div>
          )}
          </AnimatePresence>
          </div>

          <AnimatedItem visible={step >= 2}>
            <p className="text-[10px] text-muted-foreground">
              Across cases, orders, files, dates, and names: one query.
            </p>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
