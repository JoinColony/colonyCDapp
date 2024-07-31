import React from 'react';
import { useFormContext } from 'react-hook-form';

import { SupportedCurrencies } from '~gql';
import { getCountries } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';

import { CURRENCY_VALUES } from '../../constants.ts';
import { FormInput } from '../FormInput.tsx';
import { FormInputGroup } from '../FormInputGroup.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';

import { BANK_DETAILS_FORM_MSG } from './constants.ts';
import { BankDetailsFields } from './validation.ts';

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

  const handleGroupErrorMessage = (
    groupName: string,
    errorFieldNames: string[],
  ) =>
    formatText({
      id: `cryptoToFiat.forms.error.${groupName}.${errorFieldNames.join('-')}`,
    });

  return (
    <>
      {currency === CURRENCY_VALUES[SupportedCurrencies.Eur] && (
        <FormInputGroup
          groupLabel={formatText(BANK_DETAILS_FORM_MSG.bankAccountLabel)}
          groupName="bankAccount.eur"
          names={[
            BankDetailsFields.IBAN,
            BankDetailsFields.SWIFT,
            BankDetailsFields.COUNTRY,
          ]}
          getErrorMessage={handleGroupErrorMessage}
        >
          <FormRow>
            <FormInput
              shouldSkipRequiredErrorMessage
              name={BankDetailsFields.IBAN}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.ibanLabel)}
            />
          </FormRow>
          <FormRow>
            <FormInput
              shouldSkipRequiredErrorMessage
              name={BankDetailsFields.SWIFT}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.swiftLabel)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              shouldSkipErrorMessage
              name={BankDetailsFields.COUNTRY}
              options={countriesOptions}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.countryPlaceholder)}
            />
          </FormRow>
        </FormInputGroup>
      )}

      {currency === CURRENCY_VALUES[SupportedCurrencies.Usd] && (
        <FormInputGroup
          groupLabel={formatText(BANK_DETAILS_FORM_MSG.bankAccountLabel)}
          groupName="bankAccount.usd"
          names={[
            BankDetailsFields.ACCOUNT_NUMBER,
            BankDetailsFields.ROUTING_NUMBER,
          ]}
          getErrorMessage={handleGroupErrorMessage}
        >
          <FormRow>
            <FormInput
              shouldSkipRequiredErrorMessage
              name={BankDetailsFields.ACCOUNT_NUMBER}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.accountNumberLabel)}
            />
          </FormRow>
          <FormRow>
            <FormInput
              shouldSkipRequiredErrorMessage
              name={BankDetailsFields.ROUTING_NUMBER}
              placeholder={formatText(BANK_DETAILS_FORM_MSG.routingNumberLabel)}
            />
          </FormRow>
        </FormInputGroup>
      )}
    </>
  );
};

AccountDetailsInputs.displayName = displayName;

export { AccountDetailsInputs };
