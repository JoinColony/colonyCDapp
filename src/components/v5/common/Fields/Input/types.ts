import { type UseFormRegister, type FieldValues } from 'react-hook-form';

import { type Message } from '~types/index.ts';

import type React from 'react';

export type InputProps = {
  maxCharNumber?: number;
  errorMaxChar?: boolean;
  placeholder?: string;
  shouldNumberOfCharsBeVisible?: boolean;
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
};

export type PillProps = {
  status: PillStatusType;
  message?: string;
};

type PillStatusType = 'success' | 'error' | 'warning';

export type CharacterNumbersProps = Pick<
  InputProps,
  'maxCharNumber' | 'isError'
> & {
  isCharLenghtError?: boolean;
  currentCharNumber?: number;
  isShowingLabel?: boolean;
};
