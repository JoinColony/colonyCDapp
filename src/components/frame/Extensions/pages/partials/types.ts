import { type Icon } from '@phosphor-icons/react';
import { type MessageDescriptor } from 'react-intl';

import { type AnyExtensionData } from '~types/extensions.ts';
import { type ExtensionStatusBadgeMode } from '~v5/common/Pills/types.ts';

export interface ActionButtonProps {
  extensionData: AnyExtensionData;
  isSetupRoute: boolean;
  waitingForEnableConfirmation: boolean;
  extensionStatusMode?: ExtensionStatusBadgeMode;
  extensionStatusText?: React.ReactNode;
  onActiveTabChange: (activeTab: number) => void;
}

export interface ActiveInstallsProps {
  activeInstalls: number;
}

export interface HeadingIconProps {
  icon: Icon;
  name: string | MessageDescriptor;
}
