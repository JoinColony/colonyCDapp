import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import Input from '~v5/common/Fields/Input/index.ts';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
}
export const FormInput: FC<FormInputProps> = ({ name, label, placeholder }) => {
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Input
      name={name}
      register={register}
      className="border-gray-300 text-md"
      isDisabled={isSubmitting}
      labelMessage={label}
      shouldFocus
      placeholder={placeholder}
    />
  );
};
