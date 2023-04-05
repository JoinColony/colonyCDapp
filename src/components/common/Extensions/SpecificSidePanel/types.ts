import { MessageDescriptor } from 'react-intl';

import { AnyExtensionData } from '~types';
import { ColonyReputationItem } from '~v5/shared/UserAvatarPopover/types';

export interface PermissionsProps {
  data: {
    key: string;
    name: string;
    text: MessageDescriptor | string;
    description: MessageDescriptor | string;
  }[];
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
    component: JSX.Element;
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

export interface SpecificSidePanelHookProps {
  colonyReputationItems: ColonyReputationItem[];
}
