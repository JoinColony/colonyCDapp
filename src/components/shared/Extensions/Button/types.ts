import { ButtonHTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export type ButtonMode =
  | 'primarySolid'
  | 'primaryOutline'
  | 'secondarySolid'
  | 'tertiaryOutline'
  | 'quaternaryOutline'
  | 'textButton'
  | 'pending';

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
  isPending?: boolean;
  isFullRounded?: boolean;
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}
