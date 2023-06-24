import { ButtonHTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export type ButtonMode =
  | 'primarySolid'
  | 'primaryOutline'
  | 'primaryOutlineFull'
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
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export type IconSize = 'extraTiny' | 'tiny';

export interface ButtonProps extends CommonButtonProps {
  mode?: ButtonMode;
  size?: ButtonSize;
  isFullSize?: boolean;
  isFullRounded?: boolean;
  iconName?: string;
  iconSize?: IconSize;
  isIconRight?: boolean;
  className?: string;
}

export interface TextButtonProps extends CommonButtonProps {
  mode?: TextButtonMode;
}

export interface PendingButtonProps extends CommonButtonProps {
  isPending?: boolean;
}

export interface HamburgerProps extends CommonButtonProps {
  iconName?: string;
  iconSize?: IconSize;
  isOpened?: boolean;
}
