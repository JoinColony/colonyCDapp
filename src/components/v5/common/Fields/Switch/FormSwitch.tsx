import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import { FormSwitchProps } from './types';
import Switch from './Switch';

const displayName = 'v5.common.Fields.FormSwitch';

const FormSwitch: FC<FormSwitchProps> = ({ name, ...rest }) => {
  const {
    field: { value, ...field },
  } = useController({ name });

  return <Switch {...rest} {...field} checked={value} />;
};

FormSwitch.displayName = displayName;

export default FormSwitch;
