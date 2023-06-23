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
  | 'dedicatedFilled'
  | 'active'
  | 'activeFilled'
  | 'new'
  | 'activeNew'
  | 'top'
  | 'topFilled'
  | 'banned'
  | 'team';

export type IconSize = 'extraTiny' | 'tiny';

export type PillSize = 'medium' | 'small';

export type PillsProps = {
  mode?: ExtensionStatusBadgeMode | PillMode;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  iconName?: string;
  iconSize?: IconSize;
  pillSize?: PillSize;
  className?: string;
};
