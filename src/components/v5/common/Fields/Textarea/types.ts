import { type HTMLAttributes } from 'react';
import { type UseFormRegister, type FieldValues } from 'react-hook-form';
import { type MessageDescriptor } from 'react-intl';

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
