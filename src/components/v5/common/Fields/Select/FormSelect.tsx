import React from 'react';
import {
  Controller,
  type Message,
  type UseControllerProps,
  useFormContext,
} from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import { get } from '~utils/lodash.ts';
import Select from '~v5/common/Fields/Select/Select.tsx';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';
import FormError from '~v5/shared/FormError/index.ts';

interface FormSelectProps<T> {
  name: Extract<keyof T, string>;
  labelMessage?: string;
  options: SelectOption[];
  handleChange?: any;
  placeholder?: string;
  formatOptionLabel?: (option: SelectOption) => JSX.Element;
  rules?: UseControllerProps['rules'];
}

const FormSelect = <T,>({
  name,
  options,
  labelMessage,
  placeholder,
  handleChange,
  formatOptionLabel,
  rules,
}: FormSelectProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name)?.message as Message | undefined;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div>
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
            isDisabled={!options || !options.length}
            placeholder={placeholder}
            formatOptionLabel={formatOptionLabel}
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
        </div>
      )}
    />
  );
};

export default FormSelect;
