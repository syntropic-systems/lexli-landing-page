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
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-5', className)}>
      <span
        aria-hidden
        className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary to-primary/30"
      />
      <p className="font-serif text-xl font-semibold text-foreground md:text-2xl">{children}</p>
    </div>
  );
}
