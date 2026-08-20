import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { ScrollLink } from '@/components/scroll-link';
import { Section } from '@/components/section';
import { CTASection } from '@/components/cta-section';
import { VerdictLine } from '@/components/verdict-line';
import { ToolGrid } from '@/components/tool-grid';
import { RevealOnScroll } from '@/components/animations';
import { allTools } from '@/data/navigation';
import { APP_URL, CTA, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Tools - six ways into one workspace',
  description:
    'eFiling Support, Drafting, Daily Board, Legal Translator, Document Scanner, and Case Finder: each works on its own, and all of them share one case record.',
  alternates: { canonical: `${SITE_URL}/tools` },
};

export default function ToolsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Lexli tools"
        title="Six tools. One case record."
        description="Each of these works on its own. All of them share the platform's cases, files, and context, which is why the board knows your cases, drafts arrive pre-filled, and a scan is ready for filing before filing comes up."
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.explorePlatform, href: '/platform' }}
      />

      {/* One grid, in the IA's order. The earlier free/paid split was dropped:
          the free-tier scope that would justify it is still undefined, so the
          grouping asserted something nobody had confirmed. The assistant line
          closes the grid as a verdict (the tool pages' pattern) rather than
          floating in a section of its own. */}
      <Section
        title="The six tools"
        header={
          <RevealOnScroll direction="up" duration={0.6}>
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              The lineup
            </p>
          </RevealOnScroll>
        }
      >
        <ToolGrid items={allTools} />
        <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
          <VerdictLine className="mt-12 max-w-3xl md:mt-16">
            Every tool is also available through the AI Assistant. Ask, and it runs the tool
            for you.
          </VerdictLine>
        </RevealOnScroll>
        {/* The verdict's hand-off: the full assistant argument lives on the
            platform page, so the line points instead of repeating it. */}
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <div className="mt-8">
            <ScrollLink
              href="/platform#ai-assistant"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Meet the AI Assistant
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ScrollLink>
          </div>
        </RevealOnScroll>
      </Section>

      <CTASection
        title="Start with the one you need today."
        description="Create a free account and bring your first case in. The rest is already waiting for it."
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.explorePlatform, href: '/platform' }}
      />
    </div>
  );
}
