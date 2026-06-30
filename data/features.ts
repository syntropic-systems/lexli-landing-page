import type { ComponentType } from "react";
import { FolderKanban, MessagesSquare, Languages, ScanLine } from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

/**
 * "What you can do today" — current, shipped capabilities.
 * Source: docs/personal/lexli-overview.md. Only verified, non-speculative
 * claims are included here (no metrics, security badges, or testimonials).
 */
export const features: Feature[] = [
  {
    title: "Case Management",
    description:
      "Keep every matter organized in one place. Each case holds its own documents, files, and history — so the whole team works from the same, up-to-date record.",
    icon: FolderKanban,
  },
  {
    title: "AI Case Assistant",
    description:
      "Ask anything about a case in plain language and get a direct answer drawn from your own case files — complete with citations that point back to the exact source.",
    icon: MessagesSquare,
  },
  {
    title: "AI Legal Translation",
    description:
      "Upload a legal PDF and translate it into Marathi, Hindi, or English, then download a clean, formatted DOCX and PDF — built so structure and meaning are preserved.",
    icon: Languages,
  },
  {
    title: "Document Scanner",
    description:
      "Turn physical documents into clean, court-ready digital files from your phone. Capture multiple pages with edge detection and combine them into a single searchable PDF, saved straight to the case.",
    icon: ScanLine,
  },
];
