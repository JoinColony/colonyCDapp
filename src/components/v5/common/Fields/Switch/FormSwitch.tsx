import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import { FormSwitchProps } from './types';
import Switch from './Switch';

const displayName = 'v5.common.Fields.FormSwitch';

const FormSwitch: FC<FormSwitchProps> = ({ name, handleOnChange, ...rest }) => {
  const {
    field: { value, onChange: formOnChange, ...field },
  } = useController({ name });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formOnChange(event);
    handleOnChange?.(event.target.checked);
  };

  return <Switch {...rest} {...field} checked={value} onChange={onChange} />;
};

FormSwitch.displayName = displayName;

export default FormSwitch;
