import { ButtonHTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export type ButtonMode =
  | 'primarySolid'
  | 'primaryOutline'
  | 'secondarySolid'
  | 'secondaryOutline'
  | 'tertiaryOutline'
  | 'textButton';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'aria-label'> {
  mode?: ButtonMode;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  loading?: boolean;
  title?: MessageDescriptor | string;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  ariaLabel?: MessageDescriptor | string;
  isFullSize?: boolean;
  isFullRounded?: boolean;
}
