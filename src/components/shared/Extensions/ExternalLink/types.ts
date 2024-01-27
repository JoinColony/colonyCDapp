import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index.ts';

export interface ExternalLinkProps {
  children?: ReactNode;
  href: string;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  className?: string;
  title?: string;
  download?: string | boolean;
}
