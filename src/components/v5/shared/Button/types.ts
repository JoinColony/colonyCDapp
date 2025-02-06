import { type Icon } from '@phosphor-icons/react';
import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { type MessageDescriptor } from 'react-intl';

import { type ActionTypes } from '~redux/index.ts';
import {
  type TypedMessageDescriptor,
  type SimpleMessageValues,
} from '~types/index.ts';
import { type ActionTransformFnType } from '~utils/actions.ts';

import { type LinkProps } from '../Link/types.ts';

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
  | 'notFilled'
  | 'link';

export type ButtonSize =
  | 'default'
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large';

export type TextButtonMode = 'default' | 'medium' | 'underlined';

export interface ButtonContentProps {
  icon?: Icon;
  iconSize?: number;
  mode?: ButtonMode;
  isIconRight?: boolean;
  text?: MessageDescriptor | TypedMessageDescriptor | string;
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
  setTriggerRef?: Dispatch<SetStateAction<HTMLElement | null>>;
  testId?: string;
}

export interface ButtonAppearanceCommonProps extends ButtonContentProps {
  size?: ButtonSize;
  isFullSize?: boolean;
  isFullRounded?: boolean;
  className?: string;
}

export type ButtonProps = Omit<CommonButtonProps, 'setTriggerRef'> &
  ButtonAppearanceCommonProps;

export interface TextButtonProps extends CommonButtonProps {
  mode?: TextButtonMode;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  isErrorColor?: boolean;
  icon?: Icon;
  iconSize?: number;
}

export interface IconButtonProps extends CommonButtonProps {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  rounded?: 's' | 'm' | 'l';
  isFullSize?: boolean;
  icon: ReactNode;
  className?: string;
}

export interface HamburgerProps extends CommonButtonProps {
  icon?: Icon;
  iconSize?: number;
  isOpened?: boolean;
}

export interface CloseButtonProps extends CommonButtonProps {
  className?: string;
  iconSize?: number;
}

export enum LoadingBehavior {
  TxLoader = 'txLoader', // Tx loader
  Disabled = 'disabled', // Disabled during load
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
  loadingBehavior?: LoadingBehavior;
}

export type ButtonLinkProps = Omit<
  LinkProps,
  'text' | 'textValues' | 'className'
> &
  ButtonAppearanceCommonProps &
  Pick<CommonButtonProps, 'loading' | 'disabled'>;
