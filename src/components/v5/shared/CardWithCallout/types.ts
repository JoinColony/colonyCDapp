import type { ReactNode } from 'react';
import type { MessageDescriptor } from 'react-intl';

export interface CardWithCalloutProps {
  button?: ReactNode;
  iconName?: string;
  title: MessageDescriptor;
  subtitle?: MessageDescriptor;
}
