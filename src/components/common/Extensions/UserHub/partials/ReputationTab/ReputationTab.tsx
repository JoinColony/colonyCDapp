import React from 'react';
import { useIntl } from 'react-intl';

import { useAppContext, useColonyContext } from '~hooks';

import Balance from './partials/Balance';
import PendingReputation from './partials/PendingReputation';
import TotalReputation from './partials/TotalReputation';
import { ReputationTabProps } from './types';

const displayName = 'common.Extensions.UserHub.partials.ReputationTab';

const ReputationTab = ({ onTabChange }: ReputationTabProps) => {
  const { formatMessage } = useIntl();
  const {
    colony: { colonyAddress, nativeToken },
  } = useColonyContext();
  const { wallet } = useAppContext();

  if (!wallet) {
    return null;
  }

  // @TODO: handle empty state <EmptyContent />
  return (
    <div>
      <p className="heading-5 mb-6 md:mb-4">
        {formatMessage({ id: 'userHub.reputation' })}
      </p>
      <Balance
        nativeToken={nativeToken}
        wallet={wallet}
        onTabChange={onTabChange}
      />
      <TotalReputation colonyAddress={colonyAddress} wallet={wallet} />
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
