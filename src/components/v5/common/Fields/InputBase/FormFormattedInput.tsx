import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { FIELD_STATE } from '../consts';

import FormattedInput from './FormattedInput';
import { FormFormattedInputProps } from './types';

const displayName = 'v5.common.Fields.FormFormattedInput';

const FormFormattedInput: FC<FormFormattedInputProps> = ({
  name,
  type,
  ...rest
}) => {
  const {
    field: { onChange, value },
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
      onChange={(event) => {
        const { rawValue } = event.target;

        onChange(rawValue);
      }}
      state={invalid ? FIELD_STATE.Error : undefined}
    />
  );
};

FormFormattedInput.displayName = displayName;

export default FormFormattedInput;
