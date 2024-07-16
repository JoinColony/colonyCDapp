import React, { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { getCountryByCode } from '~utils/countries.ts';

import { FormSelect } from '../FormSelect.tsx';

export const SubdivisionSelect = () => {
  const countryCode = useWatch({
    name: 'country',
  });

  const subdivisions = useMemo(
    () => getCountryByCode(countryCode)?.subdivisions ?? [],
    [countryCode],
  );
  return (
    <div className="ml-1 flex-1">
      <FormSelect
        name="state"
        options={subdivisions.map((item) => ({
          value: item.code,
          label: item.name,
        }))}
      />
    </div>
  );
};
