import React from 'react';
import { useFormContext } from 'react-hook-form';

import { SupportedCurrencies } from '~gql';
import { getCountries } from '~utils/countries.ts';

import { CURRENCY_VALUES } from '../../constants.ts';
import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';

const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.BankDetailsForm.AccountDetailsInputs';

const AccountDetailsInputs = () => {
  const { watch } = useFormContext();
  const currency = watch('currency');

  const countries = getCountries();
  const countriesOptions = countries.map((item) => ({
    value: item.alpha3,
    label: item.name,
    country: item,
  }));

  return (
    <>
      {currency === CURRENCY_VALUES[SupportedCurrencies.Eur] && (
        <>
          <FormRow>
            <FormInput name="iban" placeholder="IBAN" />
          </FormRow>
          <FormRow>
            <FormInput name="swift" placeholder="SWIFT/BIC" />
          </FormRow>
          <FormRow>
            <FormSelect name="country" options={countriesOptions} />
          </FormRow>
        </>
      )}

      {currency === CURRENCY_VALUES[SupportedCurrencies.Usd] && (
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

AccountDetailsInputs.displayName = displayName;

export { AccountDetailsInputs };
