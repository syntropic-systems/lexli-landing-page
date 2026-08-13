/**
 * Tool page copy. Source: `content/tools/*.md` (voice-calibrated drafts).
 *
 * Where a draft carried an unresolved [VERIFY] flag, the narrower claim ships —
 * see the `// conservative:` comments. Widen these only against confirmed
 * product behaviour, not optimism.
 */

import type { ComponentType } from 'react';
import {
  CalendarClock,
  CalendarDays,
  Clock,
  Columns2,
  FileCheck,
  FileDown,
  FileInput,
  FilePenLine,
  FileStack,
  FileText,
  Fingerprint,
  FolderInput,
  FolderOpen,
  FolderPlus,
  History,
  KeyRound,
  Landmark,
  Layers,
  LayoutTemplate,
  Languages,
  MessagesSquare,
  Mic,
  Paperclip,
  ScrollText,
  Search,
  Smartphone,
  SpellCheck,
  Upload,
  UserRound,
  Users,
} from 'lucide-react';

export type ToolKind = 'front-door' | 'inside';

export type ToolStep = {
  title: string;
  description: string;
  /** /public path for the step's 3:2 visual; steps without one fall back to
   * the numeral vignette. */
  image?: string;
};
export type ToolFeature = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

export type ToolPage = {
  slug: string;
  name: string;
  kind: ToolKind;
  eyebrow: string;
  seo: { title: string; description: string };
  hero: { headline: string; subhead: string };
  steps: ToolStep[];
  features: ToolFeature[];
  /** The closing tool → workspace move. */
  platform: { paragraphs: string[]; line: string };
  finalCta: { headline: string; subhead: string };
};

export const tools: ToolPage[] = [
  {
    slug: 'daily-board',
    name: 'Daily Board',
    kind: 'front-door',
    eyebrow: 'Daily Board · Free on Lexli',
    seo: {
      title: "Daily Board - tomorrow's cause list",
      description:
        "Your board for tomorrow, built from official cause lists: every court you appear in, every advocate in your office, with the latest orders attached. Free on Lexli.",
    },
    hero: {
      headline: "Tomorrow's board, ready before you are.",
      // conservative: draft claimed continuous verification as lists change —
      // reduced to what the board is built from until reconciliation is confirmed.
      subhead:
        'Lexli builds your board from the cause lists courts publish: every court you appear in, every advocate in your office. Which case, which court, which item.',
    },
    steps: [
      {
        title: 'Add names and courts',
        description:
          'One advocate or the whole office: every court any of you appears in, on a single board.',
        image: '/tools/steps/daily_board_01.png',
      },
      {
        title: 'The board runs itself',
        description:
          'Auto-scheduled, daily, built from the official cause lists, so you are not rebuilding it each evening.',
        image: '/tools/steps/daily_board_02.png',
      },
      {
        title: 'Open any entry',
        description:
          "The case's latest orders, the opposition advocate's details, and the timetable: which case, where, when.",
        image: '/tools/steps/daily_board_03.png',
      },
      {
        title: 'Take it with you',
        description:
          'Export as PDF or doc, order files attached, or ask the AI Assistant for it in chat.',
        image: '/tools/steps/daily_board_04.png',
      },
    ],
    features: [
      {
        icon: CalendarClock,
        title: 'Auto-run, every day',
        description: 'The board schedules itself; you do not rebuild it each evening.',
      },
      {
        icon: Users,
        title: 'Multiple advocates, multiple courts',
        description: "One board for the whole office's appearances.",
      },
      {
        icon: ScrollText,
        title: 'Built from official cause lists',
        description: 'The board reflects what the court published, not a copy of a copy.',
      },
      {
        icon: Paperclip,
        title: 'Latest orders, attached',
        description: "Each entry carries the case's most recent orders.",
      },
      {
        icon: UserRound,
        title: 'Opposition details',
        description: 'The advocate on the other side, named on the entry.',
      },
      {
        icon: CalendarDays,
        title: 'Case timetable',
        description: 'Which case, where, and when, in one view.',
      },
      {
        icon: FileDown,
        title: 'Export with order files',
        description: 'PDF or doc, including the last orders, ready to print or forward.',
      },
      {
        icon: MessagesSquare,
        title: 'Available through the AI Assistant',
        description: '"What is my board for tomorrow" is a question, not a task.',
      },
    ],
    platform: {
      paragraphs: [
        'On its own, the Daily Board tells you where to be. Inside Lexli, every entry is a door: tap a case and you are in its record: files, hearing history, notes from the last date. A case you do not have yet can be found in Case Finder and added, court record attached, before tomorrow’s hearing.',
        'Your evening prep and tomorrow’s board stop being two separate documents.',
      ],
      line: 'The board knows your cases because the platform already does.',
    },
    finalCta: {
      headline: "Tomorrow's board is already forming.",
      subhead: 'Create a free account, add your name, and see it.',
    },
  },

  {
    slug: 'case-finder',
    name: 'Case Finder',
    kind: 'front-door',
    eyebrow: 'Case Finder · Free on Lexli',
    seo: {
      title: "Case Finder - check a case's status",
      description:
        'Find a case by case number or advocate name across High Courts and District Courts, see its status, parties, hearing history, orders and judgements, and keep its record on Lexli. Free.',
    },
    hero: {
      headline: 'Find the case. Keep the record.',
      // conservative: the draft's own fallback subhead. The wide claim (Supreme
      // Court, Tribunals, CNR and party-name search) is unconfirmed — those
      // appear below as scheduled rather than available.
      subhead:
        'Search by case number or advocate name across High Courts and District Courts, and open the full record: status, parties, acts, orders and judgements, hearing history.',
    },
    steps: [
      {
        title: 'Find the case',
        description:
          'Case number or advocate name, across High Courts and District Courts, whichever detail you have.',
        image: '/tools/steps/finder_01.png',
      },
      {
        title: 'Open the record',
        description:
          'Status, parties, acts, orders and judgements, and the full hearing history, all from official court records.',
        image: '/tools/steps/finder_02.png',
      },
      {
        title: 'Save the case',
        description:
          'Save it to your workspace and the record stays with you: files, notes, and updates in one place.',
        image: '/tools/steps/finder_03.png',
      },
      {
        title: 'Or ask the Assistant',
        description:
          '"Find the case where…" works. The AI Assistant runs Case Finder from inside a conversation.',
        image: '/tools/steps/finder_04.png',
      },
    ],
    features: [
      {
        icon: Search,
        title: 'Search by case number or advocate name',
        description: 'Across High Courts and District Courts.',
      },
      {
        icon: Clock,
        title: 'CNR and party-name search',
        description:
          'Scheduled, along with Supreme Court and Tribunal coverage.',
      },
      {
        icon: FileText,
        title: 'The full record, not a summary',
        description: 'Status, parties, acts, hearing history, orders and judgements.',
      },
      {
        icon: Landmark,
        title: 'From official court records',
        description: "What the court's own systems say, not a scrape of a scrape.",
      },
      {
        icon: FolderPlus,
        title: 'Save to your workspace',
        description: 'A found case becomes a managed case, record attached.',
      },
      {
        icon: MessagesSquare,
        title: 'Available through the AI Assistant',
        description: 'Search from inside a conversation.',
      },
    ],
    platform: {
      paragraphs: [
        "Checking a case's status answers today's question. Saving it answers the next hundred: the case joins your workspace, tomorrow's Daily Board picks it up, research starts from its record, and every order that follows lands in its file.",
      ],
      line: 'No one should have to find the same case twice.',
    },
    finalCta: {
      headline: 'The case is on record. Get it on yours.',
      subhead: 'Create a free account and search.',
    },
  },

  {
    slug: 'legal-translator',
    name: 'Legal Translator',
    kind: 'front-door',
    eyebrow: 'Legal Translator · Free on Lexli',
    seo: {
      title: 'Legal Translator - judgements in English, Hindi, Marathi',
      description:
        'Upload or scan a legal document and translate it between English, Hindi, and Marathi, reviewed side by side with the original and exported clean as .doc or .pdf. Free on Lexli.',
    },
    hero: {
      headline: 'The judgement is in English. Your client reads Marathi.',
      subhead:
        'Upload or scan a legal document and translate it between English, Hindi, and Marathi. Review it next to the original, edit it in place, and export a clean .doc or .pdf.',
    },
    steps: [
      {
        title: 'Upload or scan',
        description:
          'A PDF, a photo of a page, a scanned order: the document as you actually have it.',
        image: '/tools/steps/translator_01.png',
      },
      {
        title: 'Translate the document',
        // The nine-name list lives in the features grid below — a card
        // description is the wrong place for an inventory.
        description:
          'Between English, Hindi, and Marathi: any pair, either direction. Nine more Indian languages are scheduled.',
        image: '/tools/steps/translator_02.png',
      },
      {
        title: 'Review side by side',
        description:
          'The translation sits beside the original, with warnings where a term deserves your own eye.',
        image: '/tools/steps/translator_03.png',
      },
      {
        title: 'Edit and export',
        description:
          'Correct it in place, every revision kept. Export .doc or .pdf, or assign it to the case.',
        image: '/tools/steps/translator_04.png',
      },
    ],
    features: [
      {
        icon: Languages,
        title: 'English, Hindi, Marathi',
        description: 'Translate between any pair.',
      },
      {
        icon: Clock,
        title: 'Nine more languages scheduled',
        description:
          'Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, and Assamese.',
      },
      {
        icon: Upload,
        title: 'Upload or scan to translate',
        description: 'Works from the paper you actually have, not just clean PDFs.',
      },
      {
        icon: Columns2,
        title: 'Comparison view with warnings',
        description:
          'The translation sits next to the original; flagged passages ask for your judgement before the document leaves your hands.',
      },
      {
        icon: History,
        title: 'Edit in place, versions kept',
        description: 'The translation is yours to correct, and every revision is retained.',
      },
      {
        icon: FileDown,
        title: 'Clean export',
        description: '.doc or .pdf, formatted for use, not for deciphering.',
      },
      {
        icon: FolderInput,
        title: 'Assign to case',
        description: 'The translation lives in the case file, beside the original.',
      },
      {
        icon: MessagesSquare,
        title: 'Available through the AI Assistant',
        description: 'Send a file in chat, ask for it in Marathi.',
      },
    ],
    platform: {
      // conservative: dropped the cross-document terminology-consistency claim.
      paragraphs: [
        'A translation you download is a file on a laptop. A translation on Lexli sits in the case file next to its original, versioned, and findable by Advanced Search in either language.',
      ],
      line: 'A translated judgement is still a judgement. It gets treated like one.',
    },
    finalCta: {
      headline: 'The document is ready when your reader is.',
      subhead: 'Create a free account and translate the first one.',
    },
  },

  {
    slug: 'document-scanner',
    name: 'Document Scanner',
    kind: 'front-door',
    eyebrow: 'Document Scanner · Free on Lexli',
    seo: {
      title: 'Document Scanner - from paper to working file',
      description:
        'Scan from your phone or laptop, digitise the pages into an editable .doc or .pdf, and save it straight to the case. Free on Lexli.',
    },
    hero: {
      headline: 'Paper in, working file out.',
      // conservative: no blanket "searchable/OCR on every scan" claim — the
      // product board notes OCR in the eFiling flow. OCR is described there.
      subhead:
        'Scan from your phone or laptop. Lexli digitises the pages into an editable .doc or .pdf and saves it where it belongs: the case.',
    },
    steps: [
      {
        title: 'Scan or upload',
        description:
          'Phone camera or laptop: certified copies, annexures, the page with the stamp across it.',
        image: '/tools/steps/scanner_01.png',
      },
      {
        title: 'Digitise the pages',
        description:
          'The scan becomes an editable, working .doc or .pdf, not a photograph of a page.',
        image: '/tools/steps/scanner_02.png',
      },
      {
        title: 'File it to the case',
        // "upload modal" was app jargon — the claim is reachability, not UI.
        description:
          'Assign it to its case, or download it. Recent scans stay on hand; yesterday’s file is one tap away.',
        image: '/tools/steps/scanner_03.png',
      },
    ],
    features: [
      {
        icon: Smartphone,
        title: "Scan from the device you're holding",
        description: 'Phone or laptop, no separate hardware.',
      },
      {
        icon: FilePenLine,
        title: 'Editable output',
        description: '.doc or .pdf for digitised documents; .pdf for plain scans.',
      },
      {
        icon: FolderInput,
        title: 'Straight to the case',
        description: 'Outputs assign to case files, ready for the record.',
      },
      {
        icon: Layers,
        title: 'Prepared for filing',
        description:
          'Scans headed for eFiling are OCR converted, merged, and indexed to the format the portal expects.',
      },
      {
        icon: History,
        title: 'Recents and outputs on hand',
        description: 'What you scanned stays reachable, not re-scanned.',
      },
      {
        icon: MessagesSquare,
        title: 'Available through the AI Assistant',
        description: 'Scan, then ask questions about what is on the page.',
      },
    ],
    platform: {
      paragraphs: [
        "A scanner app gives you a PDF in your phone's gallery, between two family photos. Lexli gives the scan a home: it lands in the case file, ready for the research, the draft, and the eFiling packet that will need it merged and indexed.",
      ],
      line: 'Scan it once, and the platform never asks for it again.',
    },
    finalCta: {
      headline: 'The file cabinet is retiring.',
      subhead: 'Create a free account and scan the first page.',
    },
  },

  {
    slug: 'drafting',
    name: 'Drafting',
    kind: 'inside',
    eyebrow: 'Drafting · A Lexli platform tool',
    seo: {
      title: 'Drafting - drafts with the case details already in them',
      description:
        'Start from a pre-filled template or a blank page, dictate or type, keep your own drafting conventions, with the parties and case type filled in from the case file.',
    },
    hero: {
      headline: 'Drafts that arrive with the case details already in them.',
      subhead:
        'Start from a template or a blank page. If the case is on Lexli, the parties, the court, and the case type are filled in before you begin. You write the argument. The re-typing is over.',
    },
    steps: [
      {
        title: 'Start the draft',
        description:
          "A pre-filled template by case type, or a blank page, with the case's details drawn in from its file.",
        image: '/tools/steps/drafting_01.png',
      },
      {
        title: 'Write it your way',
        description:
          'Type, or dictate with voice-to-text. Auto-correct is backed by a legal dictionary, so "vakalatnama" survives it.',
        image: '/tools/steps/drafting_02.png',
      },
      {
        title: 'Edit with history',
        description:
          'Every version is kept as you go: compare drafts, revert to an earlier one, carry on writing.',
        image: '/tools/steps/drafting_03.png',
      },
      {
        title: 'Export or file it',
        description:
          'Download as .doc or .pdf, or assign it straight to the case file, ready for the record.',
        image: '/tools/steps/drafting_04.png',
      },
    ],
    features: [
      {
        icon: LayoutTemplate,
        title: 'Pre-filled templates for case types',
        description: 'The clerical part of a draft done before you open it.',
      },
      {
        icon: Fingerprint,
        title: 'Your drafting pattern',
        description: 'Lexli follows how you draft: your structure, your phrasing, your conventions.',
      },
      {
        icon: Languages,
        title: 'Multilingual drafting',
        description: 'Draft in English, Hindi, or Marathi.',
      },
      {
        icon: Mic,
        title: 'Voice-to-text transcription',
        description: 'Dictate the draft; edit the text.',
      },
      {
        icon: SpellCheck,
        title: 'Auto-correct with a legal dictionary',
        description: 'Legal vocabulary treated as vocabulary, not typos.',
      },
      {
        icon: History,
        title: 'Version history',
        description: 'Every draft, every revision, kept with the case.',
      },
      {
        icon: FileDown,
        title: 'Export as .doc or .pdf',
        description: 'Courts and clients get the format they expect.',
      },
      {
        icon: MessagesSquare,
        title: 'Available through the AI Assistant',
        description: 'Ask for a draft in chat; the assistant runs Drafting and hands it back.',
      },
    ],
    platform: {
      paragraphs: [
        'Drafting alone saves typing. Drafting inside Lexli saves the part before the typing: the platform has already read the case file, so the parties, the case type, and the court arrive in the draft without being asked for. The finished draft saves to the case, versioned. If it is headed for a portal, eFiling Support takes it from there.',
        'Nothing is filed until you have read it and said yes.',
      ],
      line: 'Lexli prepares. You decide.',
    },
    finalCta: {
      headline: 'The next draft starts half-done.',
      subhead:
        "Bring a case onto Lexli and ask for a draft, or talk to us about your team's templates.",
    },
  },

  {
    slug: 'efiling-support',
    name: 'eFiling Support',
    kind: 'inside',
    eyebrow: 'eFiling Support · A Lexli platform tool',
    seo: {
      title: 'eFiling Support - from case file to portal-ready packet',
      description:
        "eDrafts filled from the case file, documents OCR'd, merged and indexed to portal format. Reviewed and approved by you, filed through your own credentials.",
    },
    hero: {
      headline: 'The packet, prepared. The filing, yours.',
      subhead:
        "Lexli assembles the eFiling packet: the eDraft filled from the case file, the documents OCR'd, merged, and indexed to the format the portal expects. You review it, you approve it, and it files through your own credentials.",
    },
    steps: [
      {
        title: 'Choose the case',
        description:
          'A new case or a running one: the packet builds from the case file either way.',
        image: '/tools/steps/eFiling_01.png',
      },
      {
        title: 'The eDraft fills itself',
        description:
          'Party names, case details, form fields: extracted from the case files, not re-typed into a portal form.',
        image: '/tools/steps/eFiling_02.png',
      },
      {
        title: 'The packet assembles',
        description:
          'OCR conversion, merging, blank-page removal, and indexing, to the exact format the portal expects.',
        image: '/tools/steps/eFiling_03.png',
      },
      {
        title: 'Review, approve, file',
        description:
          'Every field and every page is yours to check. Submission goes through your own portal credentials, not ours.',
        image: '/tools/steps/eFiling_04.png',
      },
    ],
    features: [
      {
        icon: FileInput,
        title: 'eDraft creation from case files',
        description: 'The form filled from the record, before you open it.',
      },
      {
        icon: FileCheck,
        title: 'Filled-form editing and verification',
        description: 'Every extracted field is editable, and nothing is final until verified.',
      },
      {
        icon: Layers,
        title: 'Document readiness',
        description: 'OCR, merge, blank-page removal, indexing: the unglamorous requirements, met.',
      },
      {
        icon: KeyRound,
        title: 'Your credentials, your filing',
        description:
          "Submission happens through the user's own portal account. Lexli never files on its own authority.",
      },
      {
        icon: FolderOpen,
        title: 'New and existing cases',
        description: 'First filing or the hundredth in a running case.',
      },
      {
        icon: FileStack,
        title: 'eDraft management',
        description: 'Save, revise, and export (.doc) drafts before submission.',
      },
    ],
    platform: {
      paragraphs: [
        "eFiling Support is where the rest of the platform's work converges. The scan you took in Document Scanner is already prepared. The draft you wrote in Drafting is already in the case file. The party details the eDraft needs were extracted when the case record was built. The packet assembles because the platform has been preparing it since the case arrived.",
        'What never changes: nothing is submitted until you have read it and approved it.',
      ],
      line: 'Lexli prepares. You decide.',
    },
    finalCta: {
      headline: 'Prepared by the platform. Filed by you.',
      subhead:
        'Bring a case onto Lexli and see the packet assemble, or talk to us about your filing workflow.',
    },
  },
];

export function getTool(slug: string): ToolPage | undefined {
  return tools.find((tool) => tool.slug === slug);
}
