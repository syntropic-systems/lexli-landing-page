'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { APP_URL, CONTACT_EMAIL, emailjsConfig } from '@/lib/site';

/**
 * Who is asking. Kept to the personas the site already addresses so the
 * reply can route to the right conversation (a firm gets a demo offer, an
 * advocate gets a batch date).
 */
const ROLES = [
  { value: 'advocate', label: 'Advocate' },
  { value: 'clerk', label: 'Clerk or legal staff' },
  { value: 'firm', label: 'Law firm' },
  { value: 'business', label: 'Business with cases in court' },
  { value: 'other', label: 'Other' },
] as const;

type Role = (typeof ROLES)[number]['value'];

const EMPTY = {
  name: '',
  email: '',
  role: '' as Role | '',
  firm: '',
  city: '',
  courts: '',
  note: '',
};

/** The message body the waitlist entry arrives as. The contact template is
 * reused as-is (firstName, lastName, email, company, message, to_email) so
 * the waitlist works wherever the contact form works, with no new emailjs
 * setup; the first line flags it so entries can be filtered in the inbox. */
function entryMessage(data: typeof EMPTY): string {
  const role = ROLES.find((r) => r.value === data.role)?.label ?? data.role;
  return [
    'WAITLIST REQUEST',
    `Role: ${role}`,
    `City: ${data.city}`,
    `Courts: ${data.courts}`,
    data.note ? `Note: ${data.note}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

const fieldClass =
  'flex w-full rounded-md border border-input bg-muted px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

export function WaitlistForm() {
  const [formData, setFormData] = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  // Same rule as the contact form: no fallback credentials, and no form that
  // pretends to send. Without config, the page asks for an email instead.
  // (Bound to a local so the submit handler below sees it narrowed.)
  const config = emailjsConfig;
  if (!config) {
    const subject = encodeURIComponent('Waitlist request');
    const body = encodeURIComponent(
      'Name:\nRole (advocate / clerk / firm / business):\nCity:\nCourts I appear in:\n'
    );
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-serif text-xl font-semibold mb-2">Write to us to join</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Send your name, your role, your city, and the courts you appear in. That is
            all a waitlist entry is, and it goes straight into the same queue.
          </p>
          <Button size="lg" className="w-full" asChild>
            <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`}>
              Email {CONTACT_EMAIL}
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasFailed(false);

    try {
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          firstName: formData.name,
          lastName: '',
          email: formData.email,
          company: formData.firm,
          message: entryMessage(formData),
          to_email: CONTACT_EMAIL,
        },
        config.publicKey
      );
      track('waitlist_submit', { role: formData.role || 'unspecified' });
      setIsDone(true);
    } catch (error) {
      console.error('Failed to submit waitlist entry:', error);
      setHasFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isDone) {
    // No auto-reset: the person should be able to read this at leisure, and
    // a second submission from the same screen is never what they meant.
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="py-4">
            <h3 className="font-serif text-2xl font-semibold mb-3">You are on the list.</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We have your entry. When your batch opens we write to{' '}
              <span className="font-medium text-foreground">{formData.email}</span> with
              your access and the first thing to try.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Nothing to install, and nothing to migrate before then.</li>
              <li>Your files, diaries, and templates stay where they are.</li>
              <li>
                Already have an account?{' '}
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign in
                </a>
                .
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Where we write when your access opens"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                You are
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className={fieldClass}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City
              </label>
              <Input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                placeholder="Where you practise"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="courts" className="block text-sm font-medium mb-2">
              Courts you appear in
            </label>
            <Input
              id="courts"
              name="courts"
              type="text"
              placeholder="Bombay High Court, Nagpur District Court…"
              value={formData.courts}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="firm" className="block text-sm font-medium mb-2">
              Firm or practice <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="firm"
              name="firm"
              type="text"
              autoComplete="organization"
              placeholder="Firm or practice"
              value={formData.firm}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-2">
              Anything else <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="note"
              name="note"
              placeholder="The tool you need first, the size of your team, a question."
              value={formData.note}
              onChange={handleChange}
              rows={3}
              className={`${fieldClass} min-h-[88px]`}
            />
          </div>

          {hasFailed && (
            <p className="rounded-md border border-destructive-foreground/30 bg-destructive px-3 py-2 text-sm text-destructive-foreground">
              The entry did not send. Try again, or write to us directly at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Join the waitlist'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We use this only to write to you about your access.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
