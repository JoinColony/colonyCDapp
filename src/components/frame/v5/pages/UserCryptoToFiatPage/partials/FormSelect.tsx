import React, { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { type Message } from '~types/index.ts';
import { formatText } from '~utils/intl.ts';
import Select from '~v5/common/Fields/Select/Select.tsx';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';
import FormError from '~v5/shared/FormError/index.ts';

interface FormSelectProps {
  name: string;
  labelMessage?: Message;
  options: SelectOption[];
  handleChange?: any;
}

export const FormSelect: FC<FormSelectProps> = ({
  name,
  options,
  labelMessage,
  handleChange,
}) => {
  const { control, getFieldState } = useFormContext();
  const { error } = getFieldState(name);
  const customErrorMessage = error?.message || '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          {labelMessage && (
            <label
              className="flex flex-col pb-1.5 text-1"
              htmlFor={`id-${name}`}
            >
              {formatText(labelMessage)}
            </label>
          )}
          <Select
            {...field}
            options={options}
            onChange={(val) => {
              handleChange?.(val);
              field.onChange(val?.value);
            }}
          />
          <FormError isFullSize alignment="left">
            {customErrorMessage}
          </FormError>
        </>
      )}
    />
  );
};
