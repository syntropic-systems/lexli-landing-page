import { StaggerChildren, StaggerItem } from '@/components/animations';

export type Step = { title: string; description: string };

/**
 * Numbered "how it works" sequence. Vertical rail on the left ties the steps
 * into one movement, so a four-step list reads as a process rather than four
 * unrelated cards.
 */
export function StepsList({ steps }: { steps: Step[] }) {
  return (
    <StaggerChildren className="relative max-w-3xl" stagger={0.12}>
      {steps.map((step, index) => (
        <StaggerItem key={step.title}>
          <div className="relative flex gap-5 pb-10 last:pb-0">
            {/* Rail — stops at the last marker rather than trailing past it. */}
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute left-5 top-11 bottom-0 w-px bg-border"
              />
            )}
            <span className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-serif text-lg font-semibold text-primary">
              {index + 1}
            </span>
            <div className="pt-1.5">
              <h3 className="font-serif text-lg font-semibold tracking-tight mb-1">
                {step.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
