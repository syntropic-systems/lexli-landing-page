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

import { Compass, DoorOpen, Eye, FileStack, KeyRound, Scale } from 'lucide-react';

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
  headline: 'Most of the day is\nnot the practice of law.',
  paragraphs: [
    "An advocate's day contains a great deal of work that is not the practice of law. Checking tomorrow's board across three sites. Typing the same party names into the fourth application this month. Finding the order copy that exists in four places and is current in none.",
    'None of it requires judgement. All of it costs the hours where judgement happens.',
    'Lexli exists to take that layer off the desk, and to leave everything that genuinely requires an advocate exactly where it is.',
  ],
  consentLine: 'Lexli prepares. You decide.',
  /** Centre illustration for the reasons band — /public path. Until the asset
   * lands, leave undefined and the band shows a quiet icon panel instead. */
  illustration: '/company/why_we_exist.png' as string | undefined,
  /** The two larger reasons behind the thesis, flanking the illustration. */
  reasonsLead: 'Behind that are two larger reasons.',
  reasons: [
    {
      icon: FileStack,
      title: 'Paper',
      description:
        'Most of a practice still lives in physical files, and every file that exists only on paper has to be found, copied, carried, and retyped. Lexli is built so the case record can be digital from the day the case opens, without the practice giving up anything it relies on.',
    },
    {
      icon: DoorOpen,
      title: 'Access',
      description:
        'Most people who need the law cannot easily reach it. A litigant with one case and no idea where it stands. A clerk with a question and no one free to answer it. Lexli is built so the answer is easier to find, in the language they ask it, and easier to act on once found.',
    },
  ],
};

export const visionMission = {
  id: 'vision',
  eyebrow: 'Vision and mission',
  headline: 'Legal intelligence, made accessible.',
  statements: [
    {
      icon: Eye,
      label: 'Vision',
      text: "To be the name people in India associate with the law, and to power the future of the country's legal ecosystem through trusted legal intelligence.",
    },
    {
      icon: Compass,
      label: 'Mission',
      text: 'To give advocates, legal professionals, businesses, and citizens accurate, multilingual legal intelligence they can act on, so the work is easier to do and the law easier to reach.',
    },
  ],
  /** Centre illustration between the headline and the two statements —
   * /public path; the section renders without it until the asset lands. */
  illustration: '/company/vission_mission.png' as string | undefined,
};

/**
 * Commitments, not virtues. A values list a reader cannot hold you to is worth
 * nothing — each of these is already load-bearing elsewhere on the site.
 */
/**
 * Commitments, not virtues — each is load-bearing elsewhere on the site.
 * The certifications commitment ("built to SOC 2 / ISO 27001 controls, not
 * audited") lives on the Security surface, not here: these two share one
 * theme — where Lexli stops and the advocate begins.
 */
export const commitments = {
  id: 'commitments',
  eyebrow: 'Where Lexli stops',
  headline: 'Two lines, drawn in public.',
  lead: 'Every promise on this page rests on one thing: what happens when the platform acts. A values list is not verifiable, so here are two commitments that are.',
  items: [
    {
      icon: KeyRound,
      title: 'We do not file on our own authority',
      description:
        'Nothing leaves Lexli for a court, a client, or a portal without your explicit approval, through your own credentials. Preparation is ours; the act is always yours.',
    },
    {
      icon: Scale,
      title: "We do not replace the advocate's judgement",
      description:
        'Every translation, draft, and packet comes back for review, with the original beside it and the doubtful passages flagged. Output is a starting point that expects to be checked.',
    },
  ],
  closer: 'Features will change. Coverage will grow.\nThese two lines do not move.',
};

/**
 * Why now and the moat, merged: one argument in two movements — the record
 * existed and had nowhere to land; where it landed (the shared case record)
 * is the part a point tool cannot copy. Closes on the board's verbatim line.
 */
export const whyNow = {
  id: 'why-now',
  eyebrow: 'Why now',
  headline: 'The record was already digital.\nIt just had nowhere to land.',
  paragraphs: [
    'Court records went online. Cause lists are published. Orders are digital before they are paper. The record an advocate needs is, increasingly, already in a machine, just scattered across a dozen of them, in formats built for publication rather than for work.',
    'So Lexli gave it somewhere to land: the case record. Each tool exists somewhere as a separate product — what does not exist separately is the case they all share, and a point tool cannot copy that, because it does not have the record.',
  ],
  closer: "Integration is the moat a point solution can't copy.",
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
      photo: '/company/ayush_talmale.png',
    },
    {
      name: 'Yash Tiwari',
      role: 'Co-founder & CTO',
      bio: 'IIT-trained engineer. Builds the backend and the AI that reads, searches, and drafts: the machinery underneath the case record.',
      photo: '/company/yash_tiwari.png',
    },
    {
      name: 'Swapnish Sahare',
      role: 'Co-founder & CPO',
      bio: 'IIT-trained engineer, designer at heart. Shapes how Lexli looks, feels, and works, from the design system to the front end.',
      photo: '/company/swapnish_sahare.png',
    },
  ] as TeamMember[],
};

export const companyCta = {
  headline: 'Come and test the claim.',
  subhead: 'Create a free account and bring one case in, or talk to us about your practice.',
};
