import type { ReactNode } from 'react';
import { createElement } from 'react';
import { CalendarShowcase } from './lexli/CalendarShowcase';
import { DraftingShowcase } from './lexli/DraftingShowcase';
import { TranslationShowcase } from './lexli/TranslationShowcase';
import { AssistantShowcase } from './lexli/AssistantShowcase';
import { CaseFinderShowcase } from './lexli/CaseFinderShowcase';
import { ScannerShowcase } from './lexli/ScannerShowcase';
import { EfilingShowcase } from './lexli/EfilingShowcase';
import { DocumentIntelligenceShowcase } from './lexli/DocumentIntelligenceShowcase';
import { AdvancedSearchShowcase } from './lexli/AdvancedSearchShowcase';
import { CaseRecordShowcase } from './lexli/CaseRecordShowcase';

export { ShowcaseFrame } from './ShowcaseFrame';
export { AnimatedItem } from './AnimatedItem';
export {
  CalendarShowcase,
  DraftingShowcase,
  TranslationShowcase,
  AssistantShowcase,
  CaseFinderShowcase,
  ScannerShowcase,
  EfilingShowcase,
  DocumentIntelligenceShowcase,
  AdvancedSearchShowcase,
  CaseRecordShowcase,
};

/** Hero visual per tool — every tool page now carries one. */
export function getToolVisual(slug: string): ReactNode | undefined {
  switch (slug) {
    case 'calendar':
      return createElement(CalendarShowcase);
    case 'case-status':
      return createElement(CaseFinderShowcase);
    case 'legal-translator':
      return createElement(TranslationShowcase);
    case 'document-scanner':
      return createElement(ScannerShowcase);
    case 'drafting':
      return createElement(DraftingShowcase);
    case 'efiling-assembly':
      return createElement(EfilingShowcase);
    default:
      return undefined;
  }
}
