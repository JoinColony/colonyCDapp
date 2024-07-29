import React from 'react';
import { useFormContext } from 'react-hook-form';

import { getCountries } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';

import { FormSelect } from '../FormSelect.tsx';

import { CONTACT_DETAILS_FORM_MSGS } from './consts.ts';
import { type ContactDetailsFormSchema } from './validation.ts';

export const CountrySelect = () => {
  const countries = getCountries();
  const countriesOptions = countries.map((item) => ({
    value: item.alpha3,
    label: item.name,
    country: item,
  }));

  const { setValue } = useFormContext();

  const handleSelect = () => {
    // if country changed user should choose state of new country
    setValue('state', '');
  };

  return (
    <FormSelect<ContactDetailsFormSchema>
      name="country"
      options={countriesOptions}
      placeholder={formatText(CONTACT_DETAILS_FORM_MSGS.countryPlaceholder)}
      handleChange={handleSelect}
    />
  );
};
