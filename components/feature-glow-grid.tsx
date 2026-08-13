import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { StaggerChildren, StaggerItem } from '@/components/animations';

export type GlowFeature = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

/**
 * The glow card shell: Aceternity's mouse-tracked glowing border riding the
 * padded outer ring, content card floating inside it. That inset is what makes
 * the glow read as a halo rather than an outline — keep the outer p-1.5.
 */
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="relative h-full rounded-xl border border-border/60 p-1.5">
      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} />
      <div
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-lg bg-card p-5 shadow-sm',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function FeatureGlowGrid({
  features,
  columns = 3,
  footer,
}: {
  features: GlowFeature[];
  /** Cards per row at lg — 4 suits four-item rows like Security's. */
  columns?: 3 | 4;
  /** Optional full-width closing card spanning the grid's last row. */
  footer?: ReactNode;
}) {
  return (
    <StaggerChildren
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-2',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      )}
      stagger={0.08}
    >
      {features.map((feature) => (
        <StaggerItem key={feature.title} className="h-full">
          <GlowCard className="gap-3">
            <span className="w-fit rounded-lg border border-border/60 bg-accent/40 p-2">
              <feature.icon className="h-4 w-4 text-primary" />
            </span>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-foreground">{feature.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </GlowCard>
        </StaggerItem>
      ))}
      {footer && (
        <StaggerItem className="col-span-full h-full">
          <GlowCard className="gap-4 p-6">{footer}</GlowCard>
        </StaggerItem>
      )}
    </StaggerChildren>
  );
}
