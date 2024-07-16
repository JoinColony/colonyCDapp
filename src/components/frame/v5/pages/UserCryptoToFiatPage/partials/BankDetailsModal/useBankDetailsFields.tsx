import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { toast } from 'react-toastify';

import {
  SupportedCurrencies,
  useCreateBankAccountMutation,
  type BridgeXyzBankAccount,
} from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { formatText } from '~utils/intl.ts';

import { CURRENCY_VALUES } from '../../constants.ts';
import { type BankDetailsFormValues } from '../../types.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.BankDetailsModal';

// eslint-disable-next-line react-refresh/only-export-components
const MSG = defineMessages({
  bankDetailsConfirmed: {
    id: `${displayName}.bankDetailsConfirmed`,
    defaultMessage: 'Bank details confirmed',
  },
  bankInfoAddeddSuccessfully: {
    id: `${displayName}.bankInfoAddeddSuccessfully`,
    defaultMessage: 'Your information has been added successfully',
  },
  bankDetailsError: {
    id: `${displayName}.bankDetailsError`,
    defaultMessage: 'Something went wrong :(',
  },
});

interface UseBankDetailsParams {
  data?: Partial<BridgeXyzBankAccount>;
  onClose: () => void;
  redirectToSecondTab: () => void;
}
export const useBankDetailsFields = ({
  onClose,
  redirectToSecondTab,
  data,
}: UseBankDetailsParams) => {
  const [createBankAccount] = useCreateBankAccountMutation();

  const [bankDetailsFields, setBankDetailsFields] =
    useState<BankDetailsFormValues>({
      currency: data?.currency ?? '',
      bankName: data?.bankName ?? '',
      firstName: '',
      lastName: '',
      accountOwner: data?.accountOwner ?? '',
      iban: '',
      swift: '',
      country: '',
      accountNumber: '',
      routingNumber: data?.usAccount?.routingNumber ?? '',
      address1: '',
      address2: '',
      postcode: '',
      city: '',
      state: '',
    });

  const handleSubmitForm = async (variables) => {
    const result = await createBankAccount({
      variables,
    });

    if (result.data?.bridgeXYZMutation?.success) {
      toast.success(
        <Toast
          type="success"
          title={formatText(MSG.bankDetailsConfirmed)}
          description={formatText(MSG.bankInfoAddeddSuccessfully)}
        />,
      );

      onClose();
    } else {
      toast.error(
        <Toast type="error" title={formatText(MSG.bankDetailsError)} />,
      );
    }
  };

  const handleSubmitFirstStep = async (values) => {
    const {
      currency,
      bankName,
      accountOwner,
      iban,
      swift,
      country,
      accountNumber,
      routingNumber,
    } = values;

    const [firstName, lastName] = accountOwner.split(' ');

    if (currency !== CURRENCY_VALUES[SupportedCurrencies.Usd]) {
      handleSubmitForm({
        firstName,
        lastName,
        currency,
        bankName,
        iban: {
          // eslint-disable-next-line camelcase
          account_number: iban,
          bic: swift,
          country,
        },
      });
    } else {
      setBankDetailsFields((prev) => ({
        ...prev,
        firstName,
        lastName,
        currency,
        bankName,
        accountNumber,
        routingNumber,
      }));
      redirectToSecondTab();
    }
  };

  const handleSubmitSecondStep = async ({
    address1,
    address2,
    city,
    postcode,
    state,
    country,
  }) => {
    const {
      currency,
      bankName,
      accountNumber,
      routingNumber,
      firstName,
      lastName,
    } = bankDetailsFields;

    handleSubmitForm({
      currency,
      bankName,
      firstName,
      lastName,
      usAccount: {
        // eslint-disable-next-line camelcase
        account_number: accountNumber,
        // eslint-disable-next-line camelcase
        routing_number: routingNumber,
      },
      address: {
        city,
        country,
        // eslint-disable-next-line camelcase
        postal_code: postcode,
        // eslint-disable-next-line camelcase
        street_line_1: address1,
        // eslint-disable-next-line camelcase
        street_line_2: address2,
        state,
      },
    });
  };

  return { bankDetailsFields, handleSubmitFirstStep, handleSubmitSecondStep };
};
