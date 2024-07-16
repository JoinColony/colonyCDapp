import React, { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { type Message } from '~types/index.ts';
import { formatText } from '~utils/intl.ts';
import { get } from '~utils/lodash.ts';
import Select from '~v5/common/Fields/Select/Select.tsx';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';
import FormError from '~v5/shared/FormError/index.ts';

interface FormSelectProps {
  name: string;
  labelMessage?: string;
  options: SelectOption[];
  handleChange?: any;
  placeholder?: string;
}

export const FormSelect: FC<FormSelectProps> = ({
  name,
  options,
  labelMessage,
  placeholder,
  handleChange,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message as Message | undefined;

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
              {labelMessage}
            </label>
          )}
          <Select
            {...field}
            options={options}
            isError={!!error}
            isSearchable
            placeholder={placeholder}
            onChange={(val) => {
              handleChange?.(val);
              field.onChange(val?.value);
            }}
          />
          {error && (
            <FormError isFullSize alignment="left">
              {formatText(error)}
            </FormError>
          )}
        </>
      )}
    />
  );
};
