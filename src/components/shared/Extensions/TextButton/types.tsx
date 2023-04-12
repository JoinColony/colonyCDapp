import { ButtonHTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export interface TextButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  loading?: boolean;
  title?: MessageDescriptor | string;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
}
