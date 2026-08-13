import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { CTASection } from "@/components/cta-section";
import { PlatformHub } from "@/components/platform-hub";
import { PlatformBento } from "@/components/platform-bento";
import { RoutingPill } from "@/components/routing-pill";
import { SolutionCards } from "@/components/solution-cards";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { homepageFaqs } from "@/data/faqs";
import { StaggerChildren, StaggerItem, RevealOnScroll } from "@/components/animations";
import { allTools } from "@/data/navigation";
import { getTool } from "@/data/tools";
import { APP_URL, CTA, DEMO_HREF } from "@/lib/site";

/** The interior pages' eyebrow register, verbatim. */
function Eyebrow({ children }: { children: string }) {
  return (
    <RevealOnScroll direction="up" duration={0.6}>
      <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
        {children}
      </p>
    </RevealOnScroll>
  );
}

export const metadata: Metadata = {
  title: "Lexli - AI Legal Workspace for Indian Legal Teams",
  description:
    "Manage cases, translate documents across Marathi, Hindi and English, and get cited answers from your own case files, all in one secure place.",
  alternates: {
    canonical: "https://lexli.ai",
  },
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <HeroSection
        badge="Built for Indian legal practice"
        title={
          <>
            One <span className="text-primary">legal workspace</span>. Every case. Every
            tool on the same record.
          </>
        }
        description="Lexli holds your cases, hearings, files, and drafts in one place, organised by case, connected to the courts. Ask anything of your own record, and the AI assistant answers with citations you can check."
        pointers={[
          "Case Management",
          "eFiling & Drafting Support",
          "Research with AI",
          "Everyday tools",
        ]}
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.explorePlatform, href: "/platform" }}
      />

      {/* The record, shown — the hub diagram is the site's one artifact that
          proves the hero's third beat instead of restating it. */}
      <Section
        header={<Eyebrow>The platform</Eyebrow>}
        title="One case record, underneath everything."
        description="The platform holds the cases, files, hearings, and context. Every tool draws from it, which is why the board knows your day, drafts arrive filled in, and a scan is ready for filing before filing comes up."
      >
        <RevealOnScroll direction="up" delay={0.1} duration={0.7}>
          <PlatformHub activeSlug="" />
        </RevealOnScroll>
      </Section>

      {/* Inside the platform — the four faces that have live showcases, in
          one bento. The platform page keeps the full argument. */}
      <Section
        variant="muted"
        header={<Eyebrow>Inside the platform</Eyebrow>}
        title="The record, and everything that reads it."
        description="The case record, the assistant that works it, the reading underneath, and search across all of it. Accounts, security, and legal research continue on the platform page."
      >
        <PlatformBento />
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <div className="mt-10 md:mt-12">
            <Link
              href="/platform"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              {CTA.explorePlatform}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealOnScroll>
      </Section>

      {/* The lineup in two rows: the platform tools first, the free doors
          under them with their badges. */}
      <Section
        header={<Eyebrow>The tools</Eyebrow>}
        title="Six tools. Start with the one you need."
        description="Drafting and eFiling run on the platform's record. The other four are free: a free account and the tool you needed anyway."
      >
        <StaggerChildren className="flex flex-col items-start gap-4" stagger={0.06}>
          <div className="flex flex-wrap gap-3">
            {allTools
              .filter((tool) => {
                const slug = tool.href.split("/").pop() ?? "";
                return getTool(slug)?.kind !== "front-door";
              })
              .map((tool) => (
                <StaggerItem key={tool.href}>
                  <RoutingPill link={{ label: tool.label, href: tool.href }} />
                </StaggerItem>
              ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {allTools
              .filter((tool) => {
                const slug = tool.href.split("/").pop() ?? "";
                return getTool(slug)?.kind === "front-door";
              })
              .map((tool) => (
                <StaggerItem key={tool.href}>
                  <RoutingPill link={{ label: tool.label, href: tool.href, free: true }} />
                </StaggerItem>
              ))}
          </div>
        </StaggerChildren>
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <div className="mt-10 md:mt-12">
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              See all tools
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealOnScroll>
      </Section>

      {/* Who it's for — the solutions index's three doors, verbatim. */}
      <Section
        variant="muted"
        header={<Eyebrow>Who you are</Eyebrow>}
        title="Same record. Different hands."
        description="A solo litigator, a firm, and the staff who keep both moving. Pick the day that looks like yours."
      >
        <SolutionCards />
      </Section>

      {/* The first five questions — answers single-sourced from the FAQ data,
          so the two pages can never disagree. */}
      <Section
        header={<Eyebrow>FAQ</Eyebrow>}
        title="Asked before anything else."
        titleAlign="center"
      >
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <StaggerChildren stagger={0.06}>
              {homepageFaqs.map((faq) => (
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
          <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
            <div className="mt-10 text-center md:mt-12">
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                All questions, answered plainly
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Final CTA */}
      <CTASection
        title="Bring your practice onto one record."
        description="Create a free account and start with a single case, or book a demo and walk through the whole workspace."
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.bookDemo, href: DEMO_HREF }}
      />
    </div>
  );
}
