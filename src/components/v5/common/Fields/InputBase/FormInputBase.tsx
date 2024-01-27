import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';

import { FIELD_STATE } from '../consts.ts';

import InputBase from './InputBase.tsx';
import { FormInputBaseProps } from './types.ts';

const displayName = 'v5.common.Fields.FormInputBase';

const FormInputBase: FC<FormInputBaseProps> = ({
  name,
  type,
  defaultValue,
  ...rest
}) => {
  const {
    field: { onChange, value, onBlur },
    fieldState: { invalid, error },
  } = useController({
    defaultValue,
    name,
  });
  const { readonly } = useAdditionalFormOptionsContext();

  return (
    <InputBase
      message={error?.message}
      {...rest}
      readOnly={readonly}
      type={type}
      onBlur={onBlur}
      value={value?.toString() || ''}
      onChange={(event) => {
        const { value: inputValue, valueAsNumber } = event.target;

        if (type === 'number') {
          onChange(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber);
        } else {
          onChange(inputValue);
        }
      }}
      state={invalid ? FIELD_STATE.Error : undefined}
    />
  );
};

FormInputBase.displayName = displayName;

export default FormInputBase;
