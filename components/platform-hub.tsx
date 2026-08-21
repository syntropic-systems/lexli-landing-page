import Link from 'next/link';
import { ArrowRight, Wrench, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeAwareImage } from '@/components/theme-aware-image';
import { ShowcaseFrame } from '@/components/showcases/ShowcaseFrame';
import { allTools } from '@/data/navigation';

/**
 * The tool-in-the-platform diagram: a 16:9 product frame at the centre (the
 * active tool's screen), three tool nodes above and three below, connector
 * lines running into the frame. The active node keeps the marching-dash line;
 * the other five link across — the tool pages' only cross-navigation.
 *
 * Screenshots: light/dark 16:9 captures live in /public/tools and are
 * registered in TOOL_IMAGES (per tool) and PLATFORM_IMAGE (homepage, no
 * active tool); a tool without an entry renders the abstract skeleton.
 */

type HubTool = {
  slug: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Derived from the site-wide tool order (data/navigation) so the hub can never
 * drift out of sequence with the nav, footer, and grids — icons included.
 * First three render above the frame, last three below.
 */
const HUB_TOOLS: HubTool[] = allTools.map((tool) => ({
  slug: tool.href.split('/').pop() ?? '',
  label: tool.label,
  href: tool.href,
  icon: tool.icon ?? Wrench,
}));

/**
 * slug → light/dark screenshot paths under /public/tools. Drafting and eFiling
 * have no captures yet and fall back to the skeleton. (case_finder2_* is an
 * alternate Case Finder capture, kept on disk, not wired.)
 */
const TOOL_IMAGES: Record<string, { light: string; dark: string }> = {
  'daily-board': { light: '/tools/daily_board_light.png', dark: '/tools/daily_board_dark.png' },
  'case-finder': { light: '/tools/case_finder_light.png', dark: '/tools/case_finder_dark.png' },
  'legal-translator': { light: '/tools/translator_light.png', dark: '/tools/translator_dark.png' },
  'document-scanner': { light: '/tools/scanner_light.png', dark: '/tools/scanner_dark.png' },
};

/** The frame's capture when no tool is active (the homepage hub): the workspace itself. */
const PLATFORM_IMAGE = { light: '/pages/home_light.png', dark: '/pages/home_dark.png' };

/** Node centres and frame attach points, in % of the connector strip width. */
const NODE_X = [16.66, 50, 83.33];
const FRAME_X = [32, 50, 68];

function ConnectorStrip({
  tools,
  activeSlug,
  flip,
}: {
  tools: HubTool[];
  activeSlug: string;
  /** Bottom strip: lines run frame → nodes, so mirror the geometry. */
  flip?: boolean;
}) {
  return (
    <svg
      aria-hidden
      className="h-10 w-full md:h-16"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {tools.map((tool, i) => {
        const isActive = tool.slug === activeSlug;
        const nodeY = flip ? 100 : 0;
        const frameY = flip ? 0 : 100;
        const midA = flip ? 45 : 55;
        const midB = flip ? 55 : 45;
        return (
          <path
            key={tool.slug}
            // S-curve: leaves the node vertically, enters the frame
            // vertically — flow-line language instead of drafted diagonals.
            d={`M ${NODE_X[i]} ${nodeY} C ${NODE_X[i]} ${midA}, ${FRAME_X[i]} ${midB}, ${FRAME_X[i]} ${frameY}`}
            fill="none"
            vectorEffect="non-scaling-stroke"
            className={cn(
              isActive
                ? 'stroke-primary/80 stroke-[1.5] [stroke-dasharray:6_5] animate-dash-flow'
                : 'stroke-muted-foreground/30 stroke-1'
            )}
          />
        );
      })}
    </svg>
  );
}

function NodeRow({ tools, activeSlug }: { tools: HubTool[]; activeSlug: string }) {
  return (
    <div className="grid grid-cols-3">
      {tools.map((tool) => {
        const isActive = tool.slug === activeSlug;
        const node = (
          <span
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-medium shadow-sm transition-all duration-200',
              isActive
                ? 'border-primary bg-primary text-primary-foreground ring-4 ring-primary/20'
                : 'border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-md'
            )}
          >
            <tool.icon className="h-3.5 w-3.5" />
            {tool.label}
          </span>
        );
        return (
          <div key={tool.slug} className="flex justify-center">
            {isActive ? node : <Link href={tool.href}>{node}</Link>}
          </div>
        );
      })}
    </div>
  );
}

/** Abstract app skeleton for tools without a screenshot yet — claims nothing. */
function FrameSkeleton() {
  return (
    <div className="flex aspect-video w-full bg-card">
      {/* Sidebar */}
      <div className="hidden w-[18%] flex-col gap-2 border-r border-border/60 bg-muted/40 p-3 sm:flex">
        <div className="h-2 w-3/4 rounded-sm bg-foreground/15" />
        {['w-full', 'w-5/6', 'w-full', 'w-2/3'].map((w, i) => (
          <div key={i} className={cn('h-1.5 rounded-sm bg-foreground/8', w)} />
        ))}
      </div>
      {/* Main pane */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-1/3 rounded-sm bg-foreground/15" />
          <div className="h-5 w-16 rounded-md bg-primary/20" />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-3">
            {['w-2/3', 'w-full', 'w-5/6', 'w-full', 'w-1/2'].map((w, i) => (
              <div key={i} className={cn('h-1.5 rounded-sm bg-foreground/10', w)} />
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-3">
            <div className="h-1.5 w-3/4 rounded-sm bg-foreground/10" />
            <div className="mt-auto h-8 rounded-md bg-muted/70" />
            <div className="h-8 rounded-md bg-muted/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlatformHub({
  activeSlug,
  frameOnly = false,
  imageOverride,
}: {
  activeSlug: string;
  /** Just the centre frame (ghosts and glow included) — no tool nodes or
   * connectors. For pages where the tools roll-call lives elsewhere. */
  frameOnly?: boolean;
  /** Replace the frame's capture (and its title/alt) — for pages whose frame
   * should show something other than the workspace hub or a tool. */
  imageOverride?: { light: string; dark: string; title: string; alt: string };
}) {
  const topTools = HUB_TOOLS.slice(0, 3);
  const bottomTools = HUB_TOOLS.slice(3);
  // No active tool → the platform capture; a tool without a capture → skeleton.
  const image = imageOverride ?? (activeSlug ? TOOL_IMAGES[activeSlug] : PLATFORM_IMAGE);
  const activeTool = HUB_TOOLS.find((tool) => tool.slug === activeSlug);
  const activeLabel = activeTool?.label ?? 'Lexli';
  const frameTitle =
    imageOverride?.title ?? (activeTool ? `${activeLabel} on Lexli` : 'The Lexli workspace');
  const frameAlt =
    imageOverride?.alt ??
    (activeTool
      ? `${activeLabel} inside the Lexli platform`
      : 'The Lexli workspace: cases, files, and tools on one record');

  return (
    <div aria-label="Every Lexli tool works from the same case record">
      {/* Full composition — needs vertical room, so sm+ only. */}
      <div className="mx-auto hidden w-full max-w-4xl sm:block">
        {!frameOnly && (
          <>
            <NodeRow tools={topTools} activeSlug={activeSlug} />
            <ConnectorStrip tools={topTools} activeSlug={activeSlug} />
          </>
        )}

        {/* Centre frame with the record-stack ghosts behind it. Hovering the
            frame fans the ghosts out — the record showing its layers. */}
        <div className="group relative">
          {/* Glow: a blurred solid, nothing clever. The blur filter paints
              beyond the element's box on its own, so it cannot be cropped —
              unlike a radial gradient, which dies at its div edge. */}
          <div
            aria-hidden
            className="absolute inset-4 rounded-3xl bg-primary/20 blur-2xl dark:bg-primary/25"
          />
          <div
            aria-hidden
            className="absolute inset-0 translate-x-2 translate-y-1.5 rotate-1 rounded-xl border border-border bg-card blur-[2px] transition-all duration-300 ease-out group-hover:translate-x-3.5 group-hover:translate-y-2.5 group-hover:rotate-[1.5deg] group-hover:blur-[1px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -translate-x-1.5 translate-y-1 -rotate-1 rounded-xl border border-border bg-card blur-[1px] transition-all duration-300 ease-out group-hover:-translate-x-3 group-hover:translate-y-2 group-hover:-rotate-[1.5deg] group-hover:blur-[0.5px]"
          />
          <div className="relative">
            {/* Modest shadow — just enough depth to lift the frame off the
                ghost cards. */}
            <ShowcaseFrame title={frameTitle} className="shadow-md">
              {image ? (
                <ThemeAwareImage
                  src={image.light}
                  srcDark={image.dark}
                  alt={frameAlt}
                  width={1600}
                  height={900}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <FrameSkeleton />
              )}
            </ShowcaseFrame>
          </div>
        </div>

        {!frameOnly && (
          <>
            <ConnectorStrip tools={bottomTools} activeSlug={activeSlug} flip />
            <NodeRow tools={bottomTools} activeSlug={activeSlug} />
          </>
        )}
      </div>

      {/* Below sm the diagram's story lives in geometry that has no room —
          so no node tiles: just the frame, and one quiet route to the rest.
          Cross-navigation already exists in the nav sheet and footer. */}
      <div className="flex flex-col gap-4 sm:hidden">
        <ShowcaseFrame title={frameTitle}>
          {image ? (
            <ThemeAwareImage
              src={image.light}
              srcDark={image.dark}
              alt={frameAlt}
              width={1600}
              height={900}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <FrameSkeleton />
          )}
        </ShowcaseFrame>
        {!frameOnly && (
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            One record, six tools. See the rest
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
