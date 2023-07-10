import { HTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';

export type TextareaProps = HTMLAttributes<HTMLTextAreaElement> & {
  textareaTitle?: MessageDescriptor | string;
  maxCharNumber?: number;
  placeholder?: string;
  showFieldLimit?: boolean;
  shouldNumberOfCharsBeVisible?: boolean;
};
