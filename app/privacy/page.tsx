import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { CONTACT_EMAIL, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy - Lexli',
  description: 'What the lexli.ai website collects, why, and how to have it deleted.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const LAST_UPDATED = '11 November 2026';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

const mail = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
    {CONTACT_EMAIL}
  </a>
);

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="Privacy policy"
        description={`How the lexli.ai website handles information about you. Last updated ${LAST_UPDATED}.`}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          <Block title="What this policy covers">
            <p>
              The website at lexli.ai is operated by LEXLI AI LEGAL TECHNOLOGY PRIVATE LIMITED
              (&quot;Lexli&quot;, &quot;we&quot;).
            </p>
            <p>
              This policy covers the public website at lexli.ai. The Lexli application, where you
              keep cases and documents, is covered separately by the terms you accept when you
              create an account.
            </p>
          </Block>

          <Block title="What we collect">
            <p>
              <strong className="text-foreground">How you use the website.</strong> We record how
              visitors use the site: which pages you open, how far you scroll, which links and
              buttons you click, how long you stay, the website or link that brought you here, the
              kind of device and browser you use, and your approximate location (city and country).
              We may also record a replay of your visit to see where the site is unclear. Anything
              you type into a form is hidden in these replays.
            </p>
            <p>
              <strong className="text-foreground">Overall traffic.</strong> We also see overall counts
              of visits, where they come from, countries and devices, and how fast pages load. These
              are not tied to you as a person.
            </p>
            <p>
              <strong className="text-foreground">What you send us.</strong> If you join the waitlist,
              fill in the contact form or email us, we receive what you give us, such as your name,
              email address, firm, role, city and message. When you submit a form, we link your
              earlier visits on this site to your email address, so we know which pages brought you
              to us.
            </p>
            <p>We do not collect payment details, government identifiers or case documents on this website.</p>
          </Block>

          <Block title="Cookies">
            <p>
              We use a cookie on lexli.ai so that when you come back, we can tell it is a returning
              visit. It does not contain your name or contact details. We do not use advertising
              cookies or follow you across other websites. You can delete or block cookies in your
              browser settings at any time; the site works without them.
            </p>
          </Block>

          <Block title="Why we use it">
            <p>
              To understand which parts of the site are useful and which are not, to improve it, and
              to reply to you when you contact us or join the waitlist. We do not sell your
              information, and we do not use it for advertising.
            </p>
          </Block>

          <Block title="How long we keep it">
            <p>
              Records of how the site is used are kept for up to one year, and visit replays for up
              to 30 days, after which they are deleted. Messages and waitlist entries are kept for as long
              as we need them to respond to you or to give you access, and deleted when you ask.
            </p>
          </Block>

          <Block title="Your choices and rights">
            <p>
              You can ask us to show you, correct or delete the information we hold about you, or
              ask us to stop recording your visits, by writing to {mail}. We reply within 30 days.
            </p>
          </Block>

          <Block title="Children">
            <p>This website is meant for legal professionals and businesses, not for anyone under 18.</p>
          </Block>

          <Block title="Changes and contact">
            <p>
              If we change this policy, we update it on this page and change the date at the top.
              Questions or complaints about how we handle your information go to {mail}.
            </p>
          </Block>
        </div>
      </Section>
    </div>
  );
}
