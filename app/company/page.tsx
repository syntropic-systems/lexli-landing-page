import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Section } from '@/components/section';
import { CTASection } from '@/components/cta-section';
import { VerdictLine } from '@/components/verdict-line';
import { FeatureGlowGrid } from '@/components/feature-glow-grid';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import {
  commitments,
  companyCta,
  companyHero,
  moat,
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
        {headline}
      </h2>
    </RevealOnScroll>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-3xl space-y-4">
      {paragraphs.map((paragraph) => (
        <RevealOnScroll key={paragraph.slice(0, 40)} direction="up" delay={0.1} duration={0.6}>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{paragraph}</p>
        </RevealOnScroll>
      ))}
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
        <SectionHead eyebrow={whyWeExist.eyebrow} headline={whyWeExist.headline} />
        <Prose paragraphs={whyWeExist.paragraphs} />
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <VerdictLine className="mt-5 max-w-3xl">{whyWeExist.consentLine}</VerdictLine>
        </RevealOnScroll>
      </Section>

      <Section id={visionMission.id} variant="muted" disableDefaultHeader>
        <SectionHead eyebrow={visionMission.eyebrow} headline={visionMission.headline} />
        <Prose paragraphs={visionMission.paragraphs} />
      </Section>

      <Section id={commitments.id} disableDefaultHeader>
        <SectionHead eyebrow={commitments.eyebrow} headline={commitments.headline} />
        <div className="mt-2">
          <FeatureGlowGrid features={commitments.items} />
        </div>
      </Section>

      <Section id={whyNow.id} variant="accent" disableDefaultHeader>
        <SectionHead eyebrow={whyNow.eyebrow} headline={whyNow.headline} />
        <Prose paragraphs={whyNow.paragraphs} />
      </Section>

      <Section id={moat.id} disableDefaultHeader>
        <SectionHead eyebrow={moat.eyebrow} headline={moat.headline} />
        <Prose paragraphs={moat.paragraphs} />
      </Section>

      <Section id={team.id} variant="muted" disableDefaultHeader>
        <SectionHead eyebrow={team.eyebrow} headline={team.headline} />
        <StaggerChildren
          className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
          stagger={0.1}
        >
          {team.members.map((member) => (
            <StaggerItem key={member.name} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                {/* Photo block; initials stand in until the photo exists. */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-primary/10">
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

                <div className="px-1 pt-4">
                  <p className="text-base font-semibold text-foreground">{member.name}</p>
                  {member.role && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{member.role}</p>
                  )}
                  {member.bio && (
                    <>
                      <div
                        aria-hidden
                        className="my-3 border-t border-dotted border-muted-foreground/30"
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
