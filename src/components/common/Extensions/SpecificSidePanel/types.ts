import { ExtensionStatusBadgeMode } from '../ExtensionStatusBadge-new/types';
import { sidepanelData } from './consts';

export interface SpecificSidePanelProps {
  types: SpecificSidePanelType[];
  sidepanelData: SidepanelDataProps;
}

type SpecificSidePanelType = Extract<ExtensionStatusBadgeMode, 'disabled' | 'enabled' | 'not-installed' | 'deprecated'>;

export interface PermissionsProps {
  data: { id: number; title: string }[];
}

export type SidepanelDataProps = typeof sidepanelData;
