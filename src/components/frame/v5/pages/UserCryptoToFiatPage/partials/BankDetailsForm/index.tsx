/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, type FC, type PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { type CountryData, getCountries } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';

import { CountrySelect } from '../CountrySelect.tsx';
import { FormInput } from '../FormInput.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

const FormRow: FC<PropsWithChildren> = ({ children }) => {
  return <div className="py-1">{children}</div>;
};

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.BankDetailsForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Bank details',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      'Complete your bank, and currency information to receive USDC payments to your bank account.',
  },
  cancelButtonTitle: {
    id: `${displayName}.cancelButtonTitle`,
    defaultMessage: 'Cancel',
  },
  proceedButtonTitle: {
    id: `${displayName}.proceedButtonTitle`,
    defaultMessage: 'Submit details',
  },
  accountOwnerNameLabel: {
    id: `${displayName}.accountOwnerNameLabel`,
    defaultMessage: 'Account owner name',
  },
  accountOwnerNamePlaceholder: {
    id: `${displayName}.accountOwnerNamePlaceholder`,
    defaultMessage: 'Full name',
  },
  bankNameabel: {
    id: `${displayName}.bankNameabel`,
    defaultMessage: 'Bank name',
  },
  bankNamePlaceholder: {
    id: `${displayName}.bankNamePlaceholder`,
    defaultMessage: 'Bank name',
  },
  payoutCurrencyLabel: {
    id: `${displayName}.payoutCurrencyLabel`,
    defaultMessage: 'Payout currency',
  },
  payoutCurrencyPlaceholder: {
    id: `${displayName}.payoutCurrencyPlaceholder`,
    defaultMessage: 'Payout currency',
  },
  countryLabel: {
    id: `${displayName}.countryLabel`,
    defaultMessage: 'Country',
  },
});

export const BankDetailsForm: FC<BankDetailsFormProps> = ({
  onSubmit,
  onClose,
}) => {
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
      <ModalHeading title={MSG.title} subtitle={MSG.subtitle} />
      <Form onSubmit={onSubmit} className="flex flex-col gap-3">
        <FormRow>
          <FormInput
            name="account-owner"
            label={formatText(MSG.accountOwnerNameLabel)}
            placeholder={formatText(MSG.accountOwnerNamePlaceholder)}
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="bank-name"
            label={formatText(MSG.bankNameabel)}
            placeholder={formatText(MSG.bankNamePlaceholder)}
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="currency"
            label={formatText(MSG.payoutCurrencyLabel)}
            placeholder={formatText(MSG.payoutCurrencyPlaceholder)}
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
            labelMessage={formatText(MSG.countryLabel)}
            onChange={(value) => setSelectedCountry(value as any)}
          />
        </FormRow>
        <ModalFormCTAButtons
          cancelButton={{ title: MSG.cancelButtonTitle, onClick: onClose }}
          proceedButton={{ title: MSG.proceedButtonTitle }}
          className="mt-4"
        />
      </Form>
    </div>
  );
};
