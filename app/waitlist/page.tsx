import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { WaitlistForm } from '@/components/waitlist-form';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import { APP_URL, DEMO_HREF, IS_WAITLIST, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Join the waitlist',
  description:
    'Lexli is opening to practices in small batches. Tell us about yours and we will write when your access opens.',
  alternates: { canonical: `${SITE_URL}/waitlist` },
};

/** What a new entry can expect. Written so none of it needs a date. */
const nextSteps = [
  {
    label: 'You join',
    text: 'Name, email, where you practise, and the courts you appear in. Two minutes.',
  },
  {
    label: 'We open your batch',
    text: 'Access goes out a few practices at a time, so each one gets set up properly. You hear from us by email.',
  },
  {
    label: 'You bring one case',
    text: 'Nothing to install and nothing to migrate first. Your files, diaries, and templates stay where they are.',
  },
];

export default function WaitlistPage() {
  // In open mode there is no queue: anyone who lands here from an old link
  // should simply reach the app.
  if (!IS_WAITLIST) redirect(APP_URL);

  return (
    <div>
      <PageHeader
        title="Join the waitlist."
        description="We are opening Lexli to practices in small batches, so each one gets set up properly. Tell us about yours and we will write when your turn comes."
      />

      <Section disableDefaultHeader>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 items-start">
          <div>
            <RevealOnScroll direction="up" duration={0.6}>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                What happens next
              </h2>
            </RevealOnScroll>
            <StaggerChildren className="space-y-4" stagger={0.1}>
              {nextSteps.map((step) => (
                <StaggerItem key={step.label}>
                  <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5">
                      {step.label}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>

            <RevealOnScroll direction="up" delay={0.2} duration={0.6}>
              <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                <p>
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
                <p>
                  A firm with partners and juniors?{' '}
                  <a
                    href={DEMO_HREF}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Book a demo
                  </a>{' '}
                  and we set the team up together.
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
    </div>
  );
}
