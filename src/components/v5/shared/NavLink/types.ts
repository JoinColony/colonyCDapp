import { MessageDescriptor } from 'react-intl';
import { NavLinkProps as ReactNavLinkProps } from 'react-router-dom';

import { SimpleMessageValues } from '~types';

export interface NavLinkProps extends Omit<ReactNavLinkProps, 'title'> {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  title?: MessageDescriptor | string;
  titleValues?: SimpleMessageValues;
  className?: string;
}
