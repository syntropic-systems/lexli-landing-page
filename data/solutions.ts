/**
 * Solutions page copy. Source: `content/solutions/*.md`.
 *
 * The "scenes" blocks are recognition, not claims — they carry
 * [VERIFY-RECOGNITION] in the drafts: the team confirms each rings true or
 * replaces it. A wrong detail here costs more than a missing one.
 */

import {
  Briefcase,
  CalendarClock,
  FolderKanban,
  FolderSearch,
  Handshake,
  MoonStar,
  NotebookPen,
  PenLine,
  ScanLine,
  Sunrise,
  type LucideIcon,
} from 'lucide-react';

export type SolutionBlock =
  | { kind: 'scenes'; eyebrow?: string; title: string; scenes: string[]; closer?: string }
  | {
      kind: 'moments';
      eyebrow?: string;
      title: string;
      intro?: string;
      moments: { label: string; text: string; icon: LucideIcon }[];
    }
  | { kind: 'prose'; eyebrow?: string; title: string; paragraphs: string[] }
  | {
      kind: 'bullets';
      eyebrow?: string;
      title: string;
      intro?: string;
      bullets: { title: string; description: string }[];
      /** Verdict line after the lattice, with an optional explaining paragraph. */
      closer?: string;
      outro?: string;
    }
  | {
      kind: 'routing';
      /** Wayfinding eyebrow over the headline (the site's section pattern). */
      eyebrow?: string;
      title: string;
      /** 'sequence' (default): the advocates on-ramp — free/platform rows,
       * kickers, arrows. 'references': a plain pill row, wayfinding only. */
      style?: 'sequence' | 'references';
      intro?: string;
      /** Rendered as an ordered pill strip — sequence is the content.
       * Descriptions are kept in the data but no longer rendered. */
      links: { label: string; description?: string; href: string; free?: boolean }[];
      /** Closing paragraph under the strip (e.g. the plans note). */
      outro?: string;
    };

export type SolutionPage = {
  slug: string;
  seo: { title: string; description: string };
  hero: { eyebrow: string; headline: string; subhead: string };
  /** Front-door personas lead with "start free"; firms lead with a demo. */
  ctaLead: 'free' | 'demo';
  blocks: SolutionBlock[];
  finalCta: { headline: string; subhead: string };
};

export const solutionPages: SolutionPage[] = [
  {
    slug: 'advocates',
    seo: {
      title: 'Lexli for advocates - the workspace for a litigation practice',
      description:
        "For solo advocates and small chambers: tomorrow's board builds itself, case files live in one record, and drafts arrive with the details filled in. Start free.",
    },
    hero: {
      eyebrow: 'For advocates & lawyers',
      headline: 'Forty cases. Three courts. One of you.',
      subhead:
        'Lexli is a workspace for the practice you already run. The board, the files, the drafts, the client calls, all organised the way you organise them: by case.',
    },
    ctaLead: 'free',
    blocks: [
      {
        kind: 'scenes',
        eyebrow: 'The reality',
        title: 'The day, as it is',
        scenes: [
          'The board for tomorrow gets checked tonight: on the court website, then on the group, then once more with your clerk.',
          "A case file exists in four places: the office almirah, a junior's bag, a pen drive, and photographs in your phone.",
          'The same party names get typed into every application, every vakalatnama, every index. They have not changed since the case began.',
          'The client calls after every date. The answer exists, spread across a diary, an order copy, and your memory of the morning.',
        ],
        closer: 'None of this is the practice of law. All of it is the day.',
      },
      {
        kind: 'moments',
        eyebrow: 'The workspace',
        title: 'The day, on Lexli',
        moments: [
          {
            icon: MoonStar,
            label: 'The evening before.',
            text: 'The board has already built itself from the published cause lists: every court, with the last orders attached. You read it; you do not assemble it.',
          },
          {
            icon: Sunrise,
            label: 'In the morning.',
            text: 'The case record is in your pocket: parties, acts, hearing history, the note you made after the last date. Multi-device: the desk, the corridor, the courtroom door.',
          },
          {
            icon: PenLine,
            label: 'The paperwork.',
            text: 'Ask for the application and it arrives with the case details already in it, because the platform read the file when the case did. You write the argument; the re-typing is over.',
          },
          {
            icon: NotebookPen,
            label: 'After the hearing.',
            text: "The note goes in the case. The order lands in the file when it's published. And the client's question now has a one-minute answer, because the record is the answer.",
          },
        ],
      },
      {
        kind: 'routing',
        eyebrow: 'Where to start',
        title: 'Start free. The rest is already there.',
        // Sequence = the advocate's on-ramp: the free doors first in the
        // order the day meets them, the record they feed, then depth, with
        // the Assistant last as the "or just ask" exit.
        links: [
          {
            label: 'Daily Board',
            description: 'Tomorrow’s hearings, built for you. Free.',
            href: '/tools/daily-board',
            free: true,
          },
          {
            label: 'Case Finder',
            description: 'Any case, found and kept. Free.',
            href: '/tools/case-finder',
            free: true,
          },
          {
            label: 'Legal Translator',
            description: 'The judgement, in the language your client reads.',
            href: '/tools/legal-translator',
            free: true,
          },
          {
            label: 'Document Scanner',
            href: '/tools/document-scanner',
            free: true,
          },
          {
            label: 'Case Management',
            // Hash hrefs never reach the URL — ScrollLink routes clean and
            // scrolls via the header's scroll-target machinery.
            href: '/platform#case-management',
          },
          {
            label: 'eFiling Support',
            href: '/tools/efiling-support',
          },
          {
            label: 'Drafting',
            description: 'The details filled in before you begin.',
            href: '/tools/drafting',
          },
          {
            label: 'AI Assistant',
            description: 'The whole platform, asked a question.',
            href: '/platform#ai-assistant',
          },
          {
            label: 'Legal Research',
            href: '/platform#legal-research',
          },
        ],
        // The former "Plans" prose block, folded in as the strip's closer —
        // it answers the question the two rows raise.
        outro:
          'Start free, alone: the front-door tools and your first cases. When a junior or a clerk joins the practice, add them to the same workspace with their own role. Nothing migrates; the record just gains readers.',
      },
    ],
    finalCta: {
      headline: "Tomorrow's board is a good place to start.",
      subhead: 'Create a free account, add your name, and see it built.',
    },
  },

  {
    slug: 'law-firms-businesses',
    seo: {
      title: 'Lexli for law firms & businesses - one record, whole team',
      description:
        'Partners, juniors, and clerks on the same case record with role-based access and admin control. And for businesses: every case your company touches, tracked in one place.',
    },
    hero: {
      eyebrow: 'For law firms & businesses',
      // Terminology rule wins over firm-world register: case, not matter.
      headline: 'The case file, without the "who has the file?"',
      subhead:
        'Lexli puts the whole team on the same case record: partners, juniors, clerks, each with the access their role carries, under admin control the firm holds.',
    },
    ctaLead: 'demo',
    blocks: [
      {
        // Three former sections consolidated into one argument arc: the
        // shared record (intro) → firm-grade control (lattice) → nothing
        // displaced by adopting it (closer + outro). Same words throughout.
        kind: 'bullets',
        eyebrow: 'The shared record',
        title: 'Run like a firm, not a shared drive',
        intro:
          'A case at a firm is touched by five people and owned by one record. On Lexli, the partner sees the strategy notes, the junior updates the hearing history, the clerk files the scans: the same case, live, with no version of it in anyone’s inbox.',
        bullets: [
          {
            title: 'Roles and access',
            description:
              'Advocate, clerk, and staff profiles; read and write decided per team, by your admin.',
          },
          {
            title: 'Admin management',
            description:
              'Accounts, access, and teams controlled centrally by the firm, not negotiated per case.',
          },
          {
            title: 'Seat-based plans',
            description: 'Add seats as the firm grows.',
          },
          {
            title: 'Every tool, same record',
            description:
              "The board for every advocate in the firm, drafting from the firm's case files, research grounded in the firm's own record.",
          },
        ],
        closer: 'Nothing migrates first.',
        outro:
          'Lexli works alongside how the firm already runs. Existing files, diaries, templates, and habits stay as they are. The workspace sits on top of what already works, and earns its place case by case.',
      },
      {
        kind: 'moments',
        eyebrow: 'Beyond the firm',
        title: 'For businesses',
        intro: 'Three different relationships to the courts.',
        moments: [
          {
            icon: Briefcase,
            label: 'Legal teams inside companies.',
            text: 'Disputes, notices, recoveries, compliance matters: an in-house team runs cases the way a firm does, and Lexli works the same way for them: every case a record, every document filed to it, research and drafting grounded in it, access controlled by the team’s admin.',
          },
          {
            icon: FolderSearch,
            label: 'Businesses without lawyers on staff.',
            text: 'A company does not need a legal department to be in court. Case Finder and Case Management give a business its own record of every case it is party to: status, hearing history, orders as they publish, without calling anyone to ask.',
          },
          {
            icon: Handshake,
            label: 'Businesses working with outside counsel.',
            // Deliberately a parallel record, NOT a shared cross-org workspace —
            // that capability appears nowhere on the product boards.
            text: 'Your counsel runs the case. You keep your own record of it in your own workspace: the status, the orders, the documents your side holds. The company’s view of its litigation does not live in a forwarded PDF.',
          },
        ],
      },
      {
        // Last on purpose: the closing "On the platform" proof strip is the
        // three pages' shared signature, and IT diligence is the final
        // objection for firms and businesses alike — answered, then the CTA.
        kind: 'routing',
        style: 'references',
        eyebrow: 'On the platform',
        title: 'What your IT reviewer will ask',
        links: [
          { label: 'Security', href: '/platform#security' },
          { label: 'Accounts and profiles', href: '/platform#accounts' },
        ],
        outro:
          'Lexli is hosted on Azure, encrypted with AES-256 at rest and TLS 1.3 in transit, behind Cloudflare’s WAF, with least-privilege, logged production access. It is built to SOC 2 Type II and ISO 27001 controls, not yet audited against them, and we say it that way deliberately. The full detail is on the platform’s security section.',
      },
    ],
    finalCta: {
      headline: 'Put the team on one record.',
      subhead: 'A demo takes half an hour and your most complicated case.',
    },
  },

  {
    slug: 'clerks-legal-staff',
    seo: {
      title: 'Lexli for clerks & legal staff - one record, every hand',
      description:
        'Your clerk, juniors, and staff work on the same case record you do, scanning, filing, and preparing, with access you control, role by role.',
    },
    hero: {
      eyebrow: "For the practice's staff",
      headline: 'The practice runs on more hands than yours.',
      subhead:
        'Your clerk keeps the register. A junior maintains the files. Someone chases the certified copies. Lexli gives them the same case record you work from, each with the access their role needs, and no more.',
    },
    ctaLead: 'demo',
    blocks: [
      {
        kind: 'scenes',
        eyebrow: 'The reality',
        title: 'What your staff carries',
        scenes: [
          'The diary and the register agree with each other because someone makes them agree, every evening.',
          'Orders are collected, photocopied, punched, and filed, and found again because one person remembers where.',
          'When that person is on leave, the practice slows. Not because the work is hard, but because the system is in their head.',
        ],
      },
      {
        // Card grid, not lattice: this is the page's answer beat — the same
        // slot the advocates page dresses in cards. Glyphs come from each
        // duty's tool.
        kind: 'moments',
        eyebrow: 'The workspace',
        title: 'The same duties, on Lexli',
        moments: [
          {
            icon: CalendarClock,
            label: 'Keeping the board',
            text: 'The Daily Board builds itself from the published cause lists; your clerk confirms it instead of assembling it.',
          },
          {
            icon: ScanLine,
            label: 'Filing what arrives',
            text: 'Scans go in through Document Scanner, straight to the right case. The almirah keeps the paper; the record keeps the practice.',
          },
          {
            icon: FolderKanban,
            label: 'Keeping cases current',
            text: 'Hearing dates, orders, and notes maintained on the case record, visible to everyone who works the case.',
          },
          {
            icon: PenLine,
            label: "Preparing what's next",
            text: 'eDrafts and document packets prepared by staff, reviewed and approved by you. Preparation is delegated. Approval is not.',
          },
        ],
      },
      {
        kind: 'routing',
        style: 'references',
        eyebrow: 'On the platform',
        title: 'Access, decided by you',
        outro:
          'Profiles are role-based: advocate, clerk, litigant. You decide who reads and who writes, per team. Every account is its own login on its own device: no shared passwords, no shared phone.',
        // References, not a sequence — the proof-paths for the access and
        // security claims this page makes.
        links: [
          { label: 'Accounts and profiles', href: '/platform#accounts' },
          { label: 'Security', href: '/platform#security' },
          { label: 'Case Management', href: '/platform#case-management' },
        ],
      },
    ],
    finalCta: {
      headline: 'Same staff. Same duties. One record.',
      subhead: 'Add your team to the workspace, with the access you choose.',
    },
  },
];

export function getSolution(slug: string): SolutionPage | undefined {
  return solutionPages.find((page) => page.slug === slug);
}
