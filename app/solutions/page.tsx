import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Section } from '@/components/section';
import { CTASection } from '@/components/cta-section';
import { VerdictLine } from '@/components/verdict-line';
import { SolutionCards } from '@/components/solution-cards';
import { PlatformSection } from '@/components/platform-section';
import { PlatformHub } from '@/components/platform-hub';
import { RevealOnScroll } from '@/components/animations';
import { accounts } from '@/data/solutions';
import { APP_URL, CTA, DEMO_HREF, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Solutions - for advocates, firms, and the staff who keep them running',
  description:
    'Lexli for solo advocates and small chambers, for law firms and businesses, and for the clerks and legal staff who work the same case record.',
  alternates: { canonical: `${SITE_URL}/solutions` },
  openGraph: {
    title: 'Lexli Solutions - for advocates, firms, and the staff who keep them running',
    description:
      'Lexli for solo advocates and small chambers, for law firms and businesses, and for the clerks and legal staff who work the same case record.',
    url: `${SITE_URL}/solutions`,
  },
};

export default function SolutionsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Solutions"
        title="Same record. Different hands."
        description="A solo litigator, a firm with partners and juniors, and the staff who keep both moving all need the same case record, and a different view of it. Pick the one that describes your day."
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.bookDemo, href: DEMO_HREF }}
      />

      <Section
        header={
          <RevealOnScroll direction="up" duration={0.6}>
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Who you are
            </p>
          </RevealOnScroll>
        }
        title="Three doors. One workspace."
      >
        <SolutionCards />

        {/* The hero's thesis, cashed out after the three doors. */}
        <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
          <VerdictLine className="mt-12 max-w-3xl md:mt-16">
            Whichever door you take, it opens on the same case record.
          </VerdictLine>
        </RevealOnScroll>
      </Section>

      {/* Accounts and profiles — how the workspace is shaped around who you
          are. Moved here from /platform; `/solutions#accounts` is the anchor
          the solution pages' routing strips point at. The workspace frame follows the
          feature rows — frame only, no tool nodes; the roll-call lives on
          /platform and /tools. */}
      <PlatformSection section={accounts} variant="muted">
        <RevealOnScroll direction="up" delay={0.15} duration={0.7}>
          <div className="mt-12 md:mt-16">
            <PlatformHub activeSlug="" frameOnly />
          </div>
        </RevealOnScroll>
      </PlatformSection>

      <CTASection
        title="Start with your own day."
        description="Create a free account and bring in one case, or talk to us about the team around it."
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.bookDemo, href: DEMO_HREF }}
      />
    </div>
  );
}
