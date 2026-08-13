import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/animations';
import { getTool } from '@/data/tools';
import type { NavLink } from '@/data/navigation';

/**
 * The tools-index card grid, shared with the homepage so both render the
 * lineup identically: icon chip, serif label, one-liner, and a footer that
 * tells the truth about pricing (`kind: 'front-door'` is the free source).
 */
export function ToolGrid({ items }: { items: NavLink[] }) {
  return (
    <StaggerChildren
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      stagger={0.08}
    >
      {items.map((tool) => {
        const slug = tool.href.split('/').pop() ?? '';
        const isFrontDoor = getTool(slug)?.kind === 'front-door';
        return (
          <StaggerItem key={tool.href} className="h-full">
            <Link
              href={tool.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              {tool.icon && (
                <span className="w-fit rounded-lg border border-border/60 bg-accent/40 p-2.5">
                  <tool.icon className="h-5 w-5 text-primary" />
                </span>
              )}

              <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight">
                {tool.label}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {tool.description}
              </p>

              <span className="mt-auto flex items-center justify-between pt-6">
                {isFrontDoor ? (
                  <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Free on Lexli
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    A Lexli platform tool
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </StaggerItem>
        );
      })}
    </StaggerChildren>
  );
}
