import { MessageDescriptor } from 'react-intl';
import { AnyExtensionData } from '~types';

export interface ActionButtonProps {
  extensionData: AnyExtensionData;
  extensionStatusMode?: 'governance' | 'payments' | undefined;
  extensionStatusText?: MessageDescriptor | string;
}

export interface ActiveInstallsProps {
  activeInstalls: number;
}

export interface HeadingIconProps {
  icon: string;
  name: string | MessageDescriptor;
}
