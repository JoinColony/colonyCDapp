import React from 'react';
import { useController } from 'react-hook-form';
import { FormCardSelectProps } from './types';
import CardSelect from './CardSelect';
import { FIELD_STATE } from '../consts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';

const displayName = 'v5.common.Fields.CardSelect.FormCardSelect';

function FormCardSelect<TValue = string>({
  name,
  ...rest
}: FormCardSelectProps<TValue>): JSX.Element {
  const { readonly, isActionPending } = useAdditionalFormOptionsContext();
  const {
    field: { onChange, value },
    fieldState: { invalid, error },
  } = useController({
    name,
  });

  return (
    <CardSelect<TValue>
      {...rest}
      readonly={readonly || isActionPending}
      value={value}
      onChange={onChange}
      state={invalid ? FIELD_STATE.Error : undefined}
      message={error?.message}
    />
  );
}

FormCardSelect.displayName = displayName;

export default FormCardSelect;
