import moveDecimal from 'move-decimal-point';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { type SimplePaymentFormValues } from '~v5/common/ActionSidebar/partials/forms/core/SimplePaymentForm/hooks.ts';

import CurrentUser from './CurrentUser.tsx';
import RecipientUser from './RecipientUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.SimplePaymentDescription';

export const SimplePaymentDescription = () => {
  const formValues = useFormContext<SimplePaymentFormValues>().getValues();
  const { colony } = useColonyContext();
  const { amount, tokenAddress, recipientAddress } = formValues;

  const { nativeToken } = colony;
  const matchingColonyToken = colony.tokens?.items.find(
    (colonyToken) => colonyToken?.token?.tokenAddress === tokenAddress,
  );

  const recipientUser = recipientAddress ? (
    <RecipientUser userAddress={recipientAddress} />
  ) : (
    formatText({
      id: 'actionSidebar.metadataDescription.recipient',
    })
  );

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.Payment,
        tokenSymbol: matchingColonyToken
          ? matchingColonyToken.token.symbol
          : formatText({
              id: 'actionSidebar.metadataDescription.tokens',
            }),
        recipient: recipientUser,
        amount: amount ? (
          <Numeral
            value={moveDecimal(
              amount.toString(),
              getTokenDecimalsWithFallback(nativeToken.decimals),
            )}
            decimals={getTokenDecimalsWithFallback(nativeToken.decimals)}
          />
        ) : (
          formatText({
            id: 'actionSidebar.metadataDescription.anAmount',
          })
        ),
        initiator: <CurrentUser />,
      }}
    />
  );
};

SimplePaymentDescription.displayName = displayName;
export default SimplePaymentDescription;
