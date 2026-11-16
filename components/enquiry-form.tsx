'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CitySelect } from './ui/city-select';
import { cn } from '@/lib/utils';
import { APP_URL, CONTACT_EMAIL, emailjsConfig } from '@/lib/site';
import { PRACTICE_CITIES } from '@/lib/practice-cities';
import { capture, identifyVisitor } from '@/lib/analytics';
import { fakeSend, type FormPreview } from '@/lib/form-preview';

export type EnquiryVariant = 'contact' | 'waitlist';

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

/**
 * Courts by level, not by name: with the city, enough to decide who gets access first. The
 * exact courts are picked in the app's onboarding, against its court catalog, which needs a
 * signed-in workspace and so is not available to the website.
 */
const COURT_LEVELS = [
  { value: 'supreme', label: 'Supreme Court' },
  { value: 'high', label: 'High Court' },
  { value: 'district', label: 'District & sessions courts' },
  { value: 'tribunal', label: 'Tribunals' },
  { value: 'consumer', label: 'Consumer commissions' },
] as const;

/** The optional organisation field, named for who is filling it in. */
const FIRM_LABEL: Record<Role | '', string> = {
  advocate: 'Chamber or firm',
  clerk: 'Advocate or firm',
  firm: 'Firm name',
  business: 'Company name',
  other: 'Firm or organisation',
  '': 'Firm or organisation',
};

type Fields = {
  name: string;
  email: string;
  role: Role | '';
  city: string;
  courts: string[];
  firm: string;
  message: string;
};

const EMPTY: Fields = { name: '', email: '', role: '', city: '', courts: [], firm: '', message: '' };

const SAMPLE: Record<EnquiryVariant, Fields> = {
  contact: {
    ...EMPTY,
    name: 'Aditi Deshpande',
    email: 'aditi@deshpande-associates.in',
    firm: 'Deshpande & Associates',
    message: 'We are four advocates at the Nagpur Bench. Can the whole chamber share one case record?',
  },
  waitlist: {
    ...EMPTY,
    name: 'Rohan Kulkarni',
    email: 'rohan.kulkarni@gmail.com',
    role: 'advocate',
    city: 'Nagpur',
    courts: ['high', 'district'],
    firm: 'Kulkarni Chambers',
    message: 'Calendar first; I lose an hour a day to cause lists.',
  },
};

const labelOf = <T extends { value: string; label: string }>(list: readonly T[], value: string) =>
  list.find((item) => item.value === value)?.label ?? value;

/**
 * The email body a waitlist entry arrives as. Both variants share one EmailJS template
 * (firstName, lastName, email, company, message, to_email); the first line flags waitlist
 * entries so they can be filtered in the inbox.
 */
function waitlistMessage(f: Fields): string {
  return [
    'WAITLIST REQUEST',
    `Role: ${labelOf(ROLES, f.role)}`,
    f.city ? `City: ${f.city}` : null,
    `Courts: ${f.courts.map((c) => labelOf(COURT_LEVELS, c)).join(', ')}`,
    f.message ? `Note: ${f.message}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

function FieldLabel({ htmlFor, id, optional, children }: { htmlFor?: string; id?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} id={id} className="mb-2 block text-sm font-medium">
      {children}
      {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm text-destructive-foreground">
      {children}
    </p>
  );
}

function Confirmation({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="py-4">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Check className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <h3 className="mb-3 font-serif text-2xl font-semibold">{title}</h3>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

const linkClass = 'font-medium text-foreground underline underline-offset-4';

/**
 * The site's one form, in two variants: `contact` (a question for us) and `waitlist`
 * (a request for access, with role, city and courts). Both send through the same EmailJS
 * template and share every state: sending, error, and a confirmation that stays.
 *
 * Copy voice: field labels are neutral nouns (Name, Role, Courts); helper text and
 * placeholders speak to the visitor; buttons name the action, in the words the rest of the
 * site uses for it (the header says Join the waitlist, so the button does too).
 *
 * `preview` is for /dev/forms only: it seeds a state and fakes the send.
 */
export function EnquiryForm({ variant, preview }: { variant: EnquiryVariant; preview?: FormPreview }) {
  const uid = useId();
  const ids = (name: string) => `${uid}-${name}`;
  const isWaitlist = variant === 'waitlist';

  const [fields, setFields] = useState<Fields>(preview && preview !== 'empty' ? SAMPLE[variant] : EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(preview === 'sending');
  // The address the entry came from, for the confirmation; null until one is sent.
  const [sentFrom, setSentFrom] = useState<string | null>(preview === 'sent' ? SAMPLE[variant].email : null);
  const [hasFailed, setHasFailed] = useState(preview === 'error');
  // Role and courts are not native inputs, so the browser cannot check them; this does.
  const [missing, setMissing] = useState<{ role?: boolean; courts?: boolean }>({});

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (key === 'role' || key === 'courts') setMissing((m) => ({ ...m, [key]: false }));
  };
  const onText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    set(e.target.name as 'name' | 'email' | 'firm' | 'message', e.target.value);
  const toggleCourt = (court: string) =>
    set('courts', fields.courts.includes(court) ? fields.courts.filter((c) => c !== court) : [...fields.courts, court]);

  // Same rule for both variants: no fallback credentials, and no form that pretends to send.
  const config = preview === 'unconfigured' ? null : preview ? 'preview' : emailjsConfig;
  if (!config) {
    const subject = encodeURIComponent(isWaitlist ? 'Waitlist request' : 'A question');
    const body = encodeURIComponent(
      isWaitlist ? 'Name:\nRole (advocate / clerk / firm / business):\nCity:\nCourts I appear in:\n' : ''
    );
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-2 font-serif text-xl font-semibold">{isWaitlist ? 'Write to us to join' : 'Write to us'}</h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            {isWaitlist
              ? 'Send your name, your role, your city, and the courts you appear in. That is all a waitlist entry is, and it goes straight into the same queue.'
              : 'Send your question by email and we will reply from the same address.'}
          </p>
          <Button size="lg" className="w-full" asChild>
            <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`}>Email {CONTACT_EMAIL}</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isWaitlist) {
      const gaps = { role: !fields.role, courts: fields.courts.length === 0 };
      if (gaps.role || gaps.courts) {
        setMissing(gaps);
        document.getElementById(ids(gaps.role ? 'role' : 'courts'))?.focus();
        return;
      }
    }

    setIsSubmitting(true);
    setHasFailed(false);
    try {
      if (config === 'preview') {
        await fakeSend();
      } else {
        const emailjs = (await import('@emailjs/browser')).default;
        await emailjs.send(
          config.serviceId,
          config.templateId,
          {
            // One name field: it travels as firstName, which the template prints first.
            firstName: fields.name.trim(),
            lastName: '',
            email: fields.email,
            company: fields.firm,
            message: isWaitlist ? waitlistMessage(fields) : fields.message,
            to_email: CONTACT_EMAIL,
          },
          config.publicKey
        );
        identifyVisitor(fields.email);
        if (isWaitlist) capture('waitlist_joined', { role: fields.role || 'unspecified' });
        else capture('contact_submitted');
      }
      // No auto-reset: the confirmation stays until the visitor asks for a new form.
      setSentFrom(fields.email);
      setFields(EMPTY);
    } catch (error) {
      // A silently dropped entry is worse than a visible failure: the sender walks
      // away believing they have been in touch.
      console.error(`Failed to send the ${variant} form:`, error);
      setHasFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sentFrom) {
    return isWaitlist ? (
      <Confirmation title="Your seat is on the list.">
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Thank you. The day your batch opens, we write to{' '}
          <span className="font-medium text-foreground">{sentFrom}</span> with your access and the first thing worth
          trying.
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>There is nothing to install and nothing to prepare before then.</li>
          <li>Your files, diaries, and templates stay where they are.</li>
          <li>
            Meanwhile, the{' '}
            <Link href="/tools" className={linkClass}>
              tools
            </Link>{' '}
            and the{' '}
            <Link href="/platform" className={linkClass}>
              platform
            </Link>{' '}
            pages show what is waiting.
          </li>
          <li>
            Already have an account?{' '}
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Sign in
            </a>
            .
          </li>
        </ul>
      </Confirmation>
    ) : (
      <Confirmation title="Message received.">
        <p className="mb-6 leading-relaxed text-muted-foreground">
          Thank you. We will reply to <span className="font-medium text-foreground">{sentFrom}</span>.
        </p>
        <Button variant="outline" onClick={() => setSentFrom(null)}>
          Send another message
        </Button>
      </Confirmation>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          {/* Disabled as one while sending, so nothing changes under an entry in flight. */}
          <fieldset disabled={isSubmitting} className="space-y-6">
            <div>
              <FieldLabel htmlFor={ids('name')}>Name</FieldLabel>
              <Input id={ids('name')} name="name" autoComplete="name" value={fields.name} onChange={onText} required />
            </div>

            <div>
              <FieldLabel htmlFor={ids('email')}>Email</FieldLabel>
              <Input
                id={ids('email')}
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={onText}
                required
              />
            </div>

            {isWaitlist && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor={ids('role')}>Role</FieldLabel>
                    <Select value={fields.role} onValueChange={(v) => set('role', v as Role)}>
                      <SelectTrigger
                        id={ids('role')}
                        aria-invalid={missing.role || undefined}
                        aria-describedby={missing.role ? ids('role-error') : undefined}
                      >
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {missing.role && <FieldError id={ids('role-error')}>Choose the one closest to you.</FieldError>}
                  </div>
                  <div>
                    <FieldLabel htmlFor={ids('city')} optional>
                      City
                    </FieldLabel>
                    <CitySelect id={ids('city')} value={fields.city} onChange={(c) => set('city', c)} groups={PRACTICE_CITIES} />
                  </div>
                </div>

                <div>
                  <FieldLabel id={ids('courts-label')}>Courts</FieldLabel>
                  <div
                    id={ids('courts')}
                    role="group"
                    tabIndex={-1}
                    aria-labelledby={ids('courts-label')}
                    aria-describedby={missing.courts ? ids('courts-error') : undefined}
                    className="flex flex-wrap gap-2 outline-none"
                  >
                    {COURT_LEVELS.map((court) => {
                      const on = fields.courts.includes(court.value);
                      return (
                        <button
                          key={court.value}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleCourt(court.value)}
                          className={cn(
                            'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                            on
                              ? 'border-primary bg-accent text-accent-foreground'
                              : 'border-input bg-muted text-muted-foreground hover:text-foreground',
                            missing.courts && 'border-destructive-foreground'
                          )}
                        >
                          {on && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                          {court.label}
                        </button>
                      );
                    })}
                  </div>
                  {missing.courts ? (
                    <FieldError id={ids('courts-error')}>Choose at least one.</FieldError>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">Where you appear. Choose all that apply.</p>
                  )}
                </div>
              </>
            )}

            <div>
              <FieldLabel htmlFor={ids('firm')} optional>
                {isWaitlist ? FIRM_LABEL[fields.role] : FIRM_LABEL['']}
              </FieldLabel>
              <Input id={ids('firm')} name="firm" autoComplete="organization" value={fields.firm} onChange={onText} />
            </div>

            <div>
              <FieldLabel htmlFor={ids('message')} optional={isWaitlist}>
                {isWaitlist ? 'Anything else' : 'Message'}
              </FieldLabel>
              <Textarea
                id={ids('message')}
                name="message"
                placeholder={
                  isWaitlist
                    ? 'The tool you need first, the size of your team, a question.'
                    : 'Your question, or what you would like to see in a demo.'
                }
                value={fields.message}
                onChange={onText}
                rows={isWaitlist ? 3 : 5}
                className={isWaitlist ? undefined : 'min-h-[120px]'}
                required={!isWaitlist}
              />
            </div>

            {hasFailed && (
              <p
                role="alert"
                className="rounded-md border border-destructive-foreground/30 bg-destructive px-3 py-2 text-sm text-destructive-foreground"
              >
                {isWaitlist ? 'The entry did not send.' : 'The message did not send.'} Try again, or write to us
                directly at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}

            <Button type="submit" size="lg" className="w-full">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isWaitlist
                ? isSubmitting
                  ? 'Joining…'
                  : 'Join the waitlist'
                : isSubmitting
                  ? 'Sending…'
                  : 'Send message'}
            </Button>
            {isWaitlist && (
              <p className="text-center text-xs text-muted-foreground">
                No card, no call. We use this only to write to you about your access.
              </p>
            )}
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
