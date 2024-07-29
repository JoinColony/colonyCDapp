import React, { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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
  shouldSkipErrorMessage?: boolean;
  formatOptionLabel?: (option: SelectOption) => JSX.Element;
}

export const FormSelect: FC<FormSelectProps> = ({
  name,
  options,
  labelMessage,
  placeholder,
  handleChange,
  shouldSkipErrorMessage,
  formatOptionLabel,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const hasError = !!get(errors, name)?.message;

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
            isError={hasError}
            isSearchable
            placeholder={placeholder}
            formatOptionLabel={formatOptionLabel}
            onChange={(val) => {
              handleChange?.(val);
              field.onChange(val?.value);
            }}
          />
          {hasError && !shouldSkipErrorMessage && (
            <FormError isFullSize alignment="left">
              {formatText({ id: `cryptoToFiat.forms.error.${name}` })}
            </FormError>
          )}
        </>
      )}
    />
  );
};
