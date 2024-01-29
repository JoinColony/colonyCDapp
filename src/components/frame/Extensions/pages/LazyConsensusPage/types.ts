import { type AccordionContent } from '~shared/Extensions/Accordion/types.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { type ExtensionStatusBadgeMode } from '~v5/common/Pills/types.ts';

export interface LazyConsensusPageProps {
  loading: boolean;
  extensionData: AnyExtensionData;
  status?: ExtensionStatusBadgeMode;
  badgeMessage: string;
  accordionContent: AccordionContent[];
}

export interface ActionButtonsProps {
  extensionData: AnyExtensionData;
}
