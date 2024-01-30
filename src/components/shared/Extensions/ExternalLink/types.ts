import { type ReactNode } from 'react';
import { type MessageDescriptor } from 'react-intl';

import { type SimpleMessageValues } from '~types/index.ts';

export interface ExternalLinkProps {
  children?: ReactNode;
  href: string;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  className?: string;
  title?: string;
  download?: string | boolean;
}
