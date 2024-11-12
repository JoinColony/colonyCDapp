import {
  type UseFormRegister,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

import { type Message } from '~types/index.ts';

import type React from 'react';

export type InputProps = {
  maxCharNumber?: number;
  errorMaxChar?: boolean;
  placeholder?: string;
  shouldNumberOfCharsBeVisible?: boolean;
  shouldErrorMessageBeVisible?: boolean;
  isError?: boolean;
  isErrorStatus?: boolean;
  customErrorMessage?: string;
  defaultValue?: string;
  name: string;
  register?: UseFormRegister<FieldValues>;
  className?: string;
  isDecoratedError?: boolean;
  successfulMessage?: string;
  isDisabled?: boolean;
  disabledTooltipMessage?: Message;
  labelMessage?: Message;
  labelClassName?: string;
  subLabelMessage?: Message;
  setIsTyping?: React.Dispatch<React.SetStateAction<boolean>>;
  shouldFocus?: boolean;
  allowLayoutShift?: boolean;
  registerOptions?: RegisterOptions<FieldValues>;
};

export type PillProps = {
  status: PillStatusType;
  message?: string;
};

type PillStatusType = 'success' | 'error' | 'warn';

export type CharacterNumbersProps = Pick<
  InputProps,
  'maxCharNumber' | 'isError'
> & {
  isCharLenghtError?: boolean;
  currentCharNumber?: number;
  isShowingLabel?: boolean;
};
