import { InputHTMLAttributes } from 'react';
import { CleaveOptions } from 'cleave.js/options';
import { BaseFieldProps } from '../types';

export interface InputBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    BaseFieldProps {
  className?: string;
  wrapperClassName?: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  mode?: 'primary' | 'secondary';
  autoWidth?: boolean;
}

export interface FormInputBaseProps
  extends Omit<InputBaseProps, 'onChange' | 'value' | 'state'> {
  name: string;
}

export interface FormattedInputProps
  extends Omit<InputBaseProps, 'value' | 'prefix'> {
  formattingOptions: CleaveOptions;
  value: string;
  buttonProps?: React.HTMLAttributes<HTMLButtonElement> & {
    label: string;
  };
  wrapperClassName?: string;
}

export interface FormFormattedInputProps
  extends Omit<FormattedInputProps, 'onChange' | 'value' | 'state'> {
  name: string;
}
