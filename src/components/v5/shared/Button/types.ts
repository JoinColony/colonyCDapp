import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { ActionTypes } from '~redux';
import { SimpleMessageValues } from '~types';
import { ActionTransformFnType } from '~utils/actions';
import { LinkProps } from '../Link/types';

export type ButtonMode =
  | 'primarySolid'
  | 'primarySolidFull'
  | 'primaryOutline'
  | 'primaryOutlineFull'
  | 'secondarySolid'
  | 'secondaryOutline'
  | 'tertiary'
  | 'quaternary'
  | 'quinary'
  | 'senary'
  | 'septenary'
  | 'completed'
  | 'filled'
  | 'notFilled';

export type ButtonSize = 'default' | 'extraSmall' | 'small' | 'large';

export type TextButtonMode = 'default' | 'medium' | 'underlined';

export interface ButtonContentProps {
  iconName?: ReactNode;
  iconSize?: IconSize;
  mode?: ButtonMode;
  isIconRight?: boolean;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
}

export interface CommonButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'title' | 'aria-label'
  > {
  loading?: boolean;
  title?: MessageDescriptor | string;
  ariaLabel?: MessageDescriptor | string;
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export interface ButtonAppearanceCommonProps extends ButtonContentProps {
  size?: ButtonSize;
  isFullSize?: boolean;
  isFullRounded?: boolean;
  className?: string;
}

export type IconSize = 'extraTiny' | 'tiny' | 'small' | 'extraSmall';

export type ButtonProps = Omit<CommonButtonProps, 'setTriggerRef'> &
  ButtonAppearanceCommonProps;

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
  error?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  submit?: string;
  success?: string;
  text?: MessageDescriptor | string;
  transform?: ActionTransformFnType;
  values?: any;
}

export type ButtonLinkProps = Omit<
  LinkProps,
  'text' | 'textValues' | 'className'
> &
  ButtonAppearanceCommonProps &
  Pick<CommonButtonProps, 'loading' | 'disabled'>;
