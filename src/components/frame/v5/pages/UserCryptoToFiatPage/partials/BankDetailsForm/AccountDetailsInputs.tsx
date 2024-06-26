import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getCountries, type CountryData } from '~utils/countries.ts';

import { CountrySelect } from '../CountrySelect.tsx';
import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';

export const AccountDetailsInputs = () => {
  const { watch } = useFormContext();
  const currency = watch('currency');

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );
  const countries = getCountries();
  const countriesOptions = countries.map((item) => ({
    value: item,
    label: item.name,
  }));

  return (
    <>
      {currency === 'eur' && (
        <>
          <FormRow>
            <FormInput name="iban" placeholder="IBAN" />
          </FormRow>
          <FormRow>
            <FormInput name="swift" placeholder="SWIFT/BIC" />
          </FormRow>
          <FormRow>
            <CountrySelect
              name="country"
              options={countriesOptions as any}
              value={selectedCountry}
              onChange={(value) => setSelectedCountry(value as any)}
            />
          </FormRow>
        </>
      )}

      {currency === 'usd' && (
        <>
          <FormRow>
            <FormInput
              name="accountNumber"
              label="Account Number"
              placeholder="Account Number"
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="routingNumber"
              label="Routing Number"
              placeholder="Routing Number"
            />
          </FormRow>
        </>
      )}
    </>
  );
};
