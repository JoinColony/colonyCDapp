import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';

import { FIELD_STATE } from '../consts.ts';

import TextareaBase from './TextareaBase.tsx';
import { type FormTextareaBaseProps } from './types.ts';

const displayName = 'v5.common.Fields.FormTextAreaBase';

const FormTextareaBase: FC<FormTextareaBaseProps> = ({ name, ...rest }) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
  });
  const { readonly } = useAdditionalFormOptionsContext();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    rest.onChange?.(e);
    field.onChange(e);
  };

  return (
    <TextareaBase
      readOnly={readonly}
      message={error?.message}
      state={invalid ? FIELD_STATE.Error : undefined}
      {...{ ...rest, ...field, onChange }}
    />
  );
};

FormTextareaBase.displayName = displayName;

export default FormTextareaBase;
