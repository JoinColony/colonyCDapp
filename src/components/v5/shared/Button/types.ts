import React, { ButtonHTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';
import { ActionTypes } from '~redux';
import { SimpleMessageValues } from '~types';
import { ActionTransformFnType } from '~utils/actions';

export type ButtonMode =
  | 'primarySolid'
  | 'primaryOutline'
  | 'primaryOutlineFull'
  | 'secondarySolid'
  | 'secondaryOutline'
  | 'tertiary'
  | 'quaternary'
  | 'quinary'
  | 'senary'
  | 'septenary'
  | 'completed';

export type ButtonSize = 'default' | 'extraSmall' | 'small' | 'large';

export type TextButtonMode = 'default' | 'medium' | 'underlined';

export interface CommonButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'title' | 'aria-label'
  > {
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
  loading?: boolean;
  title?: MessageDescriptor | string;
  ariaLabel?: MessageDescriptor | string;
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export type IconSize = 'extraTiny' | 'tiny' | 'small' | 'extraSmall';

export interface ButtonProps extends CommonButtonProps {
  mode?: ButtonMode;
  size?: ButtonSize;
  isFullSize?: boolean;
  isFullRounded?: boolean;
  iconName?: string;
  iconSize?: IconSize;
  isIconRight?: boolean;
  className?: string;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
}

export interface TextButtonProps extends CommonButtonProps {
  mode?: TextButtonMode;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  isErrorColor?: boolean;
  iconName?: string;
  iconSize?: IconSize;
}

export interface IconButtonProps extends CommonButtonProps {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  rounded?: 's' | 'm' | 'l';
  isFullSize?: boolean;
  icon: React.ReactNode;
  className?: string;
}

export interface HamburgerProps extends CommonButtonProps {
  iconName?: string;
  iconSize?: IconSize;
  isOpened?: boolean;
}

export interface CloseButtonProps extends CommonButtonProps {
  iconSize?: IconSize;
  className?: string;
}

export interface ActionButtonProps extends ButtonProps {
  actionType: ActionTypes;
  isLoading?: boolean;
  confirmText?: any;
  error?: string;
  onConfirmToggled?: (...args: any[]) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  submit?: string;
  success?: string;
  text?: MessageDescriptor | string;
  transform?: ActionTransformFnType;
  values?: any;
}
