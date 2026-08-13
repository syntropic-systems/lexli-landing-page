import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaggerChildren, StaggerItem } from '@/components/animations';

export type HowItWorksStep = {
  title: string;
  description: string;
  /** /public path for the step's 3:2 visual; the numeral vignette is the
   * fallback while a step has no image yet. */
  image?: string;
};

/** "Step one" … kickers; falls back to the bare number past six. */
const STEP_WORDS = ['one', 'two', 'three', 'four', 'five', 'six'];

/**
 * Static class list (not template-built — Tailwind only emits classes it can
 * see verbatim): earlier cards stack above later ones so each gutter badge
 * stays over its right-hand neighbour even mid-animation.
 */
const Z_ORDER = ['z-[6]', 'z-[5]', 'z-[4]', 'z-[3]', 'z-[2]', 'z-[1]'];

/**
 * Horizontal "how it works" cards: kicker, title, a large serif numeral as the
 * card's vignette, and the description as the payoff line. Circular arrow
 * connectors sit in the gutters at lg+ to carry the left-to-right flow;
 * below lg the cards stack and the arrows disappear (a downward flow needs
 * no signposting).
 */
export function HowItWorksSteps({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <StaggerChildren
      className={cn(
        // Tight gutter on purpose: the connector badge has to straddle the
        // seam between cards, and a wide gap turns it into a floating dot.
        'grid grid-cols-1 gap-4 sm:grid-cols-2',
        steps.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
      )}
      stagger={0.12}
    >
      {steps.map((step, index) => (
        <StaggerItem
          key={step.title}
          // Descending z per item: while the entrance animation runs, each
          // item's transform creates a stacking context and DOM order would
          // paint the NEXT card over this card's gutter badge — the badge's
          // own z-10 can't cross contexts. Earlier-item-on-top keeps the
          // badges above their right-hand neighbours throughout.
          className={cn('relative h-full', Z_ORDER[index] ?? 'z-0')}
        >
          <div className="flex h-full flex-col rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Step {STEP_WORDS[index] ?? index + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{step.title}</h3>

            {/* Step visual, 3:2. The muted surface is the box's permanent
                backdrop; the numeral is only the fallback while a step has
                no image — the image renders on top of the same bg. */}
            <div className="my-5 flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-lg bg-muted/60">
              {step.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={step.image} alt="" className="h-full w-full object-contain" />
              ) : (
                <span
                  aria-hidden
                  className="font-serif text-6xl font-semibold leading-none text-primary/20"
                >
                  {index + 1}
                </span>
              )}
            </div>

            {/* Top-aligned, not mt-auto: when one card's longer description
                stretches the row, the others' text stays snug under the
                vignette instead of sinking to the bottom of the taller card. */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>

          {/* Gutter connector — lg+ only, skipped after the last card. Centred
              on the seam: with gap-4 (1rem) the seam's midline is 0.5rem past
              the card edge, so a 2.25rem badge needs right: -(0.5 + 1.125)rem.
              At that size it overlaps each neighbour by ~10px — it reads as
              pinned across the joint, not floating in the gap. The thick
              low-alpha ring (not a 1px border) is the badge's soft outer
              circle. */}
          {index < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute top-1/2 -right-[1.5rem] z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-accent ring-8 ring-accent/50 shadow-md lg:flex"
            >
              <ArrowRight className="h-4 w-4 text-primary" />
            </span>
          )}
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
