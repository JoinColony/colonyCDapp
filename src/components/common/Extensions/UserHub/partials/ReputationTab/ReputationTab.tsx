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
  const { colonyAddress, nativeToken } = colony || {};

  return (
    <div className="bg-base-white">
      <div className="font-semibold text-lg text-gray-900 mb-4">{formatMessage({ id: 'reputation.tab.title' })}</div>
      <Balance nativeToken={nativeToken} wallet={wallet} />
      <TotalReputation colonyAddress={colonyAddress} wallet={wallet} />
      <PendingReputation />
    </div>
  );
};

ReputationTab.displayName = displayName;

export default ReputationTab;
