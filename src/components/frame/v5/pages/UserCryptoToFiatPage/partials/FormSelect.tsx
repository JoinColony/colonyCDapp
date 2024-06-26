import React, { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Select from '~v5/common/Fields/Select/Select.tsx';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';

interface FormSelectProps {
  name: string;
  options: SelectOption[];
}

export const FormSelect: FC<FormSelectProps> = ({ name, options }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <Select
          {...field}
          options={options}
          onChange={(val) => field.onChange(val?.value)}
        />
      )}
    />
  );
};
