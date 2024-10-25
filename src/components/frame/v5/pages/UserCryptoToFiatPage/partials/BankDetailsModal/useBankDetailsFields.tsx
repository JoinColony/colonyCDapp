import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { toast } from 'react-toastify';

import { CURRENCY_VALUES } from '~frame/v5/pages/UserCryptoToFiatPage/constants.ts';
import { type BankDetailsFormValues } from '~frame/v5/pages/UserCryptoToFiatPage/types.ts';
import {
  CheckKycStatusDocument,
  SupportedCurrencies,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
} from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { type BridgeBankAccount } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import { SEPARATOR_REGEX } from '../BankDetailsForm/constants.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.BankDetailsModal';

// eslint-disable-next-line react-refresh/only-export-components
const MSG = defineMessages({
  bankDetailsConfirmed: {
    id: `${displayName}.bankDetailsConfirmed`,
    defaultMessage: 'Bank details confirmed',
  },
  bankDetailsTitleSuccess: {
    id: `${displayName}.bankDetailsTitleSuccess`,
    defaultMessage: 'Bank details confirmed',
  },
  bankDetailsDescriptionSuccess: {
    id: `${displayName}.bankDetailsDescriptionSuccess`,
    defaultMessage: 'Your information has been added successfully',
  },
  bankDetailsTitleError: {
    id: `${displayName}.bankDetailsTitleError`,
    defaultMessage: 'Something went wrong',
  },
  bankDetailsDescriptionError: {
    id: `${displayName}.bankDetailsDescriptionError`,
    defaultMessage: 'Your bank details could not be updated at this time',
  },
});

interface UseBankDetailsParams {
  data?: BridgeBankAccount | null;
  onClose: () => void;
}

export const useBankDetailsFields = ({
  onClose,
  data,
}: UseBankDetailsParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showContactDetailsForm, setShowContactDetailsForm] = useState(false);
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
    setIsLoading(true);
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
              account_number: iban.replace(SEPARATOR_REGEX, ''),
              bic: swift.replace(SEPARATOR_REGEX, ''),
              country,
            }
          : undefined,
      usAccount:
        currency === CURRENCY_VALUES[SupportedCurrencies.Usd]
          ? {
              // eslint-disable-next-line camelcase
              account_number: accountNumber.replace(SEPARATOR_REGEX, ''),
              // eslint-disable-next-line camelcase
              routing_number: routingNumber.replace(SEPARATOR_REGEX, ''),
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

    try {
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

      if (!isSuccess) throw new Error();

      toast.success(
        <Toast
          type="success"
          title={formatText(MSG.bankDetailsTitleSuccess)}
          description={formatText(MSG.bankDetailsDescriptionSuccess)}
        />,
      );

      onClose();
      setShowContactDetailsForm(false);
    } catch (e) {
      toast.error(
        <Toast
          type="error"
          title={formatText(MSG.bankDetailsTitleError)}
          description={formatText(MSG.bankDetailsDescriptionError)}
        />,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFirstStep = async (values: BankDetailsFormValues) => {
    if (values.currency !== CURRENCY_VALUES[SupportedCurrencies.Usd]) {
      handleSubmitForm(values);
    } else {
      setBankDetailsFields({ ...values });
      setShowContactDetailsForm(true);
    }
  };

  const handleSubmitSecondStep = async (values: BankDetailsFormValues) => {
    handleSubmitForm({ ...bankDetailsFields, ...values });
  };

  return {
    isLoading,
    bankDetailsFields,
    showContactDetailsForm,
    handleSubmitFirstStep,
    handleSubmitSecondStep,
  };
};
