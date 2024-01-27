import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';

import Switch from './Switch.tsx';
import { FormSwitchProps } from './types.ts';

const displayName = 'v5.common.Fields.FormSwitch';

const FormSwitch: FC<FormSwitchProps> = ({ name, ...rest }) => {
  const {
    field: { value, ...field },
  } = useController({ name });
  const { readonly } = useAdditionalFormOptionsContext();

  return <Switch {...rest} {...field} checked={value} readOnly={readonly} />;
};

FormSwitch.displayName = displayName;

export default FormSwitch;
