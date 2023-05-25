import { MessageDescriptor } from 'react-intl';

export interface ExtensionItemProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  version: number;
  icon: string;
  extensionId: string;
}
