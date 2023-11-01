import React from 'react';
import { useController } from 'react-hook-form';
import ButtonRadioButtons from './ButtonRadioButtons';
import { FormButtonRadioButtonsProps } from './types';

const displayName = 'v5.common.Fields.CardSelect.FormButtonRadioButtons';

function FormButtonRadioButtons<TValue = string>({
  name,
  ...rest
}: FormButtonRadioButtonsProps<TValue>): JSX.Element {
  const {
    field: { onChange, value },
  } = useController({
    name,
  });

  return (
    <ButtonRadioButtons<TValue> {...rest} value={value} onChange={onChange} />
  );
}

FormButtonRadioButtons.displayName = displayName;

export default FormButtonRadioButtons;
