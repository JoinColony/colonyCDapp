import moveDecimal from 'move-decimal-point';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { type MintTokenFormValues } from '~v5/common/ActionSidebar/partials/forms/MintTokenForm/consts.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.MintTokensDescription';

export const MintTokensDescription = () => {
  const formValues = useFormContext<MintTokenFormValues>().getValues();
  const { amount } = formValues;
  const {
    colony: { nativeToken },
  } = useColonyContext();

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.MintTokens,
        tokenSymbol: amount
          ? nativeToken.symbol
          : formatText({
              id: 'actionSidebar.metadataDescription.nativeTokens',
            }),
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
      }}
    />
  );
};

MintTokensDescription.displayName = displayName;
export default MintTokensDescription;
