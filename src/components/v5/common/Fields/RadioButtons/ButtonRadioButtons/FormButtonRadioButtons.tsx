import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import ButtonRadioButtons from './ButtonRadioButtons';
import { FormButtonRadioButtonsProps } from './types';

const displayName = 'v5.common.Fields.RadioButtons.FormButtonRadioButtons';

const FormButtonRadioButtons: FC<FormButtonRadioButtonsProps> = ({
  name,
  ...rest
}) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
  });

  return <ButtonRadioButtons {...rest} value={value} onChange={onChange} />;
};

FormButtonRadioButtons.displayName = displayName;

export default FormButtonRadioButtons;
