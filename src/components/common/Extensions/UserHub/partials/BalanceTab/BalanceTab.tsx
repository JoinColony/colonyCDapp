import React from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';

import Balance from './partials/Balance.tsx';
import PendingReputation from './partials/PendingReputation/index.ts';
import TotalReputation from './partials/TotalReputation.tsx';
import { type BalanceTabProps } from './types.ts';

const displayName = 'common.Extensions.UserHub.partials.BalanceTab';

const BalanceTab = ({ onTabChange }: BalanceTabProps) => {
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
    <div className="p-6">
      <p className="mb-6 heading-5 md:mb-4">
        {formatMessage({ id: 'userHub.reputation' })}
      </p>
      <Balance
        nativeToken={nativeToken}
        wallet={wallet}
        onTabChange={onTabChange}
      />
      <TotalReputation
        colonyAddress={colonyAddress}
        wallet={wallet}
        nativeToken={nativeToken}
      />
      <PendingReputation
        colonyAddress={colonyAddress}
        wallet={wallet}
        nativeToken={nativeToken}
      />
    </div>
  );
};

BalanceTab.displayName = displayName;

export default BalanceTab;
