import { MessageDescriptor } from 'react-intl';
import { AnyExtensionData } from '~types';

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
  address?: string;
  date?: string;
  developer?: string;
  version?: string;
  extensionData?: AnyExtensionData;
}

export interface SpecificSidePanelProps {
  extensionData: AnyExtensionData;
}

export interface SpecificSidePanelStoryProps {
  statuses: string[];
  sidePanelData: SidePanelDataProps;
}
