import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { StaggerChildren, StaggerItem } from '@/components/animations';
import {
  AdvancedSearchShowcase,
  AssistantShowcase,
  CaseRecordShowcase,
  DocumentIntelligenceShowcase,
} from '@/components/showcases';

/**
 * The homepage's platform summary: the four platform faces that have live
 * showcases, in one bordered bento (two rows on a 6-col grid, hairline
 * internal rules). Copy is condensed from data/platform.ts — the platform
 * page keeps the full argument; this is the trailer.
 */

type BentoCell = {
  title: string;
  description: string;
  visual: ReactNode;
  className: string;
};

const CELLS: BentoCell[] = [
  {
    title: 'Every case, one living record',
    description:
      'Parties, acts, hearing history, orders, files, and your conversations, organised by case, the way a practice is organised. Everything else works on top of this record.',
    visual: <CaseRecordShowcase />,
    className: 'col-span-1 lg:col-span-4 border-b lg:border-r',
  },
  {
    title: 'One assistant that can use every tool',
    description:
      'Ask about a case and it answers from that case’s actual files. Ask for a draft or a translation and it runs the right tool inside the same conversation.',
    visual: <AssistantShowcase />,
    className: 'col-span-1 lg:col-span-2 border-b',
  },
  {
    title: 'Reads documents as they actually arrive',
    description:
      'Scanned annexures, stamped pages, tables inside affidavits: read and turned into clean, structured data. It is the layer the board, the drafts, and the filing packets stand on.',
    visual: <DocumentIntelligenceShowcase />,
    className: 'col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r',
  },
  {
    title: 'Ask for anything, in plain language',
    description:
      '“The order where costs were imposed.” “Files from the March hearing.” Found across cases, orders, and the statements inside files.',
    visual: <AdvancedSearchShowcase />,
    className: 'col-span-1 lg:col-span-3',
  },
];

function BentoRow({ cells }: { cells: BentoCell[] }) {
  return (
    <StaggerChildren className="grid grid-cols-1 lg:grid-cols-6" stagger={0.15}>
      {cells.map((cell) => (
        <StaggerItem key={cell.title} className={cn('h-full', cell.className)}>
          <div className="relative flex h-full flex-col overflow-hidden bg-card p-4 sm:p-8">
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-tight text-left">
              {cell.title}
            </h3>
            <p className="my-2 text-sm md:text-base text-left text-muted-foreground">
              {cell.description}
            </p>
            <div className="mt-4 w-full overflow-hidden">{cell.visual}</div>
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}

export function PlatformBento() {
  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-xl">
      <BentoRow cells={CELLS.slice(0, 2)} />
      <BentoRow cells={CELLS.slice(2, 4)} />
    </div>
  );
}
