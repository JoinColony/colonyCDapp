import { TextareaHTMLAttributes } from 'react';

import { BaseFieldProps } from '../types';

export interface TextareaBaseProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseFieldProps {
  className?: string;
  wrapperClassName?: string;
  shouldFocus?: boolean;
}

export interface FormTextareaBaseProps extends TextareaBaseProps {
  name: string;
}
