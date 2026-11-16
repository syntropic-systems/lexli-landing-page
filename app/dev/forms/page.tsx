import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { EnquiryForm } from '@/components/enquiry-form';
import type { FormPreview } from '@/lib/form-preview';

export const metadata: Metadata = {
  title: 'Forms - dev preview',
  robots: { index: false, follow: false },
};

const STATES: { state: FormPreview; label: string; note: string }[] = [
  { state: 'empty', label: 'Empty', note: 'First visit.' },
  { state: 'filled', label: 'Filled', note: 'Sample answers, ready to send.' },
  { state: 'sending', label: 'Sending', note: 'Button disabled while the send is in flight.' },
  { state: 'error', label: 'Error', note: 'The send failed; answers are kept.' },
  { state: 'sent', label: 'Sent', note: 'What the visitor sees afterwards.' },
];

function Frame({ label, note, children }: { label: string; note: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{label}</p>
        <p className="text-sm text-muted-foreground">{note}</p>
      </div>
      {children}
    </div>
  );
}

/**
 * Every state of EnquiryForm's contact and waitlist variants, side by side, for working on
 * their design. Development only: production builds answer 404. Sends here are
 * faked, so nothing reaches EmailJS or PostHog; submitting any form shows the
 * sent state after a moment.
 */
export default function FormsPreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <div>
      <PageHeader
        title="Forms"
        description="Every state of EnquiryForm's two variants. Development only; sends are faked."
      />

      <Section title="Contact form" description="/contact, beside the booking calendar.">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {STATES.map(({ state, label, note }) => (
            <Frame key={state} label={label} note={note}>
              <EnquiryForm variant="contact" preview={state} />
            </Frame>
          ))}
        </div>
      </Section>

      <Section variant="muted" title="Waitlist form" description="/waitlist.">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {STATES.map(({ state, label, note }) => (
            <Frame key={state} label={label} note={note}>
              <EnquiryForm variant="waitlist" preview={state} />
            </Frame>
          ))}
          <Frame label="No EmailJS" note="Shown when the EmailJS values are missing.">
            <EnquiryForm variant="waitlist" preview="unconfigured" />
          </Frame>
        </div>
      </Section>
    </div>
  );
}
