/**
 * Contact details.
 *
 * `null` means "not confirmed" — the page renders only what is filled in, so an
 * unknown phone number or address is simply absent rather than a placeholder
 * that looks real. Fill these in and they appear.
 */

import { CONTACT_EMAIL, LINKEDIN_URL } from '@/lib/site';

export type ContactChannel = {
  label: string;
  value: string;
  href?: string;
  note?: string;
};

const rawChannels: (ContactChannel | null)[] = [
  {
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    note: 'For demos, questions, and anything the FAQ did not answer.',
  },
  {
    label: 'LinkedIn',
    value: 'Lexli',
    href: LINKEDIN_URL,
    note: 'Where we post what has shipped.',
  },
  // TODO: phone number — not confirmed. Fill in to render.
  //   { label: 'Phone', value: '+91 ...', href: 'tel:+91...' },
  null,
  // TODO: office address — not confirmed. Fill in to render.
  //   { label: 'Office', value: 'Nagpur, Maharashtra, India' },
  null,
];

export const contactChannels: ContactChannel[] = rawChannels.filter(
  (channel): channel is ContactChannel => channel !== null
);
