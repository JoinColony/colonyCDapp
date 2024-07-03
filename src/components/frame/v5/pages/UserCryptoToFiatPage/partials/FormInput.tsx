import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { type Message } from '~types/index.ts';
import { formatText } from '~utils/intl.ts';
import { get } from '~utils/lodash.ts';
import Input from '~v5/common/Fields/Input/index.ts';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  shouldFocus?: boolean;
}
export const FormInput: FC<FormInputProps> = ({
  name,
  label,
  shouldFocus,
  placeholder,
}) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();
  const error = get(errors, name)?.message as Message | undefined;

  return (
    <Input
      name={name}
      register={register}
      className="border-gray-300 text-md"
      isDisabled={isSubmitting}
      labelMessage={label}
      shouldFocus={shouldFocus}
      placeholder={placeholder}
      isError={!!error}
      customErrorMessage={error ? formatText(error) : ''}
    />
  );
};
