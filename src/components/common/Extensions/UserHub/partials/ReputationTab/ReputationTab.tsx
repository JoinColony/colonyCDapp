import React, { FC } from 'react';

import { useAppContext, useColonyContext } from '~hooks';
import { formatText } from '~utils/intl';

import Balance from './partials/Balance';
import PendingReputation from './partials/PendingReputation';
import TotalReputation from './partials/TotalReputation';
import { ReputationTabProps } from './types';

const displayName = 'common.Extensions.UserHub.partials.ReputationTab';

const ReputationTab: FC<ReputationTabProps> = ({ onTabChange }) => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();

  if (!colony || !wallet) {
    return null;
  }

  const { colonyAddress, nativeToken } = colony;

  // @TODO: handle empty state <EmptyContent />
  return (
    <div>
      <p className="heading-5 mb-6 md:mb-4">
        {formatText({ id: 'reputation' })}
      </p>
      <Balance
        nativeToken={nativeToken}
        wallet={wallet}
        className="mb-6 pb-6 border-b border-b-gray-200"
        onTabChange={onTabChange}
      />
      <TotalReputation
        colonyAddress={colonyAddress}
        wallet={wallet}
        className="mb-6 pb-6 border-b border-b-gray-200"
      />
      <PendingReputation
        colonyAddress={colonyAddress}
        wallet={wallet}
        nativeToken={nativeToken}
      />
    </div>
  );
};

ReputationTab.displayName = displayName;

export default ReputationTab;
