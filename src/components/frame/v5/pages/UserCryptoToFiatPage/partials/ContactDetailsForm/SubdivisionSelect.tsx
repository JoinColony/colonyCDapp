import React, { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import {
  type SubdivisionData,
  getSubdivisionsByCountryCode,
} from '~utils/subdivisions.ts';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';

import { CONTACT_DETAILS_FORM_MSGS } from './consts.ts';
import { AddressFields, type ContactDetailsFormSchema } from './validation.ts';

export const SubdivisionSelect = () => {
  const countryCode = useWatch({
    name: AddressFields.COUNTRY,
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
      <FormSelect<ContactDetailsFormSchema>
        name={AddressFields.STATE}
        labelMessage={formatText(CONTACT_DETAILS_FORM_MSGS.stateLabel)}
        placeholder={formatText(CONTACT_DETAILS_FORM_MSGS.statePlaceholder)}
        options={subdivisions.map((item) => ({
          value: item.code,
          label: item.name,
        }))}
      />
    </div>
  );
};
