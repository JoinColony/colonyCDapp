import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { type CountryData } from '~utils/countries.ts';
import Select from '~v5/common/Fields/Select/Select.tsx';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';

interface CountrySelectProps {
  options: SelectOption[];
  value: CountryData | null;
  name: string;
  onChange: (s: string) => void;
}
export const CountrySelect: FC<CountrySelectProps> = ({
  options,
  value,
  onChange,
  name,
}) => {
  const { setValue } = useFormContext();

  const handleChange = (val) => {
    onChange(val?.value);
    setValue(name, val?.value?.alpha3);
  };
  return (
    <Select
      options={options}
      value={(value as any) ?? ''}
      onChange={handleChange}
      name={name}
    />
  );
};
