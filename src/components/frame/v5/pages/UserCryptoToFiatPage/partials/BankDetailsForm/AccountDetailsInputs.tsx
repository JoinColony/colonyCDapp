import React from 'react';
import { useFormContext } from 'react-hook-form';

import { CURRENCY_VALUES } from '~frame/v5/pages/UserCryptoToFiatPage/constants.ts';
import { SupportedCurrencies } from '~gql';
import { getCountries } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';
import { FormSelect } from '~v5/common/Fields/Select/FormSelect.tsx';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';

import { BANK_DETAILS_FORM_MSG } from './constants.ts';
import { BankDetailsFields, type BankDetailsFormSchema } from './validation.ts';

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
            <FormInput<BankDetailsFormSchema>
              name={BankDetailsFields.IBAN}
              label={formatText(BANK_DETAILS_FORM_MSG.ibanLabel)}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.ibanLabel)}
            />
          </FormRow>
          <FormRow>
            <FormInput<BankDetailsFormSchema>
              name={BankDetailsFields.SWIFT}
              label={formatText(BANK_DETAILS_FORM_MSG.swiftLabel)}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.swiftLabel)}
            />
          </FormRow>
          <FormRow>
            <FormSelect<BankDetailsFormSchema>
              name={BankDetailsFields.COUNTRY}
              options={countriesOptions}
              labelMessage={formatText(BANK_DETAILS_FORM_MSG.countryLabel)}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.countryPlaceholder)}
            />
          </FormRow>
        </>
      )}

      {currency === CURRENCY_VALUES[SupportedCurrencies.Usd] && (
        <>
          <FormRow>
            <FormInput<BankDetailsFormSchema>
              name={BankDetailsFields.ACCOUNT_NUMBER}
              label={formatText(BANK_DETAILS_FORM_MSG.accountNumberLabel)}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.accountNumberLabel)}
            />
          </FormRow>
          <FormRow>
            <FormInput<BankDetailsFormSchema>
              name={BankDetailsFields.ROUTING_NUMBER}
              label={formatText(BANK_DETAILS_FORM_MSG.routingNumberLabel)}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.routingNumberLabel)}
            />
          </FormRow>
        </>
      )}
    </>
  );
};

AccountDetailsInputs.displayName = displayName;

export { AccountDetailsInputs };
