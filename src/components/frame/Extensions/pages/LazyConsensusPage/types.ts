import { ExtensionStatusBadgeMode } from '~common/Extensions/ExtensionStatusBadge/types';
import { AccordionContent } from '~shared/Extensions/Accordion/types';
import { AnyExtensionData } from '~types';

export interface LazyConsensusPageProps {
  loading: boolean;
  extensionData: AnyExtensionData;
  status?: ExtensionStatusBadgeMode;
  badgeMessage: string;
  accordionContent: AccordionContent[];
}
