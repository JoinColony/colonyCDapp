import moveDecimal from 'move-decimal-point';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { TransferFundsFormValues } from '../../forms/TransferFundsForm/hooks';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.TransferFundsDescription';

export const TransferFundsDescription = () => {
  const {
    colony: { domains, nativeToken, tokens },
  } = useColonyContext();
  const formValues = useFormContext<TransferFundsFormValues>().getValues();

  const { amount: { amount, tokenAddress } = {}, from, to } = formValues;

  const fromDomain = domains?.items.find((domain) => domain?.nativeId === from);
  const toDomain = domains?.items.find((domain) => domain?.nativeId === to);
  const matchingColonyToken = tokens?.items.find(
    (colonyToken) => colonyToken?.token?.tokenAddress === tokenAddress,
  );

  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.MoveFunds,
          fromDomain: fromDomain?.metadata ? fromDomain.metadata.name : '',
          toDomain: toDomain?.metadata ? toDomain.metadata.name : '',
          tokenSymbol: matchingColonyToken
            ? matchingColonyToken.token.symbol
            : formatText({
                id: 'actionSidebar.metadataDescription.tokens',
              }),
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
              id: 'actionSidebar.metadataDescription.funds',
            })
          ),
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

TransferFundsDescription.displayName = displayName;
export default TransferFundsDescription;
