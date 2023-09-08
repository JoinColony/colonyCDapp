import React from 'react';
import { useController, useWatch } from 'react-hook-form';
import { FormCardSelectProps } from './types';
import CardSelect from './CardSelect';
import { FIELD_STATE } from '../consts';

const displayName = 'v5.common.Fields.CardSelect.FormCardSelect';

function FormCardSelect<TValue = string>({
  name,
  ...rest
}: FormCardSelectProps<TValue>): JSX.Element {
  const {
    field: { onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
  });
  const value = useWatch({ name });

  return (
    <CardSelect<TValue>
      {...{ ...rest, value, onChange }}
      state={invalid ? FIELD_STATE.Error : undefined}
      message={error?.message}
    />
  );
}

FormCardSelect.displayName = displayName;

export default FormCardSelect;
