import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';

import { FieldState } from '../consts.ts';

import InputBase from './InputBase.tsx';
import { type FormInputBaseProps } from './types.ts';

const displayName = 'v5.common.Fields.FormInputBase';

const FormInputBase: FC<FormInputBaseProps> = ({
  name,
  type,
  defaultValue,
  onBlur: onBlurProp,
  readOnly,
  onChange: onChangeProp,
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
      readOnly={readonly || readOnly}
      type={type}
      onBlur={(event) => {
        onBlur();
        onBlurProp?.(event);
      }}
      value={value?.toString() || ''}
      onChange={(event) => {
        const { value: inputValue, valueAsNumber } = event.target;

        onChangeProp?.();

        if (type === 'number') {
          onChange(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber);
        } else {
          onChange(inputValue);
        }
      }}
      state={invalid ? FieldState.Error : undefined}
    />
  );
};

FormInputBase.displayName = displayName;

export default FormInputBase;
