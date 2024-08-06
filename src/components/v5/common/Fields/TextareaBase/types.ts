import { type TextareaHTMLAttributes } from 'react';

import { type BaseFieldProps } from '../types.ts';

export interface TextareaBaseProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseFieldProps {
  className?: string;
  wrapperClassName?: string;
  shouldFocus?: boolean;
  withoutCounter?: boolean;
}

export interface FormTextareaBaseProps extends TextareaBaseProps {
  name: string;
}
