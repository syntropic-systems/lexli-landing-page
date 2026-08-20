import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/page-hero';
import { Section } from '@/components/section';
import { CTASection } from '@/components/cta-section';
import { VerdictLine } from '@/components/verdict-line';
import { GlowCard } from '@/components/feature-glow-grid';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import {
  commitments,
  companyCta,
  companyHero,
  team,
  visionMission,
  whyNow,
  whyWeExist,
} from '@/data/company';
import { APP_URL, CTA, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About - why we built a workspace for Indian legal practice',
  description:
    'Lexli is built in Nagpur for how Indian legal practice actually works: by case, in the courts, in the languages the work happens in.',
  alternates: { canonical: `${SITE_URL}/company` },
};

/** Shared heading block so every section on this page opens the same way. */
function SectionHead({ eyebrow, headline }: { eyebrow: string; headline: string }) {
  return (
    <RevealOnScroll direction="up" duration={0.6}>
      <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-5 max-w-2xl">
        {/* A '\n' in a headline is an authored line break. */}
        {headline.split('\n').map((line, index, lines) => (
          <span key={line}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </h2>
    </RevealOnScroll>
  );
}

function ReasonBlock({
  reason,
  className,
}: {
  reason: (typeof whyWeExist.reasons)[number];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <reason.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
        <p className="text-base font-semibold text-foreground">{reason.title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
    </div>
  );
}

export default function CompanyPage() {
  return (
    <div>
      <PageHero
        eyebrow={companyHero.eyebrow}
        title={companyHero.headline}
        description={companyHero.subhead}
      />

      <Section id={whyWeExist.id} disableDefaultHeader>
        {/* Split header: claim on the left, the thesis prose on the right so
            it stays prose instead of being chopped into fragments. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16">
          <SectionHead eyebrow={whyWeExist.eyebrow} headline={whyWeExist.headline} />
          <div className="max-w-2xl space-y-3">
            {whyWeExist.paragraphs.map((paragraph, index) => (
              <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" delay={0.1} duration={0.6}>
                {/* The closing "Lexli exists to…" line is the argument's turn —
                    full foreground while the setup stays muted. */}
                <p
                  className={cn(
                    'text-sm md:text-base leading-relaxed',
                    index === whyWeExist.paragraphs.length - 1
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {paragraph}
                </p>
              </RevealOnScroll>
            ))}
            <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
              <p className="text-sm md:text-base font-medium leading-relaxed text-primary">
                {whyWeExist.reasonsLead}
              </p>
            </RevealOnScroll>
          </div>
        </div>

        {/* The reasons band: Paper and Access flanking one shared scene —
            two sides of the same desk, not a template card row. */}
        <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border/20 bg-gradient-to-b from-card via-accent/10 to-accent/50 shadow-sm">
            <div className="grid grid-cols-1 items-end gap-8 p-6 md:p-8 xl:grid-cols-[1fr_1.5fr_1fr] xl:gap-10 xl:p-0">
              <ReasonBlock reason={whyWeExist.reasons[0]} className="xl:py-8 xl:pl-8" />
              {/* Centre scene: a gradient circle outgrowing its column —
                  bleeding past both sides, cropped by the band's
                  overflow-hidden — with the illustration riding on it. The
                  grid column keeps its width. */}
              <div className="order-first relative flex w-full items-end justify-center self-stretch xl:order-none xl:h-full">
                <div
                  aria-hidden
                  className="hidden xl:block absolute left-1/2 top-6 aspect-square w-[calc(100%+8rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-accent/10 via-accent/30 to-accent/60"
                />
                {whyWeExist.illustration && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={whyWeExist.illustration}
                    alt=""
                    className="relative w-full max-w-md object-contain object-bottom xl:absolute xl:bottom-0 xl:left-1/2 xl:max-h-full xl:w-[calc(100%+4rem)] xl:max-w-none xl:-translate-x-1/2"
                  />
                )}
              </div>
              <ReasonBlock reason={whyWeExist.reasons[1]} className="xl:py-8 xl:pr-8" />
            </div>
          </div>
        </RevealOnScroll>
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <VerdictLine className="mt-8 max-w-3xl">{whyWeExist.consentLine}</VerdictLine>
        </RevealOnScroll>
      </Section>

      <Section id={visionMission.id} variant="muted" disableDefaultHeader>
        {/* Centred: eyebrow, headline, illustration, then the two statements
            side by side across a hairline divider. */}
        <RevealOnScroll direction="up" duration={0.6}>
          <div className="text-center">
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {visionMission.eyebrow}
            </p>
            <h2 className="mx-auto max-w-2xl font-serif text-3xl md:text-4xl font-semibold tracking-tight">
              {visionMission.headline}
            </h2>
          </div>
        </RevealOnScroll>
        {visionMission.illustration && (
          <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visionMission.illustration}
              alt=""
              className="mx-auto w-full max-w-lg object-contain"
            />
          </RevealOnScroll>
        )}
        <StaggerChildren
          className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-0"
          stagger={0.12}
        >
          {visionMission.statements.map((statement, index) => (
            <StaggerItem
              key={statement.label}
              className={cn(index === 1 && 'md:border-l md:border-border/60 md:pl-10', index === 0 && 'md:pr-10')}
            >
              <div className="flex items-center gap-3">
                <statement.icon aria-hidden className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <h3 className="text-lg font-semibold tracking-tight">{statement.label}</h3>
              </div>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground">
                {statement.text}
              </p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      <Section id={whyNow.id} disableDefaultHeader>
        {/* Same split as "Why Lexli exists": claim left, prose right. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16">
          <SectionHead eyebrow={whyNow.eyebrow} headline={whyNow.headline} />
          <div className="max-w-2xl space-y-3">
            {whyNow.paragraphs.map((paragraph) => (
              <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" delay={0.1} duration={0.6}>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground">{paragraph}</p>
              </RevealOnScroll>
            ))}
            <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
              <VerdictLine className="mt-6">{whyNow.closer}</VerdictLine>
            </RevealOnScroll>
          </div>
        </div>
      </Section>

      <Section id={commitments.id} variant="muted" disableDefaultHeader>
        <SectionHead eyebrow={commitments.eyebrow} headline={commitments.headline} />
        <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
          <p className="max-w-3xl text-sm md:text-base leading-relaxed text-muted-foreground">
            {commitments.lead}
          </p>
        </RevealOnScroll>
        <StaggerChildren className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2" stagger={0.1}>
          {commitments.items.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <GlowCard className="gap-3">
                <item.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <div className="space-y-1.5">
                  <p className="text-base font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <VerdictLine className="mt-8 max-w-3xl">
            {commitments.closer.split('\n').map((line, index, lines) => (
              <span key={line}>
                {line}
                {index < lines.length - 1 && <br />}
              </span>
            ))}
          </VerdictLine>
        </RevealOnScroll>
      </Section>

      <Section id={team.id} disableDefaultHeader>
        <SectionHead eyebrow={team.eyebrow} headline={team.headline} />
        <StaggerChildren
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
          stagger={0.1}
        >
          {team.members.map((member) => (
            <StaggerItem key={member.name} className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm">
                {/* Photo block; initials stand in until the photo exists. */}
                <div className="relative aspect-video w-full overflow-hidden rounded-b-xl bg-gradient-to-b from-accent/70 to-accent/30">
                  {/* Vignette over the photo ground: clear centre, edges
                      falling off earlier and deeper so it actually reads. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(100%_100%_at_50%_40%,transparent_45%,color-mix(in_oklab,var(--primary)_18%,transparent)_100%)]"
                  />
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-full w-full items-center justify-center font-serif text-4xl font-semibold text-primary/60"
                    >
                      {member.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-base font-semibold text-foreground">{member.name}</p>
                  {member.role && (
                    <p className="mt-0.5 text-sm font-medium text-primary">{member.role}</p>
                  )}
                  {member.bio && (
                    <>
                      <div
                        aria-hidden
                        className="my-3 border-t border-border/60"
                      />
                      <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                    </>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Section>

      <CTASection
        title={companyCta.headline}
        description={companyCta.subhead}
        primaryCta={{ text: CTA.startFree, href: APP_URL }}
        secondaryCta={{ text: CTA.talkToUs, href: '/contact' }}
      />
    </div>
  );
}
