import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

type ExtensionStatusBadgeMode =
  | 'comingSoon'
  | 'notInstalled'
  | 'enabled'
  | 'disabled'
  | 'deprecated'
  | 'governance'
  | 'new';

export interface ExtensionStatusBadgeProps {
  mode?: ExtensionStatusBadgeMode;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
}
