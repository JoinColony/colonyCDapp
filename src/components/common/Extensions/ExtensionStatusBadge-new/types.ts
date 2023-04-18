import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

type ExtensionStatusBadgeMode =
  | 'Coming soon'
  | 'Not installed'
  | 'Enabled'
  | 'Disabled'
  | 'Deprecated'
  | 'Governance'
  | 'New';

export interface ExtensionStatusBadgeProps {
  mode?: ExtensionStatusBadgeMode;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
}
