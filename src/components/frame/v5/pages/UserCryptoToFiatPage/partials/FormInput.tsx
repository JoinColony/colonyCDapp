import clsx from 'clsx';
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
  shouldSkipErrorMessage?: boolean;
}
export const FormInput: FC<FormInputProps> = ({
  name,
  label,
  shouldFocus,
  shouldSkipErrorMessage,
  placeholder,
}) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();
  const hasError = !!get(errors, name)?.message;

  return (
    <div className={clsx({ 'mb-5': hasError && !shouldSkipErrorMessage })}>
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
        customErrorMessage={
          hasError ? formatText({ id: `cryptoToFiat.forms.error.${name}` }) : ''
        }
      />
    </div>
  );
};
