import { Id } from '@colony/colony-js';
import React, { useState } from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { ExpenditureDecisionMethod, useGetExpenditureLazyQuery } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux';
import { type ClaimExpenditurePayload } from '~redux/sagas/expenditures/claimExpenditure.ts';
import { type CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure.ts';
import { type FinalizeExpenditurePayload } from '~redux/sagas/expenditures/finalizeExpenditure.ts';
import { type FundExpenditurePayload } from '~redux/sagas/expenditures/fundExpenditure.ts';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import { ActionButton } from '~v5/shared/Button/index.ts';

const TmpAdvancedPayments = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { networkInverseFee } = useNetworkInverseFee();

  const [tokenId, setTokenId] = useState('');
  const [decimalAmount, setDecimalAmount] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');

  const tokenDecimalAmount = parseFloat(decimalAmount);
  const [getExpenditure] = useGetExpenditureLazyQuery();

  const [expenditureId, setExpenditureId] = useState('');

  const lockExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_LOCK,
    error: ActionTypes.EXPENDITURE_LOCK_ERROR,
    success: ActionTypes.EXPENDITURE_LOCK_SUCCESS,
  });
  const fundExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_FUND,
    error: ActionTypes.EXPENDITURE_FUND_ERROR,
    success: ActionTypes.EXPENDITURE_FUND_SUCCESS,
  });
  const finalizeExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_FINALIZE,
    error: ActionTypes.EXPENDITURE_FINALIZE_ERROR,
    success: ActionTypes.EXPENDITURE_FINALIZE_SUCCESS,
  });
  const claimExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_CLAIM,
    error: ActionTypes.EXPENDITURE_CLAIM_ERROR,
    success: ActionTypes.EXPENDITURE_CLAIM_SUCCESS,
  });

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
        tokenDecimals: tokenDecimalAmount,
      },
    ],
    colony,
    createdInDomain: rootDomain,
    fundFromDomainId: 1,
    networkInverseFee: networkInverseFee ?? '0',
    decisionMethod: ExpenditureDecisionMethod.Permissions,
  };

  const handleLockExpenditure = async () => {
    const payload: LockExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      colonyName: colony.name,
      nativeExpenditureId: Number(expenditureId),
    };

    await lockExpenditure(payload);
  };

  const handleFundExpenditure = async () => {
    const response = await getExpenditure({
      variables: {
        expenditureId: getExpenditureDatabaseId(
          colony.colonyAddress,
          Number(expenditureId),
        ),
      },
    });
    const expenditure = response.data?.getExpenditure;

    if (!expenditure) {
      return;
    }

    const payload: FundExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      expenditure,
      fromDomainFundingPotId: 1,
    };

    await fundExpenditure(payload);
  };

  const handleFinalizeExpenditure = async () => {
    const finalizePayload: FinalizeExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      colonyName: colony.name,
      nativeExpenditureId: Number(expenditureId),
    };

    await finalizeExpenditure(finalizePayload);

    const response = await getExpenditure({
      variables: {
        expenditureId: getExpenditureDatabaseId(
          colony.colonyAddress,
          Number(expenditureId),
        ),
      },
    });
    const expenditure = response.data?.getExpenditure;

    if (!expenditure) {
      return;
    }

    const claimPayload: ClaimExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      claimableSlots: expenditure.slots,
      nativeExpenditureId: Number(expenditureId),
    };
    await claimExpenditure(claimPayload);
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
        <Button onClick={handleLockExpenditure}>Lock expenditure</Button>
        <Button onClick={handleFundExpenditure}>Fund expenditure</Button>
        <Button onClick={handleFinalizeExpenditure}>
          Finalize expenditure
        </Button>
      </div>
      <div className="flex gap-4">
        <InputBase
          onChange={(e) => setTokenId(e.currentTarget.value)}
          placeholder="Token Address"
        />
        <InputBase
          onChange={(e) => setDecimalAmount(e.currentTarget.value)}
          placeholder="Token Decimals"
        />
        <InputBase
          onChange={(e) => setTransactionAmount(e.currentTarget.value)}
          placeholder="Transaction Amount"
        />
        <InputBase
          value={expenditureId}
          onChange={(e) => setExpenditureId(e.currentTarget.value)}
          placeholder="Expenditure ID"
        />
      </div>
    </div>
  );
};

export default TmpAdvancedPayments;
