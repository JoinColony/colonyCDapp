import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { ExtendedColonyActionType } from '~types/actions.ts';

import { type SplitPaymentFormValues } from '../../forms/SplitPaymentForm/hooks.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.SplitPaymentDescription';

const MSG = defineMessages({
  placeholder: {
    id: `${displayName}.placeholder`,
    defaultMessage: 'Split Payment by {initiator}',
  },
});

export const SplitPaymentDescription = () => {
  const { colony } = useColonyContext();
  const formValues = useFormContext<SplitPaymentFormValues>().getValues();
  const { amount, tokenAddress } = formValues;

  const matchingColonyToken = colony.tokens?.items.find(
    (colonyToken) => colonyToken?.token?.tokenAddress === tokenAddress,
  );

  if (!amount) {
    return (
      <FormattedMessage
        {...MSG.placeholder}
        values={{
          initiator: <CurrentUser />,
        }}
      />
    );
  }

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ExtendedColonyActionType.SplitPayment,
        splitAmount: <Numeral value={amount} />,
        tokenSymbol: matchingColonyToken?.token.symbol,
        initiator: <CurrentUser />,
      }}
    />
  );
};

SplitPaymentDescription.displayName = displayName;
export default SplitPaymentDescription;
