import React from 'react';
import moveDecimal from 'move-decimal-point';

import { ColonyAction } from '~types';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import AmountRow from '../rows/Amount';
import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';

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
    <div className="flex-grow overflow-y-auto px-6">
      <h3 className="heading-3 mb-2 text-gray-900">{customTitle}</h3>
      <div className="mb-7 text-md">
        Mint {transformedAmount} {action.token?.symbol} by{' '}
        {action.initiatorUser?.profile?.displayName}
      </div>
      <div className="grid grid-cols-[10rem_auto] sm:grid-cols-[12.5rem_auto] gap-y-3 text-md text-gray-900 items-center">
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
      </div>
    </div>
  );
};

MintTokens.displayName = displayName;
export default MintTokens;
