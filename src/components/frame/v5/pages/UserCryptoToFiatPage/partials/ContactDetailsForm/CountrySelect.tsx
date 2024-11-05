import React from 'react';
import { useFormContext } from 'react-hook-form';

import { getCountries } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';

import { CONTACT_DETAILS_FORM_MSGS } from './consts.ts';
import { AddressFields, type ContactDetailsFormSchema } from './validation.ts';

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
    setValue(AddressFields.STATE, '');

    // If no attempt to submit the form has been made yet, do not trigger state validation
    if (!isSubmitted) {
      return;
    }
    trigger(AddressFields.STATE);
    trigger(AddressFields.CITY);
    // if country changed postcode should be revalidated
    trigger(AddressFields.POSTCODE);
  };

  return (
    <FormSelect<ContactDetailsFormSchema>
      name={AddressFields.COUNTRY}
      options={countriesOptions}
      labelMessage={formatText(CONTACT_DETAILS_FORM_MSGS.countryLabel)}
      placeholder={formatText(CONTACT_DETAILS_FORM_MSGS.countryPlaceholder)}
      handleChange={handleSelect}
    />
  );
};
