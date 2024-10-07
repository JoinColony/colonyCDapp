import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~types/graphql.ts';
import { type PaymentBuilderFormValues } from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/hooks.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.PaymentBuilderDescription';

export const PaymentBuilderDescription = () => {
  const formValues = useFormContext<PaymentBuilderFormValues>().getValues();
  const { payments } = formValues;

  const isPaymentEmpty =
    (payments?.length === 1 && !payments?.[0].recipient) || !payments?.length;

  if (isPaymentEmpty) {
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
        tokens: string[];
      },
      payment,
    ) => {
      const { tokenAddress = '' } = payment;

      if (
        typeof tokenAddress === 'string' &&
        !result.tokens.includes(tokenAddress)
      ) {
        result.tokens.push(tokenAddress);
      }

      return result;
    },
    {
      tokens: [],
    },
  );

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.CreateExpenditure,
        recipientsNumber: payments.length,
        tokensNumber: paymentsTokensAndRecipients.tokens.length,
        initiator: <CurrentUser />,
      }}
    />
  );
};

PaymentBuilderDescription.displayName = displayName;
export default PaymentBuilderDescription;
