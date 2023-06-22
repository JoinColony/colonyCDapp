import { ButtonHTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export type ButtonMode =
  | 'primarySolid'
  | 'primaryOutline'
  | 'primaryOutlineFulled'
  | 'secondarySolid'
  | 'secondaryOutline'
  | 'tertiary'
  | 'quinary'
  | 'textButton'
  | 'textButtonUnderlined'
  | 'pending'
  | 'completed';

export type ButtonSize = 'default' | 'small';

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'title' | 'aria-label'
  > {
  mode?: ButtonMode;
  size?: ButtonSize;
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
  iconName?: string;
  iconSize?: 'extraTiny' | 'tiny';
  isIconRight?: boolean;
}
