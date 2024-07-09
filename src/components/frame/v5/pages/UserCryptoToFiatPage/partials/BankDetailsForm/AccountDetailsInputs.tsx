import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { getCountries } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';

const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.BankDetailsForm.AccountDetailsInputs';

const MSG = defineMessages({
  countryLabel: {
    id: `${displayName}.countryLabel`,
    defaultMessage: 'Country',
  },
});

export const AccountDetailsInputs = () => {
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
      {currency === 'eur' && (
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

      {currency === 'usd' && (
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

          <div className="mb-1.5 text-md font-medium text-gray-700">Adress</div>

          <FormRow>
            <FormSelect
              name="country"
              options={countriesOptions}
              labelMessage={formatText(MSG.countryLabel)}
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
              <div className="mr-1 flex-1">
                <FormInput name="city" placeholder="City" />
              </div>

              {/* {!!selectedCountry?.subdivisions?.length && (
                <div className="ml-1 flex-1">
                  <FormSelect
                    name="subdivisions"
                    options={selectedCountry?.subdivisions.map((item) => ({
                      value: item.code,
                      label: item.name,
                    }))}
                  />
                </div>
              )} */}
            </div>
          </FormRow>

          <FormRow>
            <FormInput name="postcode" placeholder="Postcode" />
          </FormRow>
        </>
      )}
    </>
  );
};
