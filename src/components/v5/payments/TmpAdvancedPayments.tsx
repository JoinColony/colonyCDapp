import { Id } from '@colony/colony-js';
import React, { useState } from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux';
import { type CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';
import { ActionButton } from '~v5/shared/Button/index.ts';

const TmpAdvancedPayments = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const { networkInverseFee } = useNetworkInverseFee();

  const [tokenId, settokenId] = useState('');
  const [decimalAmount, setdecimalAmount] = useState('');
  const [transactionAmount, settransactionAmount] = useState('');

  const tokenDecimalAmount = parseFloat(decimalAmount);

  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  if (!rootDomain) {
    return null;
  }

  const createExpenditurePayload: CreateExpenditurePayload = {
    payouts: [
      {
        amount: transactionAmount,
        tokenAddress: tokenId,
        recipientAddress: user?.walletAddress ?? '',
        claimDelay: 0,
      },
    ],
    colony,
    createdInDomain: rootDomain,
    fundFromDomainId: 1,
    networkInverseFee: networkInverseFee ?? '0',
    tokenDecimals: tokenDecimalAmount,
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4">
        <ActionButton
          actionType={ActionTypes.EXPENDITURE_CREATE}
          values={createExpenditurePayload}
        >
          Create expenditure
        </ActionButton>
      </div>
      <div className="flex gap-4">
        <InputBase
          onChange={(e) => settokenId(e.currentTarget.value)}
          placeholder="Token Address"
        />
        <InputBase
          onChange={(e) => setdecimalAmount(e.currentTarget.value)}
          placeholder="Token Decimals"
        />
        <InputBase
          onChange={(e) => settransactionAmount(e.currentTarget.value)}
          placeholder="Transaction Amount"
        />
      </div>
    </div>
  );
};

export default TmpAdvancedPayments;
