/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, type FC, type PropsWithChildren } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { type CountryData, getCountries } from '~utils/countries.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { CountrySelect } from '../CountrySelect.tsx';
import { FormInput } from '../FormInput.tsx';

const FormRow: FC<PropsWithChildren> = ({ children }) => {
  return <div className="py-1">{children}</div>;
};

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
}
export const BankDetailsForm: FC<BankDetailsFormProps> = ({ onSubmit }) => {
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
      Bank details
      <Form onSubmit={onSubmit}>
        <FormRow>
          <FormInput
            name="account-owner"
            label="Account owner name"
            placeholder="Full name"
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="bank-name"
            label="Bank name"
            placeholder="Bank name"
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="currency"
            label="Payout currency"
            placeholder="Payout currency"
          />
        </FormRow>
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
            labelMessage="Country"
            onChange={(value) => setSelectedCountry(value as any)}
          />
        </FormRow>
        <Button type="submit">Next</Button>
      </Form>
    </div>
  );
};
