import React from 'react';
import { type Message, useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import { get } from '~utils/lodash.ts';
import Input from '~v5/common/Fields/Input/index.ts';

interface FormInputProps<T> {
  name: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
  shouldFocus?: boolean;
  error?: string;
}
const FormInput = <T,>({
  name,
  label,
  shouldFocus,
  placeholder,
  error,
}: FormInputProps<T>) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();
  const errorMessage =
    error || (get(errors, name)?.message as Message | undefined);

  return (
    <Input
      name={name}
      register={register}
      className="border-gray-300 text-md"
      isDisabled={isSubmitting}
      labelMessage={label}
      shouldFocus={shouldFocus}
      placeholder={placeholder}
      isError={!!errorMessage}
      customErrorMessage={errorMessage ? formatText(errorMessage) : ''}
      allowLayoutShift
    />
  );
};

export default FormInput;
