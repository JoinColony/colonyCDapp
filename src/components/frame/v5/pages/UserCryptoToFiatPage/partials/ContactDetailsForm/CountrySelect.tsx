import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { getCountries } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';

import { FormSelect } from '../FormSelect.tsx';

const displayName =
  'v5.pages.UserCryptoToFiatpage.partials.ContactDetailsForm.CountrySelect';

const MSG = defineMessages({
  countryLabel: {
    id: `${displayName}.countryLabel`,
    defaultMessage: 'Country',
  },
});

export const CountrySelect = () => {
  const countries = getCountries();
  const countriesOptions = countries.map((item) => ({
    value: item.alpha3,
    label: item.name,
    country: item,
  }));

  const {
    setValue,
    trigger,
    formState: { isSubmitted },
  } = useFormContext();

  const handleSelect = () => {
    // if country changed user should choose state of new country
    setValue('state', '');

    // If no attempt to submit the form has been made yet, do not trigger state validation
    if (!isSubmitted) {
      return;
    }
    trigger('state');
  };

  return (
    <FormSelect
      name="country"
      options={countriesOptions}
      placeholder={formatText(MSG.countryLabel)}
      handleChange={handleSelect}
    />
  );
};
