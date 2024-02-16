import { Id } from '@colony/colony-js';
import React from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux';
import { type CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks/index.ts';
import { ActionButton } from '~v5/shared/Button/index.ts';

const TmpAdvancedPayments = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const { networkInverseFee } = useNetworkInverseFee();

  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  if (!rootDomain) {
    return null;
  }

  const payload: CreateExpenditurePayload = {
    payouts: [
      {
        amount: '10',
        tokenAddress: colony.nativeToken.tokenAddress,
        recipientAddress: user?.walletAddress ?? '',
        claimDelay: 0,
      },
    ],
    colony,
    createdInDomain: rootDomain,
    fundFromDomainId: 1,
    networkInverseFee: networkInverseFee ?? '0',
    decisionMethod: DecisionMethod.Permissions,
  };

  return (
    <ActionButton actionType={ActionTypes.EXPENDITURE_CREATE} values={payload}>
      Create expenditure
    </ActionButton>
  );
};

export default TmpAdvancedPayments;
