import { cn } from '@/lib/utils';
import { RoutingPillGroups } from '@/components/routing-pill';
import { PageHero } from '@/components/page-hero';
import { Section } from '@/components/section';
import { CTASection } from '@/components/cta-section';
import { VerdictLine } from '@/components/verdict-line';
import { FeatureList } from '@/components/platform-section';
import { GlowCard } from '@/components/feature-glow-grid';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import { APP_URL, CTA, DEMO_HREF } from '@/lib/site';
import type { SolutionBlock, SolutionPage as SolutionPageContent } from '@/data/solutions';

/**
 * One renderer for all three persona pages. The blocks differ per page because
 * the personas do: recognition scenes for a litigator, control sections for a
 * firm. The composition stays shared so they read as one family — and each
 * block kind borrows its styling from the site's established languages:
 * lattice for bullets, card-anatomy for moments and routing, VerdictLine for
 * closers.
 */
export function SolutionPage({ page }: { page: SolutionPageContent }) {
  const leadsFree = page.ctaLead === 'free';

  const primaryCta = leadsFree
    ? { text: CTA.startFree, href: APP_URL }
    : { text: CTA.bookDemo, href: DEMO_HREF };
  const secondaryCta = leadsFree
    ? { text: CTA.explorePlatform, href: '/platform' }
    : { text: CTA.startFreeShort, href: APP_URL };

  return (
    <div>
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.headline}
        description={page.hero.subhead}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />

      {page.blocks.map((block, index) => (
        <BlockSection
          key={block.title}
          block={block}
          variant={index % 2 === 1 ? 'muted' : 'default'}
        />
      ))}

      <CTASection
        title={page.finalCta.headline}
        description={page.finalCta.subhead}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
    </div>
  );
}

function BlockSection({
  block,
  variant,
}: {
  block: SolutionBlock;
  variant: 'default' | 'muted';
}) {
  // Scenes sections run as a two-column split (claim left, scenes right), so
  // their heading lives in the content area rather than the Section header.
  const splitLayout = block.kind === 'scenes';

  return (
    <Section
      title={splitLayout ? undefined : block.title}
      // A bullets or routing intro is the section's lead-in, so it rides as
      // the header's description instead of as loose text in the content area.
      description={
        block.kind === 'bullets' || block.kind === 'routing' ? block.intro : undefined
      }
      variant={variant}
      header={
        !splitLayout && 'eyebrow' in block && block.eyebrow ? (
          <RevealOnScroll direction="up" duration={0.6}>
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {block.eyebrow}
            </p>
          </RevealOnScroll>
        ) : undefined
      }
    >
      {block.kind === 'scenes' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll direction="up" duration={0.6}>
            {block.eyebrow && (
              <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                {block.eyebrow}
              </p>
            )}
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
              {block.title}
            </h2>
          </RevealOnScroll>
          <div className="max-w-2xl">
            <StaggerChildren className="space-y-6" stagger={0.12}>
              {block.scenes.map((scene) => (
                <StaggerItem key={scene.slice(0, 40)}>
                  {/* Scenes carry no commentary — the reader supplies the
                      feeling. The rail stays grey on purpose (quieter than a
                      verdict line), but on the muted-foreground stroke so it
                      survives light mode — the `border` token vanishes there. */}
                  <p className="border-l-2 border-muted-foreground/25 pl-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                    {scene}
                  </p>
                </StaggerItem>
              ))}
            </StaggerChildren>
            {block.closer && (
              <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
                <VerdictLine className="mt-8">{block.closer}</VerdictLine>
              </RevealOnScroll>
            )}
          </div>
        </div>
      )}

      {block.kind === 'moments' && (
        // Grid follows the count: three items as one 3-across row, four as
        // one 4-across row at lg (folding to 2×2 on tablets) — the Security
        // grid's shape, and on advocates the row reads as the day's timeline.
        <div>
          {block.intro && (
            <RevealOnScroll direction="up" duration={0.6}>
              <p className="mb-8 max-w-3xl text-base md:text-lg text-muted-foreground">
                {block.intro}
              </p>
            </RevealOnScroll>
          )}
          <StaggerChildren
            className={cn(
              'grid grid-cols-1 gap-4',
              block.moments.length === 3
                ? 'md:grid-cols-3'
                : 'md:grid-cols-2 lg:grid-cols-4'
            )}
            stagger={0.1}
          >
            {block.moments.map((moment) => (
              <StaggerItem key={moment.label} className="h-full">
                {/* The glow-card register exactly as platform Security and
                    the tools grids carry it — solutions matches, not forks. */}
                <GlowCard className="gap-3">
                  <span className="w-fit rounded-lg border border-border/60 bg-accent/40 p-2">
                    <moment.icon className="h-4 w-4 text-primary" />
                  </span>
                  <div className="space-y-1.5">
                    <p className="text-base font-semibold text-foreground">{moment.label}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {moment.text}
                    </p>
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      )}

      {block.kind === 'prose' && (
        <div className="max-w-3xl space-y-4">
          {block.paragraphs.map((paragraph) => (
            <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" duration={0.6}>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      )}

      {block.kind === 'bullets' && (
        <>
          {/* The platform page's hairline lattice — same shape of data, same
              component, so the two pages speak one feature language. Four-item
              sets run 2×2 instead of breaking 3+1. */}
          <FeatureList
            features={block.bullets}
            lgColumns={block.bullets.length === 4 ? 2 : 3}
          />
          {block.closer && (
            <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
              <VerdictLine className="mt-10 max-w-3xl">{block.closer}</VerdictLine>
            </RevealOnScroll>
          )}
          {block.outro && (
            <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
              <p className="mt-4 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
                {block.outro}
              </p>
            </RevealOnScroll>
          )}
        </>
      )}

      {block.kind === 'routing' && (
        // One wayfinding language for every routing strip: labelled pill
        // rows, no arrows. References get an inviting "Explore" kicker; the
        // sequence style keeps its two guiding rows — the free doors first,
        // the platform depth under them — with order as the recommendation.
        <RoutingPillGroups
          groups={
            block.style === 'references'
              ? [{ label: 'Explore', links: block.links }]
              : [
                  { label: 'Start here', links: block.links.filter((link) => link.free) },
                  {
                    label: 'Then, the platform',
                    links: block.links.filter((link) => !link.free),
                  },
                ]
          }
        />
      )}
    </Section>
  );
}
