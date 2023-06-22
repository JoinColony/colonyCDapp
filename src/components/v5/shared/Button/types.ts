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
  | 'completed';

export type ButtonSize = 'default' | 'small';

export type TextButtonMode = 'defalt' | 'underlined';

export interface CommonButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'title' | 'aria-label'
  > {
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  loading?: boolean;
  title?: MessageDescriptor | string;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  ariaLabel?: MessageDescriptor | string;
  className?: string;
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}
export interface ButtonProps extends CommonButtonProps {
  mode?: ButtonMode;
  size?: ButtonSize;
  isFullSize?: boolean;
  isFullRounded?: boolean;
  iconName?: string;
  iconSize?: 'extraTiny' | 'tiny';
  isIconRight?: boolean;
}

export interface TextButtonProps extends CommonButtonProps {
  mode?: TextButtonMode;
}

export interface PendingButtonProps extends CommonButtonProps {
  isPending?: boolean;
}
