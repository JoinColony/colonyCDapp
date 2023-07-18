import { HTMLAttributes } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { MessageDescriptor } from 'react-intl';

export type TextareaProps = HTMLAttributes<HTMLTextAreaElement> & {
  textareaTitle?: MessageDescriptor | string;
  maxCharNumber?: number;
  placeholder?: string;
  showFieldLimit?: boolean;
  shouldNumberOfCharsBeVisible?: boolean;
  name?: string;
  register?: UseFormRegister<FieldValues>;
  isError?: boolean;
};
