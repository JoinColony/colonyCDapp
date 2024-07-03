import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { AccountDetailsInputs } from './AccountDetailsInputs.tsx';
import { CURRENCY } from './constants.ts';
import { validationSchema } from './validation.ts';

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
  return (
    <div>
      <ModalHeading title={MSG.title} subtitle={MSG.subtitle} />
      <Form
        onSubmit={onSubmit}
        className="flex flex-col gap-3"
        validationSchema={validationSchema}
        mode="onSubmit"
      >
        <FormRow>
          <FormInput
            name="accountOwner"
            shouldFocus
            label={formatText(MSG.accountOwnerNameLabel)}
            placeholder={formatText(MSG.accountOwnerNamePlaceholder)}
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="bankName"
            label={formatText(MSG.bankNameabel)}
            placeholder={formatText(MSG.bankNamePlaceholder)}
          />
        </FormRow>
        <FormRow>
          <FormSelect
            name="currency"
            labelMessage={formatText(MSG.payoutCurrencyLabel)}
            options={CURRENCY}
          />
        </FormRow>

        <AccountDetailsInputs />
        <ModalFormCTAButtons
          cancelButton={{ title: MSG.cancelButtonTitle, onClick: onClose }}
          proceedButton={{ title: MSG.proceedButtonTitle }}
          className="mt-4"
        />
      </Form>
    </div>
  );
};
