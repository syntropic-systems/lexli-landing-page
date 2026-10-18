import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, KeyRound, Handshake, FolderOpen } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { StepsList } from '@/components/steps-list';
import { FeatureGlowGrid } from '@/components/feature-glow-grid';
import { VerdictLine } from '@/components/verdict-line';
import { RoutingPillGroups, toolRoutingGroups } from '@/components/routing-pill';
import { WaitlistForm } from '@/components/waitlist-form';
import { RevealOnScroll } from '@/components/animations';
import { APP_URL, CTA, DEMO_HREF, IS_WAITLIST, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Join the waitlist',
  description:
    'Lexli is opening to practices in small batches. Put yours on the list and we write to you when your access opens.',
  alternates: { canonical: `${SITE_URL}/waitlist` },
};

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

/** What a new entry can expect. Written so none of it needs a date. */
const nextSteps = [
  {
    title: 'You join',
    description: 'Name, email, and the courts you appear in. Two minutes, no card, no call.',
  },
  {
    title: 'We open your batch',
    description:
      'Access goes out a few practices at a time. You hear from us by email the day yours opens.',
  },
  {
    title: 'You bring one case',
    description:
      'Add your name, see tomorrow built, bring a case in. The rest of the record is already waiting.',
  },
];

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

export default function WaitlistPage() {
  // In open mode there is no queue: anyone who lands here from an old link
  // should simply reach the app.
  if (!IS_WAITLIST) redirect(APP_URL);

  return (
    <div>
      <PageHeader
        title="Your seat is next. Put your practice on the list."
        description="Lexli holds your cases, hearings, files, and drafts in one record, connected to the courts. We are opening it to practices a few at a time, so every one gets set up properly. The list is the way in, and it takes two minutes to join."
      />

      {/* Same two-column shape as Contact: the sequence on the left, the
          form on the right, each under its own in-section serif heading. */}
      <Section id="join" disableDefaultHeader>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 items-start">
          <div>
            <RevealOnScroll direction="up" duration={0.6}>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                What happens next
              </h2>
            </RevealOnScroll>
            <StepsList steps={nextSteps} />
            <RevealOnScroll direction="up" delay={0.2} duration={0.6}>
              <div className="mt-10 space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Already have access?{' '}
                  <a
                    href={APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {CTA.signIn}
                  </a>
                  .
                </p>
                <p>
                  A firm with partners and juniors?{' '}
                  <a
                    href={DEMO_HREF}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {CTA.bookDemo}
                  </a>{' '}
                  instead and we set the whole team up together.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <div>
            <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Tell us about your practice
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="up" delay={0.2} duration={0.7}>
              <WaitlistForm />
            </RevealOnScroll>
          </div>
        </div>
      </Section>

      <Section
        variant="muted"
        header={<Eyebrow>Why a list</Eyebrow>}
        title="A short queue, on purpose."
        description="We could open the door to everyone tomorrow. We would rather every practice that comes in finds its courts covered, its first cases in the record, and someone who answers."
      >
        <FeatureGlowGrid features={reasons} />
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <VerdictLine className="mt-12 max-w-3xl md:mt-16">
            Small batches now, so nothing is half set up later.
          </VerdictLine>
        </RevealOnScroll>
      </Section>

      <Section
        header={<Eyebrow>While you wait</Eyebrow>}
        title="Six tools, one record, already built."
        description="Read what each one does. The day your access opens, all of them are there, working from the same cases."
      >
        <RoutingPillGroups groups={toolRoutingGroups()} />
        <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
          <div className="mt-8">
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              {CTA.seeAllTools}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealOnScroll>
      </Section>
    </div>
  );
}
