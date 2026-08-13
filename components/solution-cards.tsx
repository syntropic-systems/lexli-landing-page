import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/animations';
import { solutions } from '@/data/navigation';

/**
 * The three persona doors from the solutions index, shared with the homepage.
 * Same card anatomy as the tools grid: icon chip, serif label, one-liner,
 * footer link. The detail pages' hero headlines stay on their own pages.
 */
export function SolutionCards() {
  return (
    <StaggerChildren className="grid grid-cols-1 gap-4 md:grid-cols-3" stagger={0.1}>
      {solutions.map((solution) => (
        <StaggerItem key={solution.href} className="h-full">
          <Link
            href={solution.href}
            className="group flex h-full flex-col rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            {solution.icon && (
              <span className="w-fit rounded-lg border border-border/60 bg-accent/40 p-2.5">
                <solution.icon className="h-5 w-5 text-primary" />
              </span>
            )}

            <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight">
              {solution.label}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {solution.description}
            </p>

            <span className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold text-primary">
              See your day on Lexli
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
