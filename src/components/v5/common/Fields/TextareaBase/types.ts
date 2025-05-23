import { type ReactNode, type TextareaHTMLAttributes } from 'react';
import { type UseControllerProps } from 'react-hook-form';

import { type BaseFieldProps } from '../types.ts';

export interface TextareaBaseProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseFieldProps {
  className?: string;
  wrapperClassName?: string;
  shouldFocus?: boolean;
  withoutCounter?: boolean;
  label?: string;
  labelClassName?: string;
  mode?: 'primary' | 'secondary';
  shouldUseAutoSize?: boolean;
  textareaOverlay?: ReactNode;
}

export interface FormTextareaBaseProps extends TextareaBaseProps {
  name: string;
  rules?: UseControllerProps['rules'];
}
