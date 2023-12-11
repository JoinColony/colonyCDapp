import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import { FormSwitchProps } from './types';
import Switch from './Switch';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';

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
