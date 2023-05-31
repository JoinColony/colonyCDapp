import React from 'react';
import { MessageDescriptor } from 'react-intl';
import { ExtensionStatusBadgeMode } from '~common/Extensions/ExtensionStatusBadge/types';

export interface SpecificSidePanelProps {
  statuses: SpecificSidePanelStatus | SpecificSidePanelStatus[];
  sidePanelData: SidePanelDataProps[];
}

type SpecificSidePanelStatus = ExtensionStatusBadgeMode;

export interface PermissionsProps {
  data: { key: string; name: string; text: MessageDescriptor | string; description: MessageDescriptor | string }[];
}

export type SidePanelDataProps = {
  id: number;
  statusType: {
    title: string;
  };
  dateInstalled: {
    title: string;
    date: string;
  };
  installedBy: {
    title: string;
    component: JSX.Element;
  };
  versionInstalled: {
    title: string;
    version: string;
  };
  contractAddress: {
    title: string;
    address: string;
  };
  developer: {
    title: string;
    developer: string;
  };
  permissions: {
    title: string;
    permissions: {
      key: string;
      text: MessageDescriptor | string;
      description: MessageDescriptor | string;
      name: string;
    }[];
  };
};

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
