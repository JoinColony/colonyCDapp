/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { type FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { type CountryData, getCountries } from '~utils/countries.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { CountrySelect } from '../CountrySelect.tsx';
import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
  selectedCountry: CountryData | null;
  handleSelectCountry: (value: any) => void;
}
export const PersonalDetailsForm: FC<BankDetailsFormProps> = ({
  onSubmit,
  selectedCountry,
  handleSelectCountry,
}) => {
  const countries = getCountries();
  const countriesOptions = countries.map((item) => ({
    value: item,
    label: item.name,
  }));

  return (
    <div>
      Personal details
      <Form onSubmit={onSubmit}>
        <FormRow>
          <FormInput
            name="firstName"
            label="First name"
            placeholder="First name"
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="lastName"
            label="Last name"
            placeholder="Last name"
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="email"
            label="Email address"
            placeholder="Email address"
          />
        </FormRow>

        <FormRow>
          <CountrySelect
            name="country"
            options={countriesOptions as any}
            value={selectedCountry}
            labelMessage="Country"
            onChange={handleSelectCountry}
          />
        </FormRow>

        <Button type="submit">Next</Button>
      </Form>
    </div>
  );
};
