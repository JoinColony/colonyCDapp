import { ColonyRole } from '@colony/colony-js';
import { ReactNode } from 'react';

import { AnyExtensionData } from '~types';

export interface PermissionsProps {
  roles: ColonyRole[];
}

export type SidePanelDataProps = {
  id: number;
  statusType: {
    title: string;
  };
  dateInstalled: {
    title: string;
    date: string | null;
  };
  dateCreated: {
    title: string;
    date: string | null;
  };
  installedBy: {
    title: string;
    component: ReactNode;
  };
  versionInstalled: {
    title: string;
    version: string;
  };
  latestVersion: {
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
  permissions: ColonyRole[];
};

export interface PanelTypeProps {
  title: string;
  description?: string;
  extensionData?: AnyExtensionData;
}

export interface SpecificSidePanelProps {
  extensionData: AnyExtensionData;
}

export interface SpecificSidePanelStoryProps {
  statuses: string[];
  sidePanelData: SidePanelDataProps;
}
