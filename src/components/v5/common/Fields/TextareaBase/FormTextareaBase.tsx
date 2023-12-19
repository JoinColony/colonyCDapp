import React, { forwardRef } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';

import { FIELD_STATE } from '../consts';
import TextareaBase from './TextareaBase';
import { FormTextareaBaseProps } from './types';

const displayName = 'v5.common.Fields.FormTextAreaBase';

const FormTextareaBase = forwardRef<HTMLTextAreaElement, FormTextareaBaseProps>(
  ({ name, ...rest }, ref) => {
    const {
      field,
      fieldState: { invalid, error },
    } = useController({
      name,
    });
    const { readonly } = useAdditionalFormOptionsContext();

    return (
      <TextareaBase
        readOnly={readonly}
        message={error?.message}
        state={invalid ? FIELD_STATE.Error : undefined}
        {...{ ...rest, ...field }}
        ref={ref}
      />
    );
  },
);

Object.assign(FormTextareaBase, { displayName });

export default FormTextareaBase;
