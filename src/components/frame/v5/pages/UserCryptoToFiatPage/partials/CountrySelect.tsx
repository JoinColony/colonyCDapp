import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { type Message } from '~types/index.ts';
import { type CountryData } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';
import Select from '~v5/common/Fields/Select/Select.tsx';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';
import FormError from '~v5/shared/FormError/index.ts';

interface CountrySelectProps {
  options: SelectOption[];
  value: CountryData | null;
  name: string;

  labelMessage?: Message;
  onChange: (s: string) => void;
}
export const CountrySelect: FC<CountrySelectProps> = ({
  options,
  value,
  onChange,
  labelMessage,
  name,
}) => {
  const { setValue, getFieldState } = useFormContext();

  const { error } = getFieldState(name);

  const customErrorMessage = error?.message || '';

  const handleChange = (val) => {
    onChange(val?.value);
    setValue(name, val?.value?.alpha3);
  };
  return (
    <div>
      {labelMessage && (
        <label className="flex flex-col pb-1.5 text-1" htmlFor={`id-${name}`}>
          {formatText(labelMessage)}
        </label>
      )}

      <Select
        options={options}
        value={(value as any) ?? ''}
        onChange={handleChange}
        name={name}
      />
      <FormError isFullSize alignment="left">
        {customErrorMessage}
      </FormError>
    </div>
  );
};
