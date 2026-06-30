import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { Section } from "@/components/section";
import { CTASection } from "@/components/cta-section";
import { FeatureCard } from "@/components/feature-card";
import { StaggerChildren, StaggerItem, RevealOnScroll } from "@/components/animations";
import { features } from "@/data/features";

export const metadata: Metadata = {
  title: "Lexli — AI Legal Workspace for Indian Legal Teams",
  description:
    "Manage cases, translate documents across Marathi, Hindi and English, and get cited answers from your own case files — all in one secure place.",
  alternates: {
    canonical: "https://lexli.ai",
  },
};

const audiences = [
  {
    title: "Solo practitioners & small firms",
    description:
      "A complete, AI-powered practice workspace without the overhead of enterprise software.",
  },
  {
    title: "Mid-size & large firms",
    description:
      "Keep teams aligned on every matter with a shared, searchable, citation-backed case record.",
  },
  {
    title: "In-house & legal teams",
    description:
      "Organize matters, translate documents, and get fast, verifiable answers from your own files.",
  },
];

const steps = [
  {
    step: "1",
    title: "Scan or upload",
    description: "Bring documents in from your phone or desktop — scanned or digital.",
  },
  {
    step: "2",
    title: "Organized in the case",
    description: "Everything lands inside the right matter, ready for the whole team.",
  },
  {
    step: "3",
    title: "Ask & translate",
    description:
      "Get cited answers from your files and translate documents across Marathi, Hindi and English.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <HeroSection
        badge="AI Legal Workspace for India"
        title="One workspace. Every case. AI that knows your files."
        description="Lexli brings your cases, documents, and everyday legal work into one secure place — with an AI assistant that understands your case files and answers with citations you can trust."
        primaryCta={{ text: "Book a Demo", href: "#contact" }}
        secondaryCta={{ text: "See Features", href: "#features" }}
      />

      {/* Features — what you can do today */}
      <Section
        id="features"
        title={
          <>
            Built for legal work, <span className="text-primary">not adapted to it</span>
          </>
        }
        description="Cases, documents, translation, and research designed around how Indian lawyers actually work."
        titleAlign="center"
      >
        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          stagger={0.12}
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <FeatureCard
                icon={<feature.icon />}
                title={feature.title}
                description={feature.description}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* How it works */}
      <Section
        id="how-it-works"
        className="bg-accent/70 shadow-inner"
        title={
          <>
            A single, connected workflow for <span className="text-primary">every matter</span>
          </>
        }
        description="Captured, organized, understood, and acted on — in one place."
        titleAlign="center"
      >
        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          stagger={0.15}
        >
          {steps.map((s) => (
            <StaggerItem key={s.step}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-base text-muted-foreground">{s.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* Who it's for */}
      <Section
        id="who-its-for"
        title={
          <>
            Made for <span className="text-primary">how you practice</span>
          </>
        }
        description="From solo practitioners to large firms and in-house teams."
        titleAlign="center"
      >
        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          stagger={0.12}
        >
          {audiences.map((a) => (
            <StaggerItem key={a.title}>
              <RevealOnScroll direction="up" duration={0.5}>
                <div className="h-full rounded-xl border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                  <p className="text-base text-muted-foreground">{a.description}</p>
                </div>
              </RevealOnScroll>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      {/* Final CTA */}
      <div id="contact">
        <CTASection
          title="Bring every matter into one AI legal workspace."
          description="See how Lexli helps your team manage cases, translate documents, and get cited answers from their own files."
          primaryCta={{ text: "Book a Demo", href: "mailto:hello@lexli.ai" }}
        />
      </div>
    </div>
  );
}
