import React, { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';

import {
  type SubdivisionData,
  getSubdivisionsByCountryCode,
} from '~utils/subdivisions.ts';

import { FormSelect } from '../FormSelect.tsx';

export const SubdivisionSelect = () => {
  const countryCode = useWatch({
    name: 'country',
  });

  const [subdivisions, setSubdivisions] = useState<SubdivisionData[]>([]);

  useEffect(() => {
    if (!countryCode) {
      setSubdivisions([]);
      return;
    }

    (async () => {
      const data = await getSubdivisionsByCountryCode(countryCode);
      setSubdivisions(data);
    })();
  }, [countryCode]);

  return (
    <div className="ml-1 flex-1">
      <FormSelect
        name="state"
        placeholder="State"
        options={subdivisions.map((item) => ({
          value: item.code,
          label: item.name,
        }))}
      />
    </div>
  );
};
