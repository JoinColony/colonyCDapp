import { MessageDescriptor } from 'react-intl';
import { AnyExtensionData } from '~types';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';

export interface ActionButtonProps {
  extensionData: AnyExtensionData;
  extensionStatusMode?: ExtensionStatusBadgeMode;
  extensionStatusText?: MessageDescriptor | string;
}

export interface ActiveInstallsProps {
  activeInstalls: number;
}

export interface HeadingIconProps {
  icon: string;
  name: string | MessageDescriptor;
}
