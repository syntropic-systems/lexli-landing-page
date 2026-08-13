import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { ContactForm } from '@/components/contact-form';
import { StaggerChildren, StaggerItem, RevealOnScroll } from '@/components/animations';
import { contactChannels } from '@/data/contact';
import { emailjsConfig, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact - talk to us about your practice',
  description:
    'Book a demo, ask about teams and seats, or send us the question the FAQ did not answer.',
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Talk to us about your practice."
        description="A demo takes half an hour and your most complicated case. Or just send the question. We would rather answer it than have you guess."
      />

      <Section disableDefaultHeader>
        <div
          className={
            emailjsConfig
              ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 items-start'
              : 'max-w-2xl'
          }
        >
          {/* Channels first on the reading order: some people never want a form. */}
          <div>
            <RevealOnScroll direction="up" duration={0.6}>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Reach us directly
              </h2>
            </RevealOnScroll>
            <StaggerChildren className="space-y-4" stagger={0.1}>
              {contactChannels.map((channel) => (
                <StaggerItem key={channel.label}>
                  <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5">
                      {channel.label}
                    </p>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="text-base font-semibold text-foreground underline-offset-4 hover:underline"
                        {...(channel.href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-foreground">{channel.value}</p>
                    )}
                    {channel.note && (
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {channel.note}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* The form appears only once Lexli's own emailjs account is wired.
              An unconfigured form would either fail or deliver somewhere we
              cannot account for — and a message that vanishes is worse than a
              page that simply asks you to write in. */}
          {emailjsConfig && (
            <div>
              <RevealOnScroll direction="up" delay={0.1} duration={0.6}>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                  Send a message
                </h2>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={0.2} duration={0.7}>
                <ContactForm />
              </RevealOnScroll>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
