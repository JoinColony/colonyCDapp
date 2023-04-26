import React from 'react';
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

export interface PanelTypeProps {
  title: string;
  date?: string;
  component?: React.ReactElement;
  version?: string;
  address?: string;
  developer?: string;
}
