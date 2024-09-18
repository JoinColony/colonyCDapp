import { type Icon } from '@phosphor-icons/react';
import { type MessageDescriptor } from 'react-intl';

export interface HeadingIconProps {
  icon: Icon;
  name: string | MessageDescriptor;
}

export interface ActiveInstallsProps {
  activeInstalls: number;
}
