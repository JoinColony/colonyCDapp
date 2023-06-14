import { MessageDescriptor } from 'react-intl';
import { AnyExtensionData } from '~types';

export interface ActionButtonProps {
  extensionData: AnyExtensionData;
}

export interface ActiveInstallsProps {
  activeInstalls: number;
}

export interface HeadingIconProps {
  icon: string;
  name: string | MessageDescriptor;
}
