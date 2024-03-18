import React from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';

import { FieldState } from '../consts.ts';

import CardSelect from './CardSelect.tsx';
import { type FormCardSelectProps } from './types.ts';

const displayName = 'v5.common.Fields.CardSelect.FormCardSelect';

function FormCardSelect<TValue = string>({
  name,
  ...rest
}: FormCardSelectProps<TValue>): JSX.Element {
  const { readonly } = useAdditionalFormOptionsContext();
  const {
    field: { onChange, value },
    fieldState: { invalid, error },
  } = useController({
    name,
  });

  return (
    <CardSelect<TValue>
      {...rest}
      readonly={readonly}
      value={value}
      onChange={onChange}
      state={invalid ? FieldState.Error : undefined}
      message={error?.message}
    />
  );
}

FormCardSelect.displayName = displayName;

export default FormCardSelect;
