import { HTMLAttributes } from 'react';

export type TextareaProps = HTMLAttributes<HTMLTextAreaElement> & {
  textareaTitle?: string;
  maxCharNumber?: number;
  placeholder?: string;
  showFieldLimit?: boolean;
};
