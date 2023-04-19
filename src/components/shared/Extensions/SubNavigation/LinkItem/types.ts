import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

export interface LinkItemProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  statusBadge?: ReactNode;
}
