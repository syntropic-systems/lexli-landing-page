import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { CTASection } from '@/components/cta-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import { allFaqs, faqGroups } from '@/data/faqs';
import { APP_URL, CTA, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FAQ - questions about Lexli',
  description:
    'What Lexli costs, which courts it covers, how your data is handled, and what the AI Assistant can and cannot do.',
  alternates: { canonical: `${SITE_URL}/faq` },
};

/** FAQPage structured data — the one schema type that earns rich results here. */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHeader
        title="Questions, answered plainly."
        description="What Lexli covers, what it does not, and where the honest limits are. If something here is not clear enough, ask us directly."
      />

      {/* One section, five groups: an FAQ is one document the reader scans,
          not five arguments deserving a band each. Group titles step down to
          in-section serif headings. */}
      <Section>
        <div className="mx-auto max-w-3xl space-y-14 md:space-y-16">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <RevealOnScroll direction="up" duration={0.6}>
                <h2 className="mb-2 font-serif text-2xl font-semibold tracking-tight">
                  {group.title}
                </h2>
              </RevealOnScroll>
              <Accordion type="single" collapsible className="w-full">
                <StaggerChildren stagger={0.06}>
                  {group.faqs.map((faq) => (
                    <StaggerItem key={faq.question}>
                      <AccordionItem value={faq.question}>
                        <AccordionTrigger className="text-left text-base font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </Accordion>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Still deciding?"
        description="Create a free account and test it against your own cases, or ask us the question this page did not answer."
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.talkToUs, href: '/contact' }}
      />
    </div>
  );
}
