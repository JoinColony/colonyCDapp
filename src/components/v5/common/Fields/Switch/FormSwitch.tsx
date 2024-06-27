import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';

import Switch from './Switch.tsx';
import { type FormSwitchProps } from './types.ts';

const displayName = 'v5.common.Fields.FormSwitch';

const FormSwitch: FC<FormSwitchProps> = ({
  name,
  readOnly: readOnlyProp,
  ...rest
}) => {
  const {
    field: { value, ...field },
  } = useController({ name });
  const { readonly } = useAdditionalFormOptionsContext();

  return (
    <Switch
      {...rest}
      {...field}
      checked={value}
      readOnly={readonly || readOnlyProp}
    />
  );
};

FormSwitch.displayName = displayName;

export default FormSwitch;
