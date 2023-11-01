import { MessageDescriptor } from 'react-intl';
import { AnyExtensionData } from '~types';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';

export interface ActionButtonProps {
  extensionData: AnyExtensionData;
  isSetupRoute: boolean;
  waitingForEnableConfirmation: boolean;
  extensionStatusMode?: ExtensionStatusBadgeMode;
  extensionStatusText?: React.ReactNode;
}

export interface ActiveInstallsProps {
  activeInstalls: number;
}

export interface HeadingIconProps {
  icon: string;
  name: string | MessageDescriptor;
}
