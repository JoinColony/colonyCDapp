import React, { FC } from 'react';

import { useController } from 'react-hook-form';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { FIELD_STATE } from '../consts';
import TextareaBase from './TextareaBase';
import { FormTextareaBaseProps } from './types';

const displayName = 'v5.common.Fields.FormTextAreaBase';

const FormTextareaBase: FC<FormTextareaBaseProps> = ({ name, ...rest }) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
  });
  const { readonly, isActionPending } = useAdditionalFormOptionsContext();

  return (
    <TextareaBase
      readOnly={readonly || isActionPending}
      message={error?.message}
      state={invalid ? FIELD_STATE.Error : undefined}
      {...{ ...rest, ...field }}
    />
  );
};

FormTextareaBase.displayName = displayName;

export default FormTextareaBase;
