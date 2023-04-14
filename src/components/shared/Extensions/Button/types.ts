import { ButtonHTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export type ButtonMode = 'primarySolid' | 'primaryOutline' | 'textButton';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  mode?: ButtonMode;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  loading?: boolean;
  title?: MessageDescriptor | string;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
}
