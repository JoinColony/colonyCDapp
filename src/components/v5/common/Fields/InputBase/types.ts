import { InputHTMLAttributes } from 'react';
import { BaseFieldProps } from '../types';

export interface InputBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    BaseFieldProps {
  className?: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  mode: 'primary' | 'secondary';
}
