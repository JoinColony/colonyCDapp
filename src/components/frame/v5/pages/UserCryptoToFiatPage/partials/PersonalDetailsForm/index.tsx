/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { type FC, useState, type PropsWithChildren } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { type CountryData, getCountries } from '~utils/countries.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { CountrySelect } from '../CountrySelect.tsx';
import { FormInput } from '../FormInput.tsx';
import { FormSelect } from '../FormSelect.tsx';

const FormRow: FC<PropsWithChildren> = ({ children }) => {
  return <div className="py-1">{children}</div>;
};

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
}
export const PersonalDetailsForm: FC<BankDetailsFormProps> = ({ onSubmit }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );
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
          <FormInput
            name="date"
            label="Date of birth"
            placeholder="YYYY-MM-DD"
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="tax"
            label="Tax identification number (eg. social security number or EIN)"
            placeholder="Tax identification number"
          />
        </FormRow>

        <label className="mb-1.5 text-md font-medium text-gray-700">
          Adress
        </label>
        <FormRow>
          <CountrySelect
            name="country"
            options={countriesOptions as any}
            value={selectedCountry}
            onChange={(value) => setSelectedCountry(value)}
          />
        </FormRow>
        <FormRow>
          <FormInput name="address1" placeholder="Address line 1" />
        </FormRow>
        <FormRow>
          <FormInput name="address2" placeholder="Address line 2" />
        </FormRow>
        <FormRow>
          <div className="flex">
            <div className="flex-1">
              <FormInput name="city" placeholder="City" />
            </div>
            {!!selectedCountry?.subdivisions?.length && (
              <div className="flex-1">
                <FormSelect
                  name="subdivisions"
                  options={selectedCountry?.subdivisions.map((item) => ({
                    value: item.code,
                    label: item.name,
                  }))}
                />
              </div>
            )}
          </div>
        </FormRow>

        <FormRow>
          <FormInput name="email" placeholder="Postcode" />
        </FormRow>
        <Button type="submit">Next</Button>
      </Form>
    </div>
  );
};
