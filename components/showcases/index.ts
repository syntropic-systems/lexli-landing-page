import type { ReactNode } from 'react';
import { createElement } from 'react';
import { DailyBoardShowcase } from './lexli/DailyBoardShowcase';
import { TranslationShowcase } from './lexli/TranslationShowcase';
import { DraftingShowcase } from './lexli/DraftingShowcase';
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
  DailyBoardShowcase,
  TranslationShowcase,
  DraftingShowcase,
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
    case 'daily-board':
      return createElement(DailyBoardShowcase);
    case 'case-finder':
      return createElement(CaseFinderShowcase);
    case 'legal-translator':
      return createElement(TranslationShowcase);
    case 'document-scanner':
      return createElement(ScannerShowcase);
    case 'drafting':
      return createElement(DraftingShowcase);
    case 'efiling-support':
      return createElement(EfilingShowcase);
    default:
      return undefined;
  }
}
