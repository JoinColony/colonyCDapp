import { InputHTMLAttributes } from 'react';

export interface InputBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  className?: string;
  hasError?: boolean;
  errorMessage?: React.ReactNode;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  mode: 'primary' | 'secondary';
}
