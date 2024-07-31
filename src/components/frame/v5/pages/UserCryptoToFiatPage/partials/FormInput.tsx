import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import { get } from '~utils/lodash.ts';
import Input from '~v5/common/Fields/Input/index.ts';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  shouldFocus?: boolean;
  shouldSkipRequiredErrorMessage?: boolean;
}
export const FormInput: FC<FormInputProps> = ({
  name,
  label,
  shouldFocus,
  shouldSkipRequiredErrorMessage,
  placeholder,
}) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();
  const error = get(errors, name);
  const hasRequiredError = error?.type === 'required';
  const hasError = !!error?.message;

  let customErrorMessage = '';
  if (hasError && !shouldSkipRequiredErrorMessage) {
    customErrorMessage = formatText({ id: `cryptoToFiat.forms.error.${name}` });
  }
  if (hasError && !hasRequiredError) {
    customErrorMessage = error?.message as string;
  }

  const shouldSkipErrorMessage =
    shouldSkipRequiredErrorMessage && hasRequiredError;

  return (
    <Input
      name={name}
      register={register}
      className="border-gray-300 text-md"
      isDisabled={isSubmitting}
      labelMessage={label}
      shouldFocus={shouldFocus}
      placeholder={placeholder}
      isError={hasError}
      shouldErrorMessageBeVisible={!shouldSkipErrorMessage}
      customErrorMessage={customErrorMessage}
      allowLayoutShift
    />
  );
};
