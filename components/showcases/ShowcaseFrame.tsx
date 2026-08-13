import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * App-window chrome shared by every showcase. Keeps the looping animations
 * reading as "this is the product" rather than as loose floating cards.
 */
export function ShowcaseFrame({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Neutral shadow: the old primary-tinted glow muddied any surface the
        // frame sat over; ambient colour is the section's job, not the card's.
        'w-full overflow-hidden rounded-xl border border-border/70 bg-card shadow-xl',
        className
      )}
    >
      {/* macOS-style title bar: traffic lights pinned left, title centred.
          Real traffic-light hues (close/minimise/zoom) with an inset ring so
          they hold shape on the light bar; dimmed slightly in dark mode the
          way an unfocused Mac window dims them. */}
      <div className="relative flex items-center justify-center border-b border-border/70 bg-muted/60 px-3 py-2.5">
        <span className="absolute left-3 flex gap-2" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/10 dark:brightness-75" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/10 dark:brightness-75" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/10 dark:brightness-75" />
        </span>
        <span className="truncate px-16 text-[11px] font-medium text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
