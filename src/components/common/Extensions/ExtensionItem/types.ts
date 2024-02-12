import { type Icon } from '@phosphor-icons/react';
import { type MessageDescriptor } from 'react-intl';

export interface ExtensionItemProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  version: number;
  icon: Icon;
  extensionId: string;
}
