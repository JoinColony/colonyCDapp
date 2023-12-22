import React from 'react';
import moveDecimal from 'move-decimal-point';

import { ColonyAction } from '~types';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import AmountRow from '../rows/Amount';
import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import ActionTypeRow from '../rows/ActionType';
import DescriptionRow from '../rows/Description';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';

const displayName = 'v5.common.CompletedAction.partials.MintTokens';

interface MintTokensProps {
  action: ColonyAction;
}

const MintTokens = ({ action }: MintTokensProps) => {
  const { customTitle = 'Mint Tokens' } = action?.metadata || {};
  const transformedAmount = moveDecimal(
    action.amount || '0',
    -getTokenDecimalsWithFallback(action.token?.decimals),
  );

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        Mint {transformedAmount} {action.token?.symbol} by{' '}
        {action.initiatorUser?.profile?.displayName}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        <AmountRow
          amount={action.amount || '0'}
          token={action.token || undefined}
        />

        <DecisionMethodRow isMotion={action.isMotion || false} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}

        {action.annotation?.message && (
          <DescriptionRow description={action.annotation.message} />
        )}
      </ActionDataGrid>
    </>
  );
};

MintTokens.displayName = displayName;
export default MintTokens;
