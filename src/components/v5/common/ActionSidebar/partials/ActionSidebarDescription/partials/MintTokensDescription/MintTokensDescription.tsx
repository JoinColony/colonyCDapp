import moveDecimal from 'move-decimal-point';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { MintTokenFormValues } from '../../../forms/MintTokenForm/consts';
import CurrentUser from '../CurrentUser/CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.MintTokensDescription';

export const MintTokensDescription = () => {
  const formValues = useFormContext<MintTokenFormValues>().getValues();
  const { amount: { amount } = {} } = formValues;
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
