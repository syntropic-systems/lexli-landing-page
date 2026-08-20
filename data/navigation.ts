/**
 * The site's information architecture, in one place.
 *
 * Both the header dropdowns and the footer sitemap read from here, so a new
 * page is added once. Pricing and the legal pages are deliberately absent —
 * pricing is undefined and the legal text awaits counsel, and a nav link to a
 * page that does not exist is worse than no link.
 */

import {
  Building2,
  CalendarClock,
  ClipboardList,
  FileUp,
  Landmark,
  Languages,
  PenLine,
  ScanLine,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export type NavLink = {
  label: string;
  /** May carry a hash (`/platform#security`) — the header handles the scroll. */
  href: string;
  description?: string;
  /** Tools and solutions carry their glyph here — the single source for nav, hub, and grids. */
  icon?: LucideIcon;
};

/** Platform page sections, in page order. Doubles as the Platform dropdown.
 * Accounts and profiles lives on /solutions#accounts, not here. */
export const platformSections: NavLink[] = [
  { label: "Case management", href: "/platform#case-management" },
  { label: "AI Assistant", href: "/platform#ai-assistant" },
  { label: "Document intelligence", href: "/platform#document-intelligence" },
  { label: "Legal research", href: "/platform#legal-research" },
  { label: "Advanced search", href: "/platform#advanced-search" },
  { label: "Security", href: "/platform#security" },
  { label: "Integrations", href: "/platform#integrations" },
];

/**
 * All six tools, in the order the settled "IA — Website" sitemap lists them:
 * the deepest platform work first, the citizen-grade front doors last.
 *
 * Presented as one list, not split by tier. The free/paid distinction still
 * exists — it drives each tool page's eyebrow and CTA through `kind` in
 * `data/tools.ts` — but it is no longer a grouping the reader is shown, because
 * the free-tier scope that would justify the split is undefined.
 */
export const allTools: NavLink[] = [
  {
    label: "eFiling Support",
    icon: FileUp,
    href: "/tools/efiling-support",
    description: "The packet assembled, indexed, and reviewed by you before it goes.",
  },
  {
    label: "Drafting",
    icon: PenLine,
    href: "/tools/drafting",
    description: "Drafts arrive with the case details already in them.",
  },
  {
    label: "Daily Board",
    icon: CalendarClock,
    href: "/tools/daily-board",
    description: "Tomorrow's board, built from the cause lists courts publish.",
  },
  {
    label: "Legal Translator",
    icon: Languages,
    href: "/tools/legal-translator",
    description: "Judgements and documents between English, Hindi, and Marathi.",
  },
  {
    label: "Document Scanner",
    icon: ScanLine,
    href: "/tools/document-scanner",
    description: "A phone photo becomes a working file, saved to its case.",
  },
  {
    label: "Case Finder",
    icon: Landmark,
    href: "/tools/case-finder",
    description: "Any case, by number or advocate name. Found once, kept for good.",
  },
];

/** Company group — the About page's own sections in page order, plus the
 * standalone pages. Section labels echo their on-page eyebrows. */
export const companyLinks: NavLink[] = [
  { label: 'About Lexli', href: '/company' },
  { label: 'Why we exist', href: '/company#why' },
  { label: 'Vision and mission', href: '/company#vision' },
  { label: 'Why now', href: '/company#why-now' },
  { label: 'Where Lexli stops', href: '/company#commitments' },
  { label: 'The team', href: '/company#team' },
  { label: 'Contact', href: '/contact' },
];

export const solutions: NavLink[] = [
  {
    label: "Advocates & lawyers",
    href: "/solutions/advocates",
    description: "For a litigation practice you run yourself.",
    icon: UserRound,
  },
  {
    label: "Clerks & legal staff",
    href: "/solutions/clerks-legal-staff",
    description: "The people who keep a practice moving, on the same record.",
    icon: ClipboardList,
  },
  {
    label: "Law firms & businesses",
    href: "/solutions/law-firms-businesses",
    description: "One record for the whole team, under your admin control.",
    icon: Building2,
  },
];
