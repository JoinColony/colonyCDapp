import React from 'react';
import { MessageDescriptor } from 'react-intl';
import { ExtensionStatusBadgeMode } from '~common/Extensions/ExtensionStatusBadge/types';
import { sidePanelData } from './consts';

export interface SpecificSidePanelProps {
  statuses: SpecificSidePanelStatus | SpecificSidePanelStatus[];
  sidePanelData: SidePanelDataProps;
}

type SpecificSidePanelStatus = ExtensionStatusBadgeMode;

export interface PermissionsProps {
  data: { key: string; name: string; text: string; description: string }[];
}

export type SidePanelData = typeof sidePanelData;

export interface SidePanelDataProps extends Omit<SidePanelData, 'permissions'> {
  permissions: {
    title: string;
    permissions: {
      key: string;
      text: MessageDescriptor | string;
      description: MessageDescriptor | string;
      name: string;
    }[];
  };
}

export interface PanelTypeProps {
  title: string;
  date?: string;
  component?: React.ReactElement;
  version?: string;
  address?: string;
  developer?: string;
}
