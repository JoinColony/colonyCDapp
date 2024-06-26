import { type FormatNumeralOptions } from 'cleave-zen';
import { type InputHTMLAttributes } from 'react';

import { type BaseFieldProps } from '../types.ts';

export interface InputBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    BaseFieldProps {
  className?: string;
  wrapperClassName?: string;
  inputWrapperClassName?: string;
  labelClassName?: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  mode?: 'primary' | 'secondary';
  autoWidth?: boolean;
  label?: React.ReactNode;
  shouldFocus?: boolean;
  maxWidth?: number;
}

export interface FormInputBaseProps
  extends Omit<InputBaseProps, 'onChange' | 'state' | 'value'> {
  name: string;
  onChange?: () => void;
}

export interface FormattedInputProps extends Omit<InputBaseProps, 'prefix'> {
  options: FormatNumeralOptions;
  buttonProps?: React.HTMLAttributes<HTMLButtonElement> & {
    label: string;
  };
  messageClassName?: string;
  customPrefix?: React.ReactNode;
}

export interface FormFormattedInputProps
  extends Omit<FormattedInputProps, 'onChange' | 'value' | 'state'> {
  name: string;
}
