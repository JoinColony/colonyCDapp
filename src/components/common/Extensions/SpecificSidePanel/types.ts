import React from 'react';
import { ExtensionStatusBadgeMode } from '../ExtensionStatusBadge-new/types';
import { sidePanelData } from './consts';

export interface SpecificSidePanelProps {
  statuses: SpecificSidePanelStatus | SpecificSidePanelStatus[];
  sidePanelData: SidePanelDataProps;
}

type SpecificSidePanelStatus = ExtensionStatusBadgeMode;

export interface PermissionsProps {
  data: { key: string; name: string; text: string; description: string }[];
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
