import { createElement } from 'react';
import {
  BookOpenText,
  FolderKanban,
  MessagesSquare,
  Shield,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { allTools } from '@/data/navigation';
import { ScrollLink } from '@/components/scroll-link';

/**
 * Tool glyphs come from the nav's single icon source. Platform-section links
 * aren't tools, so they carry the glyphs those sections use elsewhere:
 * FolderKanban for the case record, MessagesSquare for the AI Assistant.
 */
function routingIcon(href: string): LucideIcon {
  const tool = allTools.find((t) => t.href === href);
  if (tool?.icon) return tool.icon;
  if (href.startsWith('/platform#case-management')) return FolderKanban;
  if (href.startsWith('/platform#legal-research')) return BookOpenText;
  if (href.startsWith('/platform#accounts')) return Users;
  if (href.startsWith('/platform#security')) return Shield;
  if (href.startsWith('/platform')) return MessagesSquare;
  return Wrench;
}

/** One node-tile pill — the wayfinding strips' shared unit (solutions, home). */
export function RoutingPill({ link }: { link: { label: string; href: string; free?: boolean } }) {
  return (
    <ScrollLink
      href={link.href}
      className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-md"
    >
      {/* createElement, not `const Icon = …; <Icon/>`: the lookup returns
          stable module-level components, but the static-components lint rule
          can't see that through a local capital-case binding. */}
      {createElement(routingIcon(link.href), { className: 'h-4 w-4 text-primary' })}
      {link.label}
      {link.free && (
        // The tools index's "Free on Lexli" badge, sized down to ride
        // inside a pill.
        <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
          Free
        </span>
      )}
    </ScrollLink>
  );
}
