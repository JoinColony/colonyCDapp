import { UseFormRegister, FieldValues } from 'react-hook-form';

export type InputProps = {
  maxCharNumber?: number;
  placeholder?: string;
  shouldNumberOfCharsBeVisible?: boolean;
  isError?: boolean;
  customErrorMessage?: string;
  defaultValue?: string;
  name: string;
  register: UseFormRegister<FieldValues>;
  className?: string;
  decoratedError?: boolean;
  successfulMessage?: string;
  isDisabled?: boolean;
  isErrorPillVisible?: boolean;
  customSuccessMessage?: string;
  isFormEdited?: boolean;
};
