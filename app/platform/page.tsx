import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { Section } from '@/components/section';
import { CTASection } from '@/components/cta-section';
import { PlatformSection } from '@/components/platform-section';
import { VerdictLine } from '@/components/verdict-line';
import { FeatureGlowGrid } from '@/components/feature-glow-grid';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import {
  AdvancedSearchShowcase,
  AssistantShowcase,
  CaseRecordShowcase,
  DocumentIntelligenceShowcase,
} from '@/components/showcases';
import {
  accounts,
  integrations,
  intelligenceLayer,
  intelligenceTransition,
  platformCta,
  platformHero,
  platformThesis,
  security,
  spine,
} from '@/data/platform';
import { allTools } from '@/data/navigation';
import { APP_URL, CTA, DEMO_HREF, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Platform - the AI workspace for Indian legal practice',
  description:
    'Cases, files, hearings, and research in one workspace, with every Lexli tool working from the same record. Built for advocates, teams, and firms across India.',
  alternates: { canonical: `${SITE_URL}/platform` },
  openGraph: {
    title: 'Lexli Platform - the AI workspace for Indian legal practice',
    description:
      'Cases, files, hearings, and research in one workspace, with every Lexli tool working from the same record.',
    url: `${SITE_URL}/platform`,
  },
};

const [assistant, documentIntelligence, legalResearch, advancedSearch] = intelligenceLayer;

export default function PlatformPage() {
  return (
    <div>
      <PageHero
        eyebrow={platformHero.eyebrow}
        title={platformHero.headline}
        description={platformHero.subhead}
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.bookDemo, href: DEMO_HREF }}
      />

      {/* Thesis strip — no heading. The rest of the page is its proof. The
          closer takes the gradient side bar: it's the same verdict-line
          species as the intelligence transition and the tools-page line. */}
      <Section>
        <div className="max-w-3xl space-y-5">
          {platformThesis.map((paragraph, index) =>
            index === platformThesis.length - 1 ? (
              <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" duration={0.6}>
                <VerdictLine className="pt-2">{paragraph}</VerdictLine>
              </RevealOnScroll>
            ) : (
              <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" duration={0.6}>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              </RevealOnScroll>
            )
          )}
        </div>
      </Section>

      {/* Group 1 — the spine */}
      <PlatformSection section={spine} variant="muted" visual={<CaseRecordShowcase />} />

      {/* Group 2 — the intelligence layer. The transition line is an intro to
          the group that follows, so its section drops the bottom padding and
          hands straight into the AI Assistant section. */}
      <Section className="pb-0 md:pb-0 lg:pb-0">
        <RevealOnScroll direction="up" duration={0.6}>
          <VerdictLine className="max-w-3xl">{intelligenceTransition}</VerdictLine>
        </RevealOnScroll>
      </Section>

      <PlatformSection section={assistant} visual={<AssistantShowcase />} />
      {/* reverse: visual left, alternating with the assistant section above */}
      <PlatformSection
        section={documentIntelligence}
        variant="accent"
        visual={<DocumentIntelligenceShowcase />}
        reverse
      />
      <PlatformSection section={legalResearch} />
      <PlatformSection
        section={advancedSearch}
        variant="muted"
        visual={<AdvancedSearchShowcase />}
      />

      {/* Group 3 — built for how you work */}
      <PlatformSection section={accounts} />

      {/* Group 4 — trust. Flat register from here to the end of Integrations. */}
      <Section
        id={security.id}
        variant="muted"
        disableDefaultHeader
      >
        <RevealOnScroll direction="up" duration={0.6}>
          <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            {security.eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-5 max-w-2xl">
            {security.headline}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mb-10">
            {security.body}
          </p>
        </RevealOnScroll>

        {/* Glow grid for motion parity: sections with showcases carry their
            own movement, and this one has none without it. The compliance
            strip rides as the grid's full-width fifth card. Its chips keep
            the explicit status word — "Aligned"/"Ready", never "Certified". */}
        <FeatureGlowGrid
          features={security.details}
          columns={4}
          footer={
            <>
              <div className="flex flex-wrap items-center gap-2">
                {/* Chip style matches the feature cards' icon boxes —
                    rounded-lg on accent, not pill-round on muted. */}
                {security.complianceBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-accent/40 px-3 py-2 text-xs"
                  >
                    <span className="font-semibold uppercase tracking-wide text-primary">
                      {badge.label}
                    </span>
                    <span className="text-primary/70">{badge.status}</span>
                  </span>
                ))}
                <span aria-hidden className="mx-1 hidden h-4 w-px bg-border sm:block" />
                {security.infrastructure.map((vendor) => (
                  <span
                    key={vendor}
                    className="inline-flex items-center rounded-lg border border-border/60 bg-accent/40 px-3 py-2 text-xs font-semibold text-primary"
                  >
                    {vendor}
                  </span>
                ))}
              </div>
              <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
                {security.compliance}
              </p>
            </>
          }
        />
      </Section>

      <Section id={integrations.id} disableDefaultHeader>
        <RevealOnScroll direction="up" duration={0.6}>
          <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            {integrations.eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-5 max-w-2xl">
            {integrations.headline}
          </h2>
        </RevealOnScroll>

        <div className="max-w-3xl space-y-4">
          {integrations.body.map((paragraph) => (
            <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" delay={0.1} duration={0.6}>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            </RevealOnScroll>
          ))}
          <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
            <VerdictLine className="py-1">{integrations.consentLine}</VerdictLine>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={0.2} duration={0.6}>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {integrations.close}
            </p>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Closing — the tools. A conclusion, not an index: /tools carries the
          descriptions and badges; this is the roll-call that cashes out the
          page's argument, in the hub's node-tile language. */}
      <Section
        title="And six tools that live inside it."
        description="Each one works on its own. Each one works better here, because it shares the platform's cases, files, and context."
        header={
          <RevealOnScroll direction="up" duration={0.6}>
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              The tools
            </p>
          </RevealOnScroll>
        }
      >
        <StaggerChildren className="flex flex-wrap gap-3" stagger={0.06}>
          {allTools.map((tool) => (
            <StaggerItem key={tool.href}>
              <Link
                href={tool.href}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-md"
              >
                {tool.icon && <tool.icon className="h-4 w-4 text-primary" />}
                {tool.label}
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <Link
            href="/tools"
            className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            See all six tools
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </RevealOnScroll>
      </Section>

      <CTASection
        title={platformCta.headline}
        description={platformCta.subhead}
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.bookDemo, href: DEMO_HREF }}
      />
    </div>
  );
}
