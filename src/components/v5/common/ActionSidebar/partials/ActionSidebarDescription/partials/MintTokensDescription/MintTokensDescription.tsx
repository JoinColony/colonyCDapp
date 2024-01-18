import moveDecimal from 'move-decimal-point';
import React from 'react';

import { ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import CurrentUser from '../CurrentUser/CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.MintTokensDescription';

interface MintTokensDescriptionProps {
  amount?: number;
}
export const MintTokensDescription = ({
  amount,
}: MintTokensDescriptionProps) => {
  const {
    colony: { nativeToken },
  } = useColonyContext();

  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.MintTokens,
          tokenSymbol: amount ? nativeToken.symbol : undefined,
          amount: amount ? (
            <Numeral
              value={moveDecimal(
                amount.toString(),
                getTokenDecimalsWithFallback(nativeToken.decimals),
              )}
              decimals={getTokenDecimalsWithFallback(nativeToken.decimals)}
            />
          ) : undefined,
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

MintTokensDescription.displayName = displayName;
export default MintTokensDescription;
