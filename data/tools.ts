/**
 * Tool page copy. Source: `content/tools/*.md` (voice-calibrated drafts).
 *
 * Where a draft carried an unresolved [VERIFY] flag, the narrower claim ships —
 * see the `// conservative:` comments. Widen these only against confirmed
 * product behaviour, not optimism.
 */

import type { ComponentType } from 'react';
import {
  BellRing,
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
  Languages,
  Layers,
  LayoutTemplate,
  Link2,
  ListFilter,
  ListOrdered,
  MessagesSquare,
  Radio,
  ScrollText,
  Search,
  Smartphone,
  Table2,
  Upload,
  UserRound,
  Zap,
} from 'lucide-react';
import { byMode } from '@/lib/site';

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
    slug: 'calendar',
    name: 'Calendar',
    kind: 'front-door',
    eyebrow: 'Calendar · A Lexli tool',
    // Source: the team's Calendar page draft (15 Oct 2026). Its alerts,
    // "last called", any-court display board, and "every few seconds" claims
    // are confirmed by the team; export (PDF only), per-tab search, and the
    // queue wording are corrected to the shipped product.
    seo: {
      title: 'Calendar - your hearings, the cause list, and the live board',
      description:
        "Every case you have before the court on a given day, from the official cause list, with the court's display board followed live.",
    },
    hero: {
      headline: 'Which case. Which court. When to walk in.',
      subhead:
        "Lexli puts your cases on their court dates, reads the cause list for every advocate in your office, and follows the court's display board through the day. You are told when your item is near.",
    },
    steps: [
      {
        title: 'Add your names and courts',
        description:
          'One advocate or the whole office, and every court any of you appears in. Saved cases land on their dates.',
        image: '/tools/steps/daily_board_01.png',
      },
      {
        title: 'Pick a day',
        description:
          'The week strip counts what is listed each day. Open a date and your own cases come first.',
        image: '/tools/steps/daily_board_03.png',
      },
      {
        title: 'Check against the source',
        description:
          'The cause list is checked every evening, and each entry links to the page of the list it came from.',
        image: '/tools/steps/daily_board_02.png',
      },
      {
        // No illustration fits yet (daily_board_04 is an export) — the
        // numeral vignette stands in until one is made.
        title: 'Follow the court, and get called',
        description:
          'The display board refreshes every few seconds. When your case comes up, Lexli tells you.',
      },
    ],
    features: [
      {
        icon: CalendarDays,
        title: 'Your cases, by court date',
        description:
          'Saved cases are listed on the day they come up, with the stage they are at and when they were last heard.',
      },
      {
        icon: ScrollText,
        title: 'The cause list, for every advocate in the office',
        description:
          'Built from what High Courts, District Courts, and the MAT, CAT, and DRT publish, grouped by court and bench, with counsel, opposing counsel, and purpose on each entry.',
      },
      {
        icon: FileCheck,
        title: 'Checked every evening, linked to the source',
        description:
          'The time of the last check is shown, and each entry points to the page of the published list it came from.',
      },
      {
        icon: Radio,
        title: 'The display board, live',
        description:
          'Wherever a court publishes its display board, Lexli reads it every few seconds: the current item in each courtroom, the items kept back, and when your case was last called.',
      },
      {
        icon: BellRing,
        title: "Told when you're near",
        description:
          'An alert when your item is approaching and when it is called, so the corridor wait stops being a guess.',
      },
      {
        icon: ListOrdered,
        title: 'Where your case stands in the queue',
        // The product's own wording for the board line.
        description: '"Court 3 is on Sr. 26 · 4 before yours."',
      },
      {
        icon: Link2,
        title: 'Connected matters, kept together',
        description:
          'Matters the court lists together stay together, so a connected case is not missed.',
      },
      {
        icon: ListFilter,
        title: 'Sorted the way a practice thinks',
        // Stage names come from the court record, so the list is examples,
        // not an inventory.
        description:
          'Filter by court, down to the individual bench, and by stage as the court records it: hearing and arguments, evidence, reply and pleadings, service of notice.',
      },
      {
        icon: UserRound,
        title: 'Which side you are on',
        description: 'Each case shows who you appear for, read from your name in the record.',
      },
      {
        icon: History,
        title: 'Any day, not just tomorrow',
        description: 'Look back at what was listed, or ahead at the week and the month.',
      },
      {
        icon: FileDown,
        title: 'The day, as a PDF',
        description: 'The cause list, or the case list with orders, ready to print or forward.',
      },
      {
        icon: MessagesSquare,
        title: 'Available through the AI Assistant',
        description: '"What do I have on Thursday" is a question, not a task.',
      },
    ],
    platform: {
      paragraphs: [
        "On its own, the Calendar tells you where to be and when. Inside Lexli, every case on it is a door into its record: files, orders, hearing history, notes from the last date. A listing for a case you don't have yet can be found and saved, with the court record attached, before you reach the courtroom.",
        'Your prep for the day, the cause list, and the courtroom board stop being three different places.',
      ],
      line: 'The calendar knows your cases because the platform already does.',
    },
    finalCta: {
      headline: 'Your next date is already on it.',
      subhead: byMode({
        open: 'Create a free account, add your name, and open the week.',
        waitlist: 'Join the waitlist, and open your week when your access opens.',
      }),
    },
  },

  {
    slug: 'case-status',
    name: 'Case Status',
    kind: 'front-door',
    eyebrow: 'Case Status · A Lexli tool',
    seo: {
      title: "Case Status - check a case's status",
      description:
        'Find a case by case number or advocate name across High Courts, District Courts, and Tribunals, see its status, parties, hearing history, orders and judgements, and keep its record on Lexli.',
    },
    hero: {
      headline: 'Find the case. Keep the record.',
      // conservative: Tribunals means the three the product reads (MAT, CAT,
      // DRT). Supreme Court and CNR/party-name search are still unbuilt —
      // they appear below as scheduled rather than available.
      subhead:
        'Search by case number or advocate name across High Courts, District Courts, and Tribunals, and open the full record: status, parties, acts, orders and judgements, hearing history.',
    },
    steps: [
      {
        title: 'Find the case',
        description:
          'Case number or advocate name, across High Courts, District Courts, and Tribunals, whichever detail you have.',
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
          '"Find the case where…" works. The AI Assistant runs Case Status from inside a conversation.',
        image: '/tools/steps/finder_04.png',
      },
    ],
    features: [
      {
        icon: Search,
        title: 'Search by case number or advocate name',
        description:
          'Across High Courts, District Courts, and Tribunals: MAT, CAT, and DRT.',
      },
      {
        icon: Clock,
        title: 'CNR and party-name search',
        description: 'Scheduled, along with Supreme Court coverage.',
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
        "Checking a case's status answers today's question. Saving it answers the next hundred: the case joins your workspace, your Calendar puts it on its next date, research starts from its record, and every order that follows lands in its file.",
      ],
      line: 'No one should have to find the same case twice.',
    },
    finalCta: {
      headline: 'The case is on record. Get it on yours.',
      subhead: byMode({
        open: 'Create a free account and search.',
        waitlist: 'Join the waitlist, and search the day your access opens.',
      }),
    },
  },

  {
    slug: 'legal-translator',
    name: 'Legal Translator',
    kind: 'front-door',
    eyebrow: 'Legal Translator · A Lexli tool',
    seo: {
      title: 'Legal Translator - judgements in English, Hindi, Marathi',
      description:
        'Upload or scan a legal document and translate it between English, Hindi, and Marathi, reviewed side by side with the original and exported clean as .doc or .pdf.',
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
      subhead: byMode({
        open: 'Create a free account and translate the first one.',
        waitlist: 'Join the waitlist, and translate the first one when your access opens.',
      }),
    },
  },

  {
    slug: 'document-scanner',
    name: 'Document Scanner',
    kind: 'front-door',
    eyebrow: 'Document Scanner · A Lexli tool',
    seo: {
      title: 'Document Scanner - from paper to working file',
      description:
        'Scan from your phone or laptop, digitise the pages into an editable .doc or .pdf, and save it straight to the case.',
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
      subhead: byMode({
        open: 'Create a free account and scan the first page.',
        waitlist: 'Join the waitlist, and scan the first page when your access opens.',
      }),
    },
  },

  {
    slug: 'smart-drafting',
    name: 'Smart Drafting',
    kind: 'inside',
    eyebrow: 'Smart Drafting · A Lexli platform tool',
    seo: {
      title: 'Smart Drafting - the first draft, from the case papers',
      description:
        'Ask for a draft in chat and Lexli writes it from the case papers, opens it as a Word document beside the conversation, and revises it through tracked changes you accept or reject.',
    },
    // Smart Drafting runs through the AI Assistant's chat (the product's /draft
    // command); the standalone drafting screens are not shipped. Everything
    // below describes the chat flow.
    // conservative: no Hindi/Marathi drafting, no legal-dictionary
    // auto-correct, no compare view, and no citations inside chat drafts —
    // none is confirmed in the shipped product.
    hero: {
      headline: 'Drafts that start from the case papers.',
      subhead:
        'Ask in chat for the draft you need. Lexli writes it from the case papers and opens it as a Word document beside the conversation. Ask for changes in plain words; they arrive as tracked changes you accept or reject.',
    },
    steps: [
      {
        title: 'Ask, and it drafts',
        description:
          "Say what you need in chat. The draft is written from the case's files and opens beside the chat.",
        image: '/tools/steps/drafting_01.png',
      },
      {
        title: 'Revise it in conversation',
        description:
          '"Make paragraph 4 firmer." Each change arrives as a tracked suggestion for you to accept or reject.',
        image: '/tools/steps/drafting_02.png',
      },
      {
        title: 'Every version kept',
        description:
          'Original, edited, restored: each saved as its own version, and any one can be brought back.',
        image: '/tools/steps/drafting_03.png',
      },
      {
        title: 'Download it',
        description: 'Take the .docx when it is ready, to finish in the format your court expects.',
        image: '/tools/steps/drafting_04.png',
      },
    ],
    features: [
      {
        icon: FileText,
        title: 'Drafts from the case papers',
        description: "The case's files are the starting point, so the draft begins with what the record says.",
      },
      {
        icon: LayoutTemplate,
        title: 'Templates from your own drafts',
        description:
          'Turn a past filing into a reusable template: the case details blanked, your structure kept.',
      },
      {
        icon: Fingerprint,
        title: 'Your drafting rules, applied',
        description:
          'Save how you draft in Memory. Each draft shows which of your preferences it applied.',
      },
      {
        icon: FilePenLine,
        title: 'Tracked changes, your call',
        description: 'Every edit the assistant proposes stays a suggestion until you accept it.',
      },
      {
        icon: Zap,
        title: 'Auto edits, when you want them',
        description: 'Turn on Auto edits for a chat and changes apply and save without asking.',
      },
      {
        icon: Table2,
        title: 'Tables and formatting',
        description: 'Rows, columns, whole tables, paragraph formatting: asked for in plain words.',
      },
      {
        icon: History,
        title: 'Version history',
        description: 'Original, edited, restored: every version kept, any one restorable.',
      },
      {
        icon: FileDown,
        title: 'Word download',
        description: 'The .docx, ready to finish in the format your court expects.',
      },
    ],
    platform: {
      paragraphs: [
        'Drafting alone saves typing. Smart Drafting inside Lexli saves the part before the typing: the assistant already has the case papers, so the draft starts from them instead of asking for them. If it is headed for a portal, eFiling Assembly takes it from there.',
        'Nothing is filed until you have read it and said yes.',
      ],
      line: 'Lexli prepares. You decide.',
    },
    finalCta: {
      headline: 'The next draft starts from the file.',
      subhead:
        "Bring a case onto Lexli and ask for a draft, or talk to us about your team's templates.",
    },
  },

  {
    slug: 'efiling-assembly',
    name: 'eFiling Assembly',
    kind: 'inside',
    eyebrow: 'eFiling Assembly · A Lexli platform tool',
    seo: {
      title: 'eFiling Assembly - from case file to portal-ready packet',
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
        "eFiling Assembly is where the rest of the platform's work converges. The scan you took in Document Scanner is already prepared. The draft the AI Assistant prepared with you is already in the case file. The party details the eDraft needs were extracted when the case record was built. The packet assembles because the platform has been preparing it since the case arrived.",
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
