import { type MessageDescriptor } from 'react-intl';
import { type NavLinkProps as ReactNavLinkProps } from 'react-router-dom';

import { type SimpleMessageValues } from '~types/index.ts';

export interface NavLinkProps extends Omit<ReactNavLinkProps, 'title'> {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  title?: MessageDescriptor | string;
  titleValues?: SimpleMessageValues;
  className?: string;
}
