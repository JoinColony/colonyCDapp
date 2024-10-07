import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { CoreAction } from '~actions/index.ts';
import { type PaymentBuilderFormValues } from '~v5/common/ActionSidebar/partials/forms/core/PaymentBuilderForm/hooks.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.PaymentBuilderDescription';

// FIXME: Probably later, but what are these ...Description components and shouldn't they be close to the actual forms????
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
        actionType: CoreAction.CreateExpenditure,
        recipientsNumber: payments.length,
        tokensNumber: paymentsTokensAndRecipients.tokens.length,
        initiator: <CurrentUser />,
      }}
    />
  );
};

PaymentBuilderDescription.displayName = displayName;
export default PaymentBuilderDescription;
