import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The site's verdict line — a gradient side bar against a serif conclusion.
 * The pattern for closing beats and hand-offs: thesis closers, consent lines,
 * section transitions. Layout (margins, max-w, reveal animation) stays with
 * the caller; this owns only the bar-and-text pairing.
 */
export function VerdictLine({
  children,
  className,
  textClassName,
}: {
  children: ReactNode;
  className?: string;
  /** Overrides the text size, e.g. 'text-2xl md:text-3xl' to match the
   * platform line under the hub on tool pages. */
  textClassName?: string;
}) {
  return (
    <div className={cn('flex items-center gap-5', className)}>
      <span
        aria-hidden
        className="w-[3px] self-stretch rounded-full bg-gradient-to-b from-primary to-primary/30"
      />
      <p className={cn('font-serif font-semibold text-foreground', textClassName ?? 'text-xl md:text-2xl')}>
        {children}
      </p>
    </div>
  );
}
