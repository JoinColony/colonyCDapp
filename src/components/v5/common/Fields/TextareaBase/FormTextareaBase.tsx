import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';

import { FieldState } from '../consts.ts';

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
    <div>
      <TextareaBase
        readOnly={readonly}
        message={error?.message}
        state={invalid ? FieldState.Error : undefined}
        {...{ ...rest, ...field, onChange }}
      />
    </div>
  );
};

FormTextareaBase.displayName = displayName;

export default FormTextareaBase;
