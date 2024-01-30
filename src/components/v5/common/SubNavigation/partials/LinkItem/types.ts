import { type ReactNode } from 'react';
import { type MessageDescriptor } from 'react-intl';

export interface LinkItemProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  statusBadge?: ReactNode;
  onClick: () => void;
}
