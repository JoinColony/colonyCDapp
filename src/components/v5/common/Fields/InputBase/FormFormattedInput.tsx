import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { FieldState } from '../consts.ts';

import FormattedInput from './FormattedInput.tsx';
import { type FormFormattedInputProps } from './types.ts';

const displayName = 'v5.common.Fields.FormFormattedInput';

const FormFormattedInput: FC<FormFormattedInputProps> = ({
  name,
  type,
  ...rest
}) => {
  const {
    field: { value },
    fieldState: { invalid, error },
  } = useController({
    name,
  });

  return (
    <FormattedInput
      message={error?.message}
      {...rest}
      type={type}
      value={value}
      state={invalid ? FieldState.Error : undefined}
    />
  );
};

FormFormattedInput.displayName = displayName;

export default FormFormattedInput;
