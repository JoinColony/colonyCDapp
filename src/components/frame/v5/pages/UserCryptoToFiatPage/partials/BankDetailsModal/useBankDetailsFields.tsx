import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { toast } from 'react-toastify';

import {
  CheckKycStatusDocument,
  SupportedCurrencies,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
} from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { type BridgeBankAccount } from '~types/graphql.ts';
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
  data?: BridgeBankAccount | null;
  onClose: () => void;
  redirectToSecondTab: () => void;
}
export const useBankDetailsFields = ({
  onClose,
  redirectToSecondTab,
  data,
}: UseBankDetailsParams) => {
  const [createBankAccount] = useCreateBankAccountMutation({
    refetchQueries: [CheckKycStatusDocument],
  });
  const [updateBankAccount] = useUpdateBankAccountMutation({
    refetchQueries: [CheckKycStatusDocument],
  });

  const [bankDetailsFields, setBankDetailsFields] =
    useState<BankDetailsFormValues>({
      currency: data?.currency ?? '',
      bankName: data?.bankName ?? '',
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

  const handleSubmitForm = async (values: BankDetailsFormValues) => {
    const {
      bankName,
      accountNumber,
      currency,
      iban,
      swift,
      country,
      accountOwner,
      routingNumber,
      address1,
      address2,
      city,
      state,
      postcode,
    } = values;

    const accountInput = {
      bankName,
      accountOwner,
      currency,
      iban:
        currency === CURRENCY_VALUES[SupportedCurrencies.Eur]
          ? {
              // eslint-disable-next-line camelcase
              account_number: iban,
              bic: swift,
              country,
            }
          : undefined,
      usAccount:
        currency === CURRENCY_VALUES[SupportedCurrencies.Usd]
          ? {
              // eslint-disable-next-line camelcase
              account_number: accountNumber,
              // eslint-disable-next-line camelcase
              routing_number: routingNumber,
            }
          : undefined,
      address:
        currency === CURRENCY_VALUES[SupportedCurrencies.Usd]
          ? {
              city,
              country,
              // eslint-disable-next-line camelcase
              postal_code: postcode,
              // eslint-disable-next-line camelcase
              street_line_1: address1,
              // eslint-disable-next-line camelcase
              street_line_2: address2,
              state,
            }
          : undefined,
    };

    let isSuccess;

    if (!data) {
      const result = await createBankAccount({
        variables: { input: accountInput },
      });
      isSuccess = !!result.data?.bridgeCreateBankAccount?.success;
    } else {
      const result = await updateBankAccount({
        variables: {
          input: {
            id: data.id,
            account: accountInput,
          },
        },
      });
      isSuccess = !!result.data?.bridgeUpdateBankAccount?.success;
    }

    if (isSuccess) {
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

  const handleSubmitFirstStep = async (values: BankDetailsFormValues) => {
    if (values.currency !== CURRENCY_VALUES[SupportedCurrencies.Usd]) {
      handleSubmitForm(values);
    } else {
      setBankDetailsFields({ ...values });
      redirectToSecondTab();
    }
  };

  const handleSubmitSecondStep = async (values: BankDetailsFormValues) => {
    handleSubmitForm({ ...bankDetailsFields, ...values });
  };

  return { bankDetailsFields, handleSubmitFirstStep, handleSubmitSecondStep };
};
