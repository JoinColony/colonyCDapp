import moveDecimal from 'move-decimal-point';
import React from 'react';

import { ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import useUserByAddress from '~hooks/useUserByAddress';
import MaskedAddress from '~shared/MaskedAddress';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import CurrentUser from '../CurrentUser/CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.SimplePaymentDescription';

interface SimplePaymentDescriptionProps {
  amount?: number;
  recipientAddress?: string;
  tokenAddress?: string;
}

export const SimplePaymentDescription = ({
  amount,
  recipientAddress,
  tokenAddress,
}: SimplePaymentDescriptionProps) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony;

  const { error, loading, user } = useUserByAddress(recipientAddress);
  const matchingColonyToken = colony.tokens?.items.find(
    (colonyToken) => colonyToken?.token?.tokenAddress === tokenAddress,
  );

  if (error) {
    return <>{formatText({ id: 'error.message' })}</>;
  }

  const getRecipientText = () => {
    if (loading) {
      return formatText({ id: 'actionSidebar.loading' });
    }

    if (!user) {
      return formatText({
        id: 'actionSidebar.metadataDescription.recipient',
      });
    }

    if (user.profile) {
      return user.profile.displayName;
    }

    return <MaskedAddress address={user.walletAddress} />;
  };

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
          recipient: getRecipientText(),
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
