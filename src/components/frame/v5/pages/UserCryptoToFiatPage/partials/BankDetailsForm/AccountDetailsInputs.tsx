import React from 'react';
import { useFormContext } from 'react-hook-form';

import { SupportedCurrencies } from '~gql';
import { getCountries } from '~utils/countries.ts';

import { CURRENCY_VALUES } from '../../constants.ts';
import { FormInput } from '../FormInput.tsx';
import { FormInputGroup } from '../FormInputGroup.tsx';
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
        <FormInputGroup
          groupLabel="Bank account"
          groupName="bankAccount.eur"
          names={['iban', 'swift', 'country']}
        >
          <FormRow>
            <FormInput shouldSkipErrorMessage name="iban" placeholder="IBAN" />
          </FormRow>
          <FormRow>
            <FormInput
              shouldSkipErrorMessage
              name="swift"
              placeholder="SWIFT/BIC"
            />
          </FormRow>
          <FormRow>
            <FormSelect
              shouldSkipErrorMessage
              name="country"
              options={countriesOptions}
            />
          </FormRow>
        </FormInputGroup>
      )}

      {currency === CURRENCY_VALUES[SupportedCurrencies.Usd] && (
        <FormInputGroup
          groupLabel="Bank account"
          groupName="bankAccount.usd"
          names={['accountNumber', 'routingNumber']}
        >
          <FormRow>
            <FormInput
              shouldSkipErrorMessage
              name="accountNumber"
              placeholder="Account Number"
            />
          </FormRow>
          <FormRow>
            <FormInput
              shouldSkipErrorMessage
              name="routingNumber"
              placeholder="Routing Number"
            />
          </FormRow>
        </FormInputGroup>
      )}
    </>
  );
};

AccountDetailsInputs.displayName = displayName;

export { AccountDetailsInputs };
