import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';

import PendingReputation from './partials/PendingReputation/PendingReputation.tsx';
import TotalReputation from './partials/TotalReputation/TotalReputation.tsx';

const displayName = 'common.Extensions.UserHub.partials.ReputationTab';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Reputation',
  },
});

const ReputationTab = () => {
  const { formatMessage } = useIntl();
  const {
    colony: { colonyAddress, nativeToken },
  } = useColonyContext();
  const { wallet } = useAppContext();

  if (!wallet) {
    return null;
  }

  return (
    <div className="p-6">
      <h5 className="mb-6 heading-5 sm:mb-4">{formatMessage(MSG.title)}</h5>
      <TotalReputation
        colonyAddress={colonyAddress}
        wallet={wallet}
        nativeToken={nativeToken}
        className="mb-6 border-b border-gray-200 pb-6"
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
