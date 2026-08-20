/**
 * Platform page copy. Source: `content/platform_v2.md` (voice-calibrated draft).
 *
 * Register shifts are deliberate and load-bearing: the trust group (Security,
 * Integrations) is flat and specific, with zero wit. Do not "improve" it.
 */

import { KeyRound, LockKeyhole, Server, Shield } from 'lucide-react';

export type PlatformFeature = { title: string; description: string };

export type PlatformSection = {
  id: string;
  eyebrow: string;
  headline: string;
  /** Body paragraphs. Document intelligence is prose-only by design. */
  body: string[];
  features?: PlatformFeature[];
};

export const platformHero = {
  eyebrow: 'Lexli Platform',
  headline: 'One workspace for your entire practice.',
  subhead:
    'Your cases, files, hearings, and research live in one place, and every Lexli tool works from that same record. Ask for a draft and it arrives with the case details already in it, because the platform knew them before you asked.',
};

/** The thesis strip under the hero. No heading on the page — this is the argument. */
export const platformThesis = [
  'Point tools make you re-upload the same file and re-type the same party names. The parties are already in the file. Lexli takes them from there.',
  "Tomorrow's board updates itself because the platform already tracks your cases. Drafts arrive pre-filled because it knows the case type and the parties. eFiling packets assemble because the scanned pages are already OCR'd, merged, and indexed.",
  'That is the difference between a bundle of tools and a workspace.',
];

export const spine: PlatformSection = {
  id: 'case-management',
  eyebrow: 'Case management — the spine',
  headline: 'Every case, one living record.',
  body: [
    'Lexli is organised the way a practice is organised: by case. Each case holds the parties, the acts, the hearing history, the orders and judgements, your files, and your conversations about it. Everything else on this page works on top of this record, which is why nothing needs re-explaining.',
  ],
  features: [
    {
      title: 'Case status, current',
      description:
        'Details, parties, acts, orders and judgements, and hearing history in one view, from court records.',
    },
    {
      title: 'Files, filed',
      description:
        'Cloud storage with offline access, organised per case. Whatever a Lexli tool produces saves to the case that produced it.',
    },
    {
      title: 'Start from anywhere',
      description:
        'Create a case with your own details, or find it once in Case Finder and add it with its court record attached.',
    },
    {
      title: 'Your numbering, not ours',
      description:
        'Add custom details like your personal file number. The record matches how your office already works.',
    },
    {
      title: 'Conversations that stay with the case',
      description:
        'Each chat can be tied to a case, so context carries over hearing after hearing.',
    },
  ],
};

export const intelligenceTransition =
  'A record is only useful if you can ask it questions. This is the layer that reads and answers.';

export const intelligenceLayer: PlatformSection[] = [
  {
    id: 'ai-assistant',
    eyebrow: 'AI Assistant — the orchestrator',
    headline: 'One assistant that can use every tool.',
    body: [
      'The AI Assistant is where daily work happens. Ask about a case and it answers from that case’s actual files. Ask for a draft or a translation and it runs the right Lexli tool itself, inside the same conversation. You ask once; it brings the tool to you.',
    ],
    features: [
      {
        title: 'Case-aware answers',
        description:
          'Point it at a case and it works from the record: files, orders, hearing history.',
      },
      {
        title: 'Runs the tools for you',
        description:
          'Drafting, Legal Translator, Case Finder, and the rest, called from inside your chat, output handed back to you.',
      },
      {
        title: 'Upload and ask',
        description: 'Drop in a scan or a PDF and question it directly.',
      },
      {
        title: 'Web search built in',
        description: 'Judgements, statutes, and current updates beyond your own files.',
      },
      { title: 'Voice mode', description: 'Speak instead of type.' },
      {
        title: 'Remembers how you work',
        description: 'Your preferences and patterns carry across conversations.',
      },
    ],
  },
  {
    id: 'document-intelligence',
    eyebrow: 'Document intelligence — the foundation',
    headline: 'Built to read legal documents as they actually arrive.',
    // Prose only, no bullets — this is the moat argument, not a checklist.
    body: [
      'Legal files do not arrive clean. They arrive as scanned annexures, stamped pages, tables inside affidavits, and hundred-page executed agreements, with a stamp across the signature block. Lexli’s document intelligence is built for exactly this. It reads text, tables, images and stamps, and long legal content from PDFs, forms, contracts, and amendments, and turns them into clean, structured data the software can actually use.',
      'This is the layer everything else stands on. The board updates itself because your cases are already understood. Drafts arrive pre-filled because the platform knows the case type and the parties. eFiling packets assemble because the scanned pages are already OCR’d, merged, and indexed.',
    ],
  },
  {
    id: 'legal-research',
    // Matches the nav anchor's name — eyebrows are the wayfinding layer.
    eyebrow: 'Legal research',
    headline: 'Research that starts from the case, not from a blank box.',
    body: [
      'Generic legal search gives you the law. Lexli gives you the law for this case, because research here begins from the record: the files, the parties, the history.',
    ],
    features: [
      {
        title: 'Live legal search',
        description:
          'Judgements, case law, statutes (IPC, BNSS, and more), and government resolutions.',
      },
      {
        title: 'Case-aware research',
        description: 'Answers grounded in the case’s own files and history.',
      },
      {
        title: 'Arguments and rebuttals',
        description: 'Build your side; anticipate the other side’s.',
      },
      {
        title: 'A note for every hearing',
        description: 'Running case notes, kept with the case.',
      },
      {
        title: 'IRAC summaries',
        description: 'Cases and files summarised in the structure you would use yourself.',
      },
      {
        title: 'The working calculations',
        description: 'Limitation period, court fees, and jurisdiction for a given case.',
      },
    ],
  },
  {
    id: 'advanced-search',
    // Matches the nav anchor's name — eyebrows are the wayfinding layer.
    eyebrow: 'Advanced search',
    headline: 'Ask for anything, in plain language.',
    body: [
      '"The order where costs were imposed." "The agreement with the indemnity clause." "Files from the March hearing." Advanced Search finds it from a plain-language query, across cases, orders, statements inside files, dates, names, and file names.',
    ],
  },
];

export const security = {
  id: 'security',
  eyebrow: 'Security',
  headline: 'How your data is protected.',
  body: 'Lexli runs on audited infrastructure. Data is encrypted at rest and in transit, network traffic is filtered before it reaches us, and production access is limited, logged, and reviewed.',
  details: [
    {
      icon: Server,
      title: 'Hosted on Azure',
      description:
        "Inheriting Azure's physical security, environmental controls, redundant power, and compliance baseline.",
    },
    {
      icon: LockKeyhole,
      title: 'Encryption',
      description: 'AES-256 at rest; TLS 1.3 in transit across public networks.',
    },
    {
      icon: Shield,
      title: 'Network protection',
      description:
        'Cloudflare WAF coverage, DDoS mitigation, and global CDN before traffic reaches us.',
    },
    {
      icon: KeyRound,
      title: 'Access control',
      description: 'Production access is least-privilege, short-lived, fully logged, and reviewed.',
    },
  ],
  /**
   * Status words are load-bearing: "Aligned"/"Ready", never "Certified" —
   * the aligned-not-audited distinction is the approved wording.
   */
  complianceBadges: [
    { label: 'SOC 2 Type II', status: 'Aligned' },
    { label: 'ISO 27001', status: 'Aligned' },
    { label: 'GDPR', status: 'Ready' },
  ],
  // conservative: "built to the controls, not yet audited" — and the draft's
  // optional closing clause is cut, keeping the register flat.
  compliance:
    'Lexli is built to the controls that SOC 2 Type II and ISO 27001 define, and is GDPR-ready. Built to those controls, not yet audited against them. We state it that way because the distinction matters.',
  // conservative: two providers that carry the security story, not all five.
  infrastructure: ['Azure', 'Cloudflare'],
};

export const integrations = {
  id: 'integrations',
  eyebrow: 'Integrations — works with the courts',
  headline: 'Connected to the systems Indian practice runs on.',
  body: [
    'Lexli connects to the official systems your practice already depends on, so nothing has to be rebuilt to start.',
    // conservative: coverage narrowed to what is confirmed available today.
    'Case status, orders, hearing history, and party details come from official court records, by case number or advocate name, across High Courts and District Courts. Supreme Court and Tribunal coverage, and search by CNR or party name, are scheduled.',
    'Cause lists are pulled as courts publish them, so tomorrow’s board is built from the real list rather than yesterday’s copy of it.',
    'eFiling packets are prepared to the format each portal expects and submitted through your own credentials. The eDraft is reviewed and approved by you before anything leaves the platform.',
  ],
  consentLine: 'Lexli prepares. You decide.',
  close:
    'Your existing files, diaries, and templates stay exactly as they are. Lexli sits on top of what already works.',
};

export const platformCta = {
  headline: 'Start on Lexli.',
  subhead:
    'Create a free account and bring your first case in today, or talk to us about your team.',
};
