import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Section } from '@/components/section';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import type { PlatformSection as PlatformSectionContent } from '@/data/platform';
import type { ReactNode } from 'react';

/**
 * One movement of the platform page: eyebrow, headline, argument, then the
 * capability list. Prose-only sections (Document intelligence) simply omit
 * `features` — the absence is the point, not an oversight.
 */
export function PlatformSection({
  section,
  variant,
  visual,
  reverse,
}: {
  section: PlatformSectionContent;
  variant?: 'default' | 'muted' | 'accent';
  visual?: ReactNode;
  /** Puts the visual on the left, so consecutive sections alternate. */
  reverse?: boolean;
}) {
  const hasSideContent = Boolean(visual);

  return (
    <Section id={section.id} variant={variant} disableDefaultHeader>
      <div
        className={cn(
          // items-start, not center: with a tall visual in the right column,
          // centring floats the title group into the middle of the band —
          // the heading should anchor at the top like every other section.
          'grid items-start gap-10 lg:gap-14',
          hasSideContent ? 'lg:grid-cols-2' : 'grid-cols-1'
        )}
      >
        <div className={cn(hasSideContent && reverse && 'lg:order-2')}>
          <RevealOnScroll direction="up" duration={0.6}>
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {section.eyebrow}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-5 max-w-2xl">
              {section.headline}
            </h2>
          </RevealOnScroll>

          <div className="space-y-4 max-w-2xl">
            {section.body.map((paragraph) => (
              <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" delay={0.1} duration={0.6}>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              </RevealOnScroll>
            ))}
          </div>

          {section.features && !hasSideContent && (
            <FeatureList features={section.features} className="mt-10" />
          )}
        </div>

        {hasSideContent && (
          <div className={cn(reverse && 'lg:order-1')}>
            <RevealOnScroll direction="up" delay={0.15} duration={0.7}>
              {visual}
            </RevealOnScroll>
          </div>
        )}
      </div>

      {section.features && hasSideContent && (
        <FeatureList features={section.features} className="mt-12" />
      )}
    </Section>
  );
}

export function FeatureList({
  features,
  className,
  lgColumns = 3,
}: {
  features: { title: string; description: string }[];
  className?: string;
  /** Columns at lg+. 2 keeps the md grid all the way up — right for 4-item
   * sets, which would otherwise break 3+1 with a ragged last row. */
  lgColumns?: 2 | 3;
}) {
  const threeUp = lgColumns === 3;
  return (
    <StaggerChildren
      className={cn(
        'grid grid-cols-1 md:grid-cols-2',
        threeUp && 'lg:grid-cols-3',
        className
      )}
      stagger={0.08}
    >
      {features.map((feature, i) => (
        <StaggerItem key={feature.title} className="h-full">
          {/* Shared hairlines between cells, no outer frame. The grid is
              1/2/3 columns by breakpoint, so "first in row" and "first row"
              shift — each breakpoint re-decides its own top/left dividers,
              which is why every rule has an explicit -0 counterpart. At
              lgColumns=2 the md rules simply keep applying at lg. */}
          <div
            className={cn(
              'flex h-full gap-3 border-muted-foreground/25 p-5 lg:p-6',
              i > 0 && 'border-t',
              i % 2 === 1 ? 'md:border-l' : 'md:border-l-0',
              i >= 2 ? 'md:border-t' : 'md:border-t-0',
              threeUp && (i % 3 !== 0 ? 'lg:border-l' : 'lg:border-l-0'),
              threeUp && (i >= 3 ? 'lg:border-t' : 'lg:border-t-0')
            )}
          >
            <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-base font-semibold text-foreground mb-0.5">{feature.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </StaggerItem>
      ))}
      {/* Phantom cells completing a ragged last row, so the hairlines run the
          full grid width (a five-item grid draws its lines like a six-item
          one). Visible only at breakpoints whose column count leaves a gap;
          they use the same index math as real cells, just with no content. */}
      {[0, 1].map((j) => {
        const p = features.length + j;
        const needMd = features.length % 2 !== 0 && j < 2 - (features.length % 2);
        // At lgColumns=2, lg keeps the md layout — its filler need follows md's.
        const needLg = threeUp
          ? features.length % 3 !== 0 && j < 3 - (features.length % 3)
          : needMd;
        if (!needMd && !needLg) return null;
        return (
          // A StaggerItem like its siblings — a plain div would carry no
          // hidden→visible variants and its hairlines would sit at full
          // opacity while the real cells are still fading in.
          <StaggerItem
            key={`filler-${j}`}
            className={cn(
              'hidden h-full',
              needMd ? 'md:block' : 'md:hidden',
              needLg ? 'lg:block' : 'lg:hidden'
            )}
          >
            <div
              aria-hidden
              className={cn(
                'h-full border-muted-foreground/25',
                p % 2 === 1 ? 'md:border-l' : 'md:border-l-0',
                p >= 2 ? 'md:border-t' : 'md:border-t-0',
                threeUp && (p % 3 !== 0 ? 'lg:border-l' : 'lg:border-l-0'),
                threeUp && (p >= 3 ? 'lg:border-t' : 'lg:border-t-0')
              )}
            />
          </StaggerItem>
        );
      })}
    </StaggerChildren>
  );
}
