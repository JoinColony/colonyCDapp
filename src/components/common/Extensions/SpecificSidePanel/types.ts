import React from 'react';
import { ExtensionStatusBadgeMode } from '../ExtensionStatusBadge-new/types';
// import { sidePanelData } from './consts';

// interface SidePanelDataProps {
//   installedAt: number;
//   availableVersion: number;
//   address: string;
// }

export interface SpecificSidePanelProps {
  statuses?: SpecificSidePanelStatus[];
  sidePanelData: any;
  permissions: any;
  status?: ExtensionStatusBadgeMode;
  badgeMessage: string;
}

type SpecificSidePanelStatus = Extract<
  ExtensionStatusBadgeMode,
  'disabled' | 'enabled' | 'not-installed' | 'deprecated'
>;

export interface PermissionsProps {
  data: { key: string; name: string; text: string; description: string }[];
}

// export type SidePanelDataProps = typeof sidePanelData;

export interface PanelTypeProps {
  title: string;
  date?: number;
  component?: React.ReactElement;
  version?: string;
  address?: string;
  developer?: string;
  installedBy?: string;
  installedAt?: number;
  addressWallet?: string;
  isVerified?: boolean;
  availableVersion?: number;
  copyUrl?: string;
  aboutDescription?: string;
  colonyReputationItems?: any;
  permissionsItems?: any;
}
