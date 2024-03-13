import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { type PaymentBuilderFormValues } from '../../forms/PaymentBuilderForm/hooks.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.PaymentBuilderDescription';

export const PaymentBuilderDescription = () => {
  const formValues = useFormContext<PaymentBuilderFormValues>().getValues();
  const { payments } = formValues;

  if (!payments?.length) {
    return (
      <FormattedMessage
        id="expenditure.description.placeholder"
        values={{
          initiator: <CurrentUser />,
        }}
      />
    );
  }

  const paymentsTokensAndRecipients = payments.reduce(
    (
      result: {
        recipients: string[];
        tokens: string[];
      },
      payment,
    ) => {
      const { recipient, tokenAddress = '' } = payment;

      if (
        typeof tokenAddress === 'string' &&
        !result.tokens.includes(tokenAddress)
      ) {
        result.tokens.push(tokenAddress);
      }

      if (
        typeof recipient === 'string' &&
        !result.recipients.includes(recipient)
      ) {
        result.recipients.push(recipient);
      }

      return result;
    },
    {
      tokens: [],
      recipients: [],
    },
  );

  return (
    <FormattedMessage
      id="expenditure.description"
      values={{
        recipientsNumber: paymentsTokensAndRecipients.recipients.length,
        tokensNumber: paymentsTokensAndRecipients.tokens.length,
        initiator: <CurrentUser />,
      }}
    />
  );
};

PaymentBuilderDescription.displayName = displayName;
export default PaymentBuilderDescription;
