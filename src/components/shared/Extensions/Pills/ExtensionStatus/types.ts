import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

type ExtensionStatusMode =
  | 'comingSoon'
  | 'notInstalled'
  | 'enabled'
  | 'disabled'
  | 'deprecated'
  | 'governance'
  | 'new';

export interface ExtensionStatusProps {
  mode?: ExtensionStatusMode;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
}
