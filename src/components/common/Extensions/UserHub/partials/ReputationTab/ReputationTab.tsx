import React from 'react';
import { useIntl } from 'react-intl';

import { useAppContext, useColonyContext } from '~hooks';
import Balance from './partials/Balance';
import PendingReputation from './partials/PendingReputation';
import TotalReputation from './partials/TotalReputation';

const displayName = 'common.Extensions.UserHub.partials.ReputationTab';

const ReputationTab = () => {
  const { formatMessage } = useIntl();
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
        {formatMessage({ id: 'reputation' })}
      </p>
      <Balance nativeToken={nativeToken} wallet={wallet} />
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
