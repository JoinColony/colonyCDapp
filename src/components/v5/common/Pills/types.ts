import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export type ExtensionStatusBadgeMode =
  | 'coming-soon'
  | 'not-installed'
  | 'enabled'
  | 'disabled'
  | 'deprecated'
  | 'governance'
  | 'new'
  | 'staking'
  | 'finalizable'
  | 'claimed'
  | 'payments';

export type PillMode =
  | 'dedicated'
  | 'dedicated-filled'
  | 'active'
  | 'active-filled'
  | 'new'
  | 'active-new'
  | 'top'
  | 'top-filled'
  | 'banned'
  | 'team';

export type IconSize = 'extraTiny' | 'tiny';

export type PillSize = 'medium' | 'small';

export type PillsProps = {
  mode?: PillMode;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  iconName?: string;
  iconSize?: IconSize;
  pillSize?: PillSize;
  className?: string;
};

export type ExtensionStatusBadgeProps = Omit<PillsProps, 'mode'> & {
  mode?: ExtensionStatusBadgeMode;
};
