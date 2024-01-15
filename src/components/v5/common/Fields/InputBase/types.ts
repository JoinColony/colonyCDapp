import { Props as CleaveProps } from 'cleave.js/react/props';
import { InputHTMLAttributes } from 'react';

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
  label?: React.ReactNode;
  shouldFocus?: boolean;
}

export interface FormInputBaseProps
  extends Omit<InputBaseProps, 'onChange' | 'state' | 'value'> {
  name: string;
}

export interface FormattedInputProps
  extends Omit<InputBaseProps, 'value' | 'prefix' | 'onChange'>,
    CleaveProps {
  buttonProps?: React.HTMLAttributes<HTMLButtonElement> & {
    label: string;
  };
  wrapperClassName?: string;
  messageClassName?: string;
  customPrefix?: React.ReactNode;
}

export interface FormFormattedInputProps
  extends Omit<FormattedInputProps, 'onChange' | 'value' | 'state'> {
  name: string;
}
