import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { type CountryData, getCountries } from '~utils/countries.ts';
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

interface CountrySelectProps {
  setSelectedCountry: (c: CountryData) => void;
}

export const CountrySelect: FC<CountrySelectProps> = ({
  setSelectedCountry,
}) => {
  const countries = getCountries();
  const countriesOptions = countries.map((item) => ({
    value: item.alpha3,
    label: item.name,
    country: item,
  }));

  const { setValue } = useFormContext();

  const handleSelect = ({ country }) => {
    setSelectedCountry(country);
    // if country changed user should choose state of new country
    setValue('state', '');
  };

  return (
    <FormSelect
      name="country"
      options={countriesOptions}
      labelMessage={formatText(MSG.countryLabel)}
      handleChange={handleSelect}
    />
  );
};
