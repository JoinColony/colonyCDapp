import { UseFormRegister, FieldValues } from 'react-hook-form';
import { Message } from '~types';

export type InputProps = {
  maxCharNumber?: number;
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
};
