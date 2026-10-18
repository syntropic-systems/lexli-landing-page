import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { KeyRound, Handshake, FolderOpen } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { Section } from '@/components/section';
import { FeatureGlowGrid } from '@/components/feature-glow-grid';
import { RoutingPillGroups, toolRoutingGroups } from '@/components/routing-pill';
import { CaseRecordShowcase } from '@/components/showcases';
import { WaitlistForm } from '@/components/waitlist-form';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import { APP_URL, DEMO_HREF, IS_WAITLIST, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Join the waitlist',
  description:
    'Lexli is opening to practices in small batches. Put yours on the list and we write to you when your access opens.',
  alternates: { canonical: `${SITE_URL}/waitlist` },
};

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full border border-primary/40 bg-primary/5 text-primary font-semibold tracking-wider uppercase text-[11px] md:text-xs">
      {children}
    </span>
  );
}

/** Why the door is a list and not a signup button, told as what the reader
 * gets out of it. Nothing here promises a date or a number. */
const reasons = [
  {
    icon: KeyRound,
    title: 'You go first',
    description:
      'Access opens to the list before it opens to anyone else. Your batch date arrives in your inbox, not on a launch page.',
  },
  {
    icon: Handshake,
    title: 'You get set up properly',
    description:
      'Batches are small on purpose: your courts, your first cases, and your questions, with room to get each one right.',
  },
  {
    icon: FolderOpen,
    title: 'Nothing to move',
    description:
      'Nothing to install and nothing to migrate first. Your files, diaries, and templates stay exactly where they are.',
  },
];

/** What a new entry can expect. Written so none of it needs a date. */
const nextSteps = [
  {
    label: 'You join',
    text: 'Name, email, and the courts you appear in. Two minutes, no card, no call.',
  },
  {
    label: 'We open your batch',
    text: 'Access goes out a few practices at a time. You hear from us by email the day yours opens.',
  },
  {
    label: 'You bring one case',
    text: 'Add your name, see tomorrow built, bring a case in. The rest of the record is already waiting.',
  },
];

export default function WaitlistPage() {
  // In open mode there is no queue: anyone who lands here from an old link
  // should simply reach the app.
  if (!IS_WAITLIST) redirect(APP_URL);

  return (
    <div>
      <PageHero
        eyebrow="Early access · opening in batches"
        title={
          <>
            The record is ready.
            <br />
            <span className="text-primary">Your seat is next.</span>
          </>
        }
        description="Lexli holds your cases, hearings, files, and drafts in one record, connected to the courts. We are opening it to practices a few at a time, so every one gets set up properly. The list is the way in, and it takes two minutes to join."
        primaryCta={{ text: 'Put my practice on the list', href: '/waitlist#join' }}
        secondaryCta={{ text: 'See what is inside', href: '/platform' }}
        visual={<CaseRecordShowcase />}
      >
        <RevealOnScroll direction="up" delay={0.55} duration={0.5}>
          <p className="text-sm text-foreground/60">
            Already have access?{' '}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </a>
            .
          </p>
        </RevealOnScroll>
      </PageHero>

      <Section
        header={<Eyebrow>Why a list</Eyebrow>}
        title="A short queue, on purpose."
        description="We could open the door to everyone tomorrow. We would rather every practice that comes in finds its courts covered, its first cases in the record, and someone who answers."
      >
        <FeatureGlowGrid features={reasons} />
      </Section>

      <Section
        header={<Eyebrow>Inside</Eyebrow>}
        title="Six tools, one record, already built."
        description="Read what each one does while you wait. The day your access opens, all of them are there, working from the same cases."
      >
        <RoutingPillGroups groups={toolRoutingGroups()} />
      </Section>

      <Section
        id="join"
        header={<Eyebrow>Join</Eyebrow>}
        title="Put your practice on the list."
        description="Tell us who you are and where you appear. We write to you when your batch opens."
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 items-start">
          <div>
            <RevealOnScroll direction="up" duration={0.6}>
              <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-tight mb-6">
                What happens next
              </h3>
            </RevealOnScroll>
            <StaggerChildren className="space-y-4" stagger={0.1}>
              {nextSteps.map((step, index) => (
                <StaggerItem key={step.label}>
                  <div className="flex gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-base font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5">
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>

            <RevealOnScroll direction="up" delay={0.2} duration={0.6}>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
                A firm with partners and juniors?{' '}
                <a
                  href={DEMO_HREF}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Book a demo
                </a>{' '}
                instead and we set the whole team up together.
              </p>
            </RevealOnScroll>
          </div>

          <RevealOnScroll direction="up" delay={0.1} duration={0.7}>
            <WaitlistForm />
          </RevealOnScroll>
        </div>
      </Section>
    </div>
  );
}
