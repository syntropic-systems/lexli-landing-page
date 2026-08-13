import type { ReactNode } from 'react';
import { PageHero } from '@/components/page-hero';
import { Section } from '@/components/section';
import { CTASection } from '@/components/cta-section';
import { HowItWorksSteps } from '@/components/how-it-works-steps';
import { FeatureGlowGrid } from '@/components/feature-glow-grid';
import { PlatformHub } from '@/components/platform-hub';
import { RevealOnScroll } from '@/components/animations';
import { APP_URL, CTA, DEMO_HREF } from '@/lib/site';
import type { ToolPage as ToolPageContent } from '@/data/tools';

/**
 * One composition for all six tool pages. The two kinds differ only in how they
 * ask for the next step: a front door sells a free account, an inside tool sells
 * the workspace.
 */
export function ToolPage({
  tool,
  visual,
}: {
  tool: ToolPageContent;
  visual?: ReactNode;
}) {
  const isFrontDoor = tool.kind === 'front-door';

  const heroPrimary = isFrontDoor
    ? { text: `Try ${tool.name} free`, href: APP_URL }
    : { text: CTA.startOnLexli, href: APP_URL };
  const heroSecondary = isFrontDoor
    ? { text: 'How it works', href: '#how-it-works' }
    : { text: CTA.bookDemo, href: DEMO_HREF };

  return (
    <div>
      <PageHero
        eyebrow={tool.eyebrow}
        title={tool.hero.headline}
        description={tool.hero.subhead}
        primaryCta={heroPrimary}
        secondaryCta={heroSecondary}
        visual={visual}
      />

      <Section
        id="how-it-works"
        title="How it works"
        titleAlign="center"
        header={
          <RevealOnScroll direction="up" duration={0.6}>
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              The flow
            </p>
          </RevealOnScroll>
        }
      >
        <HowItWorksSteps steps={tool.steps} />
      </Section>

      <Section
        id="features"
        variant="muted"
        title="What it does"
        header={
          <RevealOnScroll direction="up" duration={0.6}>
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Capabilities
            </p>
          </RevealOnScroll>
        }
      >
        <FeatureGlowGrid features={tool.features} />
      </Section>

      {/* Stacked, not side-by-side: the 16:9 frame needs the full measure —
          at half-column width a screenshot is an illegible thumbnail.
          Order is argument → evidence → verdict: prose makes the claim, the
          diagram shows it, and the draft's closing line lands it, centred
          under the diagram as the section's last word. */}
      <Section
        id="better-inside"
        title="Better inside the platform"
        titleAlign="center"
        header={
          <RevealOnScroll direction="up" duration={0.6}>
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              The platform
            </p>
          </RevealOnScroll>
        }
      >
        {/* Centred like the rest of the section's axis — safe only because
            these paragraphs render 2–3 lines; if the copy grows, re-left it. */}
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          {tool.platform.paragraphs.map((paragraph) => (
            <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" duration={0.6}>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            </RevealOnScroll>
          ))}
        </div>
        <RevealOnScroll direction="up" delay={0.15} duration={0.7}>
          <div className="mt-12 md:mt-16">
            <PlatformHub activeSlug={tool.slug} />
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
          <p className="mx-auto mt-12 max-w-3xl text-center font-serif text-2xl md:text-3xl font-semibold text-foreground md:mt-16">
            {tool.platform.line}
          </p>
        </RevealOnScroll>
      </Section>

      <CTASection
        title={tool.finalCta.headline}
        description={tool.finalCta.subhead}
        primaryCta={{
          text: isFrontDoor ? CTA.startFree : CTA.startOnLexli,
          href: APP_URL,
        }}
        secondaryCta={
          isFrontDoor
            ? { text: CTA.explorePlatform, href: '/platform' }
            : { text: CTA.bookDemo, href: DEMO_HREF }
        }
      />
    </div>
  );
}
