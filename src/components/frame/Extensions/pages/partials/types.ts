import { MessageDescriptor } from 'react-intl';
import { ExtensionStatusBadgeMode } from '~common/Extensions/ExtensionStatusBadge/types';

import { AnyExtensionData } from '~types';

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
