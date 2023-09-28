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
  shouldShowErrorMessage?: boolean;
}

export interface FormInputBaseProps
  extends Omit<InputBaseProps, 'onChange' | 'value' | 'state' | 'message'> {
  name: string;
}
