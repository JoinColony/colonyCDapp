import moveDecimal from 'move-decimal-point';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { SimplePaymentFormValues } from '../../forms/SimplePaymentForm/hooks';

import CurrentUser from './CurrentUser';
import RecipientUser from './RecipientUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.SimplePaymentDescription';

export const SimplePaymentDescription = () => {
  const formValues = useFormContext<SimplePaymentFormValues>().getValues();
  const { colony } = useColonyContext();
  const { amount: { amount, tokenAddress } = {}, recipient } = formValues;

  const { nativeToken } = colony;
  const matchingColonyToken = colony.tokens?.items.find(
    (colonyToken) => colonyToken?.token?.tokenAddress === tokenAddress,
  );

  const recipientUser = recipient ? (
    <RecipientUser userAddress={recipient} />
  ) : (
    formatText({
      id: 'actionSidebar.metadataDescription.recipient',
    })
  );

  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
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
        },
      )}
    </>
  );
};

SimplePaymentDescription.displayName = displayName;
export default SimplePaymentDescription;
