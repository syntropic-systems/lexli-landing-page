/**
 * Company page copy. Source: `content/company.md`.
 *
 * DELIBERATELY INCOMPLETE. Two sections from the IA — the founder's story and
 * "why Nagpur first" — are NOT here and are not rendered, because neither can be
 * written without the team. Inventing an origin story is the one thing a
 * sceptical reader is guaranteed to test. Add them to `content/company.md`
 * first, then wire them in.
 *
 * Team roles and bios are likewise absent rather than guessed.
 */

import { KeyRound, Scale, ShieldCheck } from 'lucide-react';

export const companyHero = {
  eyebrow: 'About Lexli',
  headline: 'Built for the practice as it is, not as software imagines it.',
  subhead:
    'Lexli is a workspace for Indian legal practice, organised by case, connected to the courts, and built by a small team in Nagpur.',
};

/** The thesis. Restates the argument the platform page already demonstrates. */
export const whyWeExist = {
  id: 'why',
  eyebrow: 'Why Lexli exists',
  headline: 'Most of the day is not the practice of law.',
  paragraphs: [
    "An advocate's day contains a great deal of work that is not the practice of law. Checking tomorrow's board across three sites. Typing the same party names into the fourth application this month. Finding the order copy that exists in four places and is current in none.",
    'None of it requires judgement. All of it costs the hours where judgement happens.',
    'Lexli exists to take that layer off the desk, and to leave everything that genuinely requires an advocate exactly where it is.',
  ],
  consentLine: 'Lexli prepares. You decide.',
};

export const visionMission = {
  id: 'vision',
  eyebrow: 'Vision and mission',
  headline: 'Legal intelligence, made accessible.',
  paragraphs: [
    'To the advocate with forty cases, and to the litigant who only ever has one: put every case, with its files, its history, and its next date, in one place the whole practice can work from, in the languages the work actually happens in.',
  ],
};

/**
 * Commitments, not virtues. A values list a reader cannot hold you to is worth
 * nothing — each of these is already load-bearing elsewhere on the site.
 */
export const commitments = {
  id: 'commitments',
  eyebrow: 'What we will not do',
  headline: 'Three things we have committed to in public.',
  items: [
    {
      icon: KeyRound,
      title: 'We do not file on our own authority',
      description:
        'Preparation is ours; approval is yours, every time. Submission goes through your own credentials, never ours.',
    },
    {
      icon: ShieldCheck,
      title: 'We do not claim certifications we have not earned',
      description:
        'Lexli is built to SOC 2 Type II and ISO 27001 controls. It has not been audited against them, and we say so plainly.',
    },
    {
      icon: Scale,
      title: "We do not replace the advocate's judgement",
      description:
        'Translations arrive with the original beside them and the doubtful passages flagged. Drafts and filing packets come back for your review.',
    },
  ],
};

export const whyNow = {
  id: 'why-now',
  eyebrow: 'Why now',
  headline: 'The record was already digital. It just had nowhere to land.',
  paragraphs: [
    'Court records went online. Cause lists are published. Orders are digital before they are paper. The record an advocate needs is, increasingly, already in a machine, just scattered across a dozen of them, in formats built for publication rather than for work.',
    'What was missing was not the data. It was somewhere for it to land.',
  ],
};

export const moat = {
  id: 'moat',
  eyebrow: 'The moat',
  headline: "Integration is the part a point tool cannot copy.",
  paragraphs: [
    'Any one of these tools could be bought on its own. The board, the translator, the scanner, the drafting: each exists somewhere as a separate product.',
    'What does not exist separately is the case that all of them share. The board knows your cases because the platform tracks them. The draft arrives filled in because the platform read the file. The eFiling packet assembles because the scan was prepared when it arrived. Cases, files, and context move between the core and the tools. That is the part a point tool cannot copy, because it does not have the record.',
  ],
};

export type TeamMember = {
  name: string;
  /** Unconfirmed content stays absent, not guessed: a card renders whatever
   * subset exists. `photo` is a /public path, e.g. '/team/ayush.jpg'. */
  role?: string;
  bio?: string;
  photo?: string;
};

/**
 * Roles and bios confirmed by the team (Aug 2026). Photos pending — the cards
 * show initials until `photo` paths land in /public/team.
 */
export const team = {
  id: 'team',
  eyebrow: 'The team',
  headline: 'A lawyer and two engineers.',
  members: [
    {
      name: 'Ayush Talmale',
      role: 'Co-founder & CEO',
      bio: 'A lawyer by training. Lexli is built for the day he knows first-hand, and he keeps the product honest to how the courts actually work.',
    },
    {
      name: 'Yash Tiwari',
      role: 'Co-founder & CTO',
      bio: 'IIT-trained engineer. Builds the backend and the AI that reads, searches, and drafts: the machinery underneath the case record.',
    },
    {
      name: 'Swapnish Sahare',
      role: 'Co-founder & CPO',
      bio: 'IIT-trained engineer, designer at heart. Shapes how Lexli looks, feels, and works, from the design system to the front end.',
    },
  ] as TeamMember[],
};

export const companyCta = {
  headline: 'Come and test the claim.',
  subhead: 'Create a free account and bring one case in, or talk to us about your practice.',
};
