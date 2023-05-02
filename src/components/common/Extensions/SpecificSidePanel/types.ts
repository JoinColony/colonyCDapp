import React from 'react';
import { ExtensionStatusBadgeMode } from '../ExtensionStatusBadge-new/types';
import { sidePanelData } from './consts';

export interface SpecificSidePanelProps {
  statuses: SpecificSidePanelStatus[];
  sidePanelData: SidePanelDataProps;
}

type SpecificSidePanelStatus = Extract<
  ExtensionStatusBadgeMode,
  'disabled' | 'enabled' | 'not-installed' | 'deprecated'
>;

export interface PermissionsProps {
  data: { id: number; title: string }[];
}

export type SidePanelDataProps = typeof sidePanelData;

export interface PanelTypeProps {
  title: string;
  date?: string;
  component?: React.ReactElement;
  version?: string;
  address?: string;
  developer?: string;
}
