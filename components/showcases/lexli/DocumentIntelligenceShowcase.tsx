"use client";

import {
  AlignLeft,
  CheckCircle,
  FileText,
  Heading,
  Loader2,
  Scale,
  Stamp,
  Table2,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedItem } from "../AnimatedItem";
import { useInView } from "../useInView";
import { useStepAnimation } from "../useStepAnimation";
import { ShowcaseFrame } from "../ShowcaseFrame";

/**
 * Ported from CloudGlance's IndexingShowcase and re-cast for a legal filing:
 * the page anatomy is annexure-shaped, and the reference's Image element is a
 * Stamp — the section's own recurring detail. Uses the --pdf-anno-* palette
 * and scan-down keyframe already in globals.css.
 */

const PIPELINE_STEPS = [
  { label: "Uploading" },
  { label: "Reading" },
  { label: "Understanding" },
  { label: "Structuring" },
  { label: "Ready" },
];

// Pleading order: court block, cause title, petition title, numbered
// paragraphs, schedule, prayer heading, prayer clauses, signature + stamp.
const BBOX_ELEMENTS = [
  { label: "Title", icon: Type, colorVar: "--pdf-anno-heading" },
  { label: "Body", icon: AlignLeft, colorVar: "--pdf-anno-text" },
  { label: "Heading", icon: Heading, colorVar: "--pdf-anno-heading" },
  { label: "Body", icon: AlignLeft, colorVar: "--pdf-anno-text" },
  { label: "Table", icon: Table2, colorVar: "--pdf-anno-table" },
  { label: "Heading", icon: Heading, colorVar: "--pdf-anno-heading" },
  { label: "Body", icon: AlignLeft, colorVar: "--pdf-anno-text" },
  { label: "Stamp", icon: Stamp, colorVar: "--pdf-anno-image" },
];

/** Skeleton line: geometry via className, weight via tone, colour flips on hl. */
const LINE_TONE = {
  strong: "bg-foreground/25",
  mid: "bg-foreground/20",
  soft: "bg-foreground/10",
} as const;

function Ln({
  hl,
  tone = "soft",
  className,
}: {
  hl: boolean;
  tone?: keyof typeof LINE_TONE;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-[2px] rounded-full transition-all duration-400",
        hl ? "bg-info-foreground/30" : LINE_TONE[tone],
        className
      )}
    />
  );
}

function BboxOverlay({
  el,
  visible,
  children,
}: {
  el: (typeof BBOX_ELEMENTS)[number];
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-sm transition-all duration-500 ease-out",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <div
          className="absolute inset-0 rounded-sm"
          style={{ backgroundColor: `var(${el.colorVar})`, opacity: 0.1 }}
        />
        <div
          className="absolute inset-0 rounded-sm"
          style={{ border: `1px solid var(${el.colorVar})` }}
        />
        <div
          className="absolute -top-3.5 left-0 flex items-center gap-0.5 rounded px-1 py-0.5 text-white"
          style={{ backgroundColor: `var(${el.colorVar})`, fontSize: "8px", lineHeight: 1 }}
        >
          <el.icon className="h-2 w-2" />
          {el.label}
        </div>
      </div>
    </div>
  );
}

// Steps: 0=idle, 1=file card+doc, 2=Uploading, 3=Reading(scan),
// 4=Understanding(highlights), 5=Structuring, 6-13=bbox elements, 14=Ready
const STEP_DELAYS = [
  0, 500, 800, 1500, 1400, 1500, 250, 250, 250, 250, 250, 250, 250, 250, 800,
];
const RESET_DELAY = 4000;

export function DocumentIntelligenceShowcase({ frozen }: { frozen?: number } = {}) {
  const { ref, inView } = useInView();
  const step = useStepAnimation(STEP_DELAYS, RESET_DELAY, frozen, !inView);

  const activeStage =
    step >= 14 ? 4 : step >= 5 ? 3 : step >= 4 ? 2 : step >= 3 ? 1 : step >= 2 ? 0 : -1;
  const isReady = step >= 14;
  const visibleBoxes = step >= 6 ? Math.min(step - 5, BBOX_ELEMENTS.length) : 0;

  return (
    <div ref={ref}>
      <ShowcaseFrame title="Document intelligence">
        <div className="flex flex-col gap-3 p-4">
          {/* File card */}
          <AnimatedItem visible={step >= 1}>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-3">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
                <p className="truncate text-xs font-medium text-foreground">
                  WP-2214-2025_annexure-A.pdf
                </p>
                <p className="shrink-0 text-[10px] text-muted-foreground">4.1 MB · scanned</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {activeStage >= 0 && !isReady && (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-info-foreground" />
                    <span className="text-[10px] font-medium text-info-foreground">
                      {PIPELINE_STEPS[activeStage].label}
                    </span>
                  </>
                )}
                {isReady && (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 text-success-foreground" />
                    <span className="text-[10px] font-medium text-success-foreground">
                      Structured
                    </span>
                  </>
                )}
              </div>
            </div>
          </AnimatedItem>

          {/* Mini document page */}
          <AnimatedItem visible={step >= 1}>
            {/* True A4 (210:297) at the slim width — content top-flows and the
                empty bottom reads as the page's lower margin. */}
            <div className="relative mx-auto flex aspect-[210/297] w-[62%] flex-col overflow-hidden rounded border border-border/60 bg-card shadow-sm sm:w-[40%]">
              <div className="relative flex flex-1 flex-col gap-2 p-3 pt-4">
                {/* Court name block — centred caps, jurisdiction, case number */}
                <BboxOverlay el={BBOX_ELEMENTS[0]} visible={visibleBoxes > 0}>
                  <div className="flex flex-col items-center gap-[4px] py-0.5">
                    <Ln hl={step === 4} tone="strong" className="h-[4px] w-[80%]" />
                    <Ln hl={step === 4} tone="mid" className="w-[46%]" />
                    <Ln hl={step === 4} tone="mid" className="h-[3px] w-[54%]" />
                  </div>
                </BboxOverlay>

                {/* Cause title — petitioner v. respondent, tags right-aligned */}
                <BboxOverlay el={BBOX_ELEMENTS[1]} visible={visibleBoxes > 1}>
                  <div className="space-y-[4px] py-0.5">
                    <div className="flex items-center justify-between">
                      <Ln hl={step === 4} className="w-[46%]" />
                      <Ln hl={step === 4} tone="mid" className="w-[16%]" />
                    </div>
                    <Ln hl={step === 4} className="w-[30%]" />
                    <Ln hl={step === 4} tone="mid" className="mx-auto w-[12%]" />
                    <div className="flex items-center justify-between">
                      <Ln hl={step === 4} className="w-[50%]" />
                      <Ln hl={step === 4} tone="mid" className="w-[18%]" />
                    </div>
                    <Ln hl={step === 4} className="w-[26%]" />
                  </div>
                </BboxOverlay>

                {/* Petition title — centred */}
                <BboxOverlay el={BBOX_ELEMENTS[2]} visible={visibleBoxes > 2}>
                  <div className="flex justify-center py-0.5">
                    <Ln hl={step === 4} tone="strong" className="h-[4px] w-[62%]" />
                  </div>
                </BboxOverlay>

                {/* Numbered paragraphs — hanging indents */}
                <BboxOverlay el={BBOX_ELEMENTS[3]} visible={visibleBoxes > 3}>
                  <div className="space-y-[4px] py-0.5">
                    <div className="flex items-center gap-1.5">
                      <Ln hl={step === 4} tone="mid" className="w-[4px] shrink-0" />
                      <Ln hl={step === 4} className="w-[88%]" />
                    </div>
                    <div className="pl-3"><Ln hl={step === 4} className="w-full" /></div>
                    <div className="pl-3"><Ln hl={step === 4} className="w-[58%]" /></div>
                    <div className="flex items-center gap-1.5 pt-[2px]">
                      <Ln hl={step === 4} tone="mid" className="w-[4px] shrink-0" />
                      <Ln hl={step === 4} className="w-[85%]" />
                    </div>
                    <div className="pl-3"><Ln hl={step === 4} className="w-full" /></div>
                    <div className="pl-3"><Ln hl={step === 4} className="w-[42%]" /></div>
                  </div>
                </BboxOverlay>

                {/* Schedule of dates */}
                <BboxOverlay el={BBOX_ELEMENTS[4]} visible={visibleBoxes > 4}>
                  <div
                    className={cn(
                      "overflow-hidden rounded-sm border transition-colors duration-400",
                      step === 4 ? "border-info-foreground/20" : "border-foreground/10"
                    )}
                  >
                    <div
                      className={cn(
                        "flex border-b transition-colors duration-400",
                        step === 4
                          ? "border-info-foreground/20 bg-info-foreground/10"
                          : "border-foreground/10 bg-foreground/[0.04]"
                      )}
                    >
                      {[1, 2, 3].map((c) => (
                        <div
                          key={`th-${c}`}
                          className={cn(
                            "flex-1 px-1.5 py-[3px]",
                            c < 3 && "border-r border-foreground/10"
                          )}
                        >
                          <Ln hl={step === 4} tone="mid" className="w-[65%]" />
                        </div>
                      ))}
                    </div>
                    {[0, 1, 2].map((row) => (
                      <div
                        key={`tr-${row}`}
                        className={cn("flex", row < 2 && "border-b border-foreground/[0.06]")}
                      >
                        {[1, 2, 3].map((c) => (
                          <div
                            key={`td-${row}-${c}`}
                            className={cn(
                              "flex-1 px-1.5 py-[3px]",
                              c < 3 && "border-r border-foreground/[0.06]"
                            )}
                          >
                            <div
                              className={cn(
                                "h-[2px] rounded-full transition-all",
                                step === 4 ? "bg-info-foreground/30" : "bg-foreground/8"
                              )}
                              style={{
                                width: `${40 + ((row * c * 17) % 45)}%`,
                                transitionDelay: step === 4 ? `${row * 60}ms` : "0ms",
                                transitionDuration: "400ms",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </BboxOverlay>

                {/* PRAYER — centred short heading */}
                <BboxOverlay el={BBOX_ELEMENTS[5]} visible={visibleBoxes > 5}>
                  <div className="flex justify-center py-0.5">
                    <Ln hl={step === 4} tone="strong" className="h-[3px] w-[20%]" />
                  </div>
                </BboxOverlay>

                {/* Prayer clauses — indented */}
                <BboxOverlay el={BBOX_ELEMENTS[6]} visible={visibleBoxes > 6}>
                  <div className="space-y-[4px] py-0.5 pl-2">
                    <Ln hl={step === 4} className="w-[92%]" />
                    <Ln hl={step === 4} className="w-[85%]" />
                    <Ln hl={step === 4} className="w-[52%]" />
                  </div>
                </BboxOverlay>

                {/* Footer: place/date left, signature + stamp right */}
                <div className="mt-auto flex items-end justify-between pt-1">
                  <div className="space-y-[4px]">
                    <Ln hl={step === 4} className="w-10" />
                    <Ln hl={step === 4} className="w-14" />
                  </div>
                  <div className="w-[40%]">
                    <BboxOverlay el={BBOX_ELEMENTS[7]} visible={visibleBoxes > 7}>
                      {/* pt reserves the seal's height INSIDE this box, so the
                          Stamp bounding box covers mark + signature — an
                          absolutely-positioned child doesn't grow the box. */}
                      <div className="relative pb-1 pt-7">
                        <Ln hl={step === 4} className="ml-auto w-[85%]" />
                        <div className="mt-[4px]">
                          <Ln hl={step === 4} className="ml-auto w-[70%]" />
                        </div>
                        {/* Round seal: double ring + scales, inked slightly
                            off-axis the way a real rubber stamp lands. */}
                        <div
                          className={cn(
                            "absolute top-0 right-1 flex h-9 w-9 -rotate-12 items-center justify-center rounded-full border-[1.5px] transition-colors duration-400",
                            step === 4 ? "border-info-foreground/40" : "border-primary/50"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-400",
                              step === 4 ? "border-info-foreground/30" : "border-primary/35"
                            )}
                          >
                            <Scale
                              className={cn(
                                "h-3 w-3 transition-colors duration-400",
                                step === 4 ? "text-info-foreground/50" : "text-primary/55"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </BboxOverlay>
                  </div>
                </div>

                {/* Uploading shimmer (step 2) */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    step === 2 ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div
                    className="h-full w-full animate-pulse"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, transparent 25%, var(--muted) 50%, transparent 75%)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </div>

                {/* Reading scan line (step 3) */}
                {step === 3 && (
                  <div
                    className="absolute left-0 h-[2px] w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, var(--primary), transparent)",
                      boxShadow: "0 0 8px var(--primary)",
                      animation: "scan-down 1.4s ease-in-out infinite",
                    }}
                  />
                )}
              </div>
            </div>
          </AnimatedItem>

          {/* Completion */}
          <AnimatedItem visible={step >= 14}>
            <div className="flex items-center justify-center gap-1.5 py-1">
              <CheckCircle className="h-3 w-3 text-success-foreground" />
              <span className="text-[10px] font-medium text-success-foreground">
                Read into structured data: 46 elements, stamp included
              </span>
            </div>
          </AnimatedItem>
        </div>
      </ShowcaseFrame>
    </div>
  );
}
