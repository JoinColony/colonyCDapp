import { Extension, Id } from '@colony/colony-js';
import React, { useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type Expenditure, useGetExpenditureQuery } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExpenditureStaking from '~hooks/useExpenditureStaking.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux';
import { type ClaimExpenditurePayload } from '~redux/sagas/expenditures/claimExpenditure.ts';
import { type CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure.ts';
import { type CreateStakedExpenditurePayload } from '~redux/sagas/expenditures/createStakedExpenditure.ts';
import { type FinalizeExpenditurePayload } from '~redux/sagas/expenditures/finalizeExpenditure.ts';
import { type FundExpenditurePayload } from '~redux/sagas/expenditures/fundExpenditure.ts';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import { type ReclaimExpenditureStakePayload } from '~redux/sagas/expenditures/reclaimExpenditureStake.ts';
import { type ReleaseExpenditureStageMotionPayload } from '~redux/sagas/motions/expenditures/releaseExpenditureStageMotion.ts';
import { type CancelStakedExpenditurePayload } from '~redux/types/actions/expenditures.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import { ActionButton } from '~v5/shared/Button/index.ts';

const TmpAdvancedPayments = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { extensionData } = useExtensionData(Extension.StagedExpenditure);
  const { networkInverseFee = '0' } = useNetworkInverseFee();

  const [tokenId, setTokenId] = useState('');
  const [decimalAmount, setDecimalAmount] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [expenditureId, setExpenditureId] = useState('');
  const [releaseStage, setReleaseStage] = useState('');

  const tokenDecimalAmount = parseFloat(decimalAmount);

  const { stakeAmount = '0', stakedExpenditureAddress = '' } =
    useExpenditureStaking();

  const { data, refetch } = useGetExpenditureQuery({
    variables: {
      expenditureId: getExpenditureDatabaseId(
        colony.colonyAddress,
        Number(expenditureId),
      ),
    },
    skip: Number.isNaN(expenditureId),
    fetchPolicy: 'network-only',
  });
  const expenditure = data?.getExpenditure;

  const createStakedExpenditure = useAsyncFunction({
    submit: ActionTypes.STAKED_EXPENDITURE_CREATE,
    error: ActionTypes.STAKED_EXPENDITURE_CREATE_ERROR,
    success: ActionTypes.STAKED_EXPENDITURE_CREATE_SUCCESS,
  });
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
  const reclaimExpenditureStake = useAsyncFunction({
    submit: ActionTypes.RECLAIM_EXPENDITURE_STAKE,
    error: ActionTypes.RECLAIM_EXPENDITURE_STAKE_ERROR,
    success: ActionTypes.RECLAIM_EXPENDITURE_STAKE_SUCCESS,
  });
  const cancelStakedExpenditure = useAsyncFunction({
    submit: ActionTypes.STAKED_EXPENDITURE_CANCEL,
    error: ActionTypes.STAKED_EXPENDITURE_CANCEL_ERROR,
    success: ActionTypes.STAKED_EXPENDITURE_CANCEL_SUCCESS,
  });
  const releaseExpenditureStageMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE,
    error: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_ERROR,
    success: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_SUCCESS,
  });

  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  if (!rootDomain) {
    return null;
  }

  const payouts = [
    {
      amount: transactionAmount,
      tokenAddress: tokenId,
      recipientAddress: user?.walletAddress ?? '',
      claimDelay: 0,
      tokenDecimals: tokenDecimalAmount,
    },
  ];

  const createExpenditurePayload: CreateExpenditurePayload = {
    payouts,
    colonyAddress: colony.colonyAddress,
    createdInDomain: rootDomain,
    fundFromDomainId: 1,
    networkInverseFee,
    annotationMessage: 'expenditure annotation',
  };

  const createStagedExpenditurePayload: CreateExpenditurePayload = {
    payouts,
    colonyAddress: colony.colonyAddress,
    createdInDomain: rootDomain,
    fundFromDomainId: 1,
    networkInverseFee,
    isStaged: true,
    stages: [
      {
        name: 'stage one',
        amount: '1',
        tokenAddress: colony.nativeToken.tokenAddress,
      },
      {
        name: 'stage two',
        amount: '1',
        tokenAddress: colony.nativeToken.tokenAddress,
      },
    ],
  };

  const handleLockExpenditure = async () => {
    const payload: LockExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      nativeExpenditureId: Number(expenditureId),
    };

    await lockExpenditure(payload);
  };

  const handleFundExpenditure = async () => {
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
      nativeExpenditureId: Number(expenditureId),
    };

    await finalizeExpenditure(finalizePayload);

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

  const handleCreateStakedExpenditure = async () => {
    if (!stakeAmount || !stakedExpenditureAddress) {
      return;
    }

    const payload: CreateStakedExpenditurePayload = {
      payouts,
      colonyAddress: colony.colonyAddress,
      createdInDomain: rootDomain,
      fundFromDomainId: 1,
      stakeAmount,
      stakedExpenditureAddress,
      networkInverseFee,
    };

    await createStakedExpenditure(payload);
  };

  const handleReclaimStake = async () => {
    const payload: ReclaimExpenditureStakePayload = {
      colonyAddress: colony.colonyAddress,
      nativeExpenditureId: Number(expenditureId),
    };

    await reclaimExpenditureStake(payload);
  };

  const handleCancelAndPunish = async () => {
    if (!expenditure) {
      return;
    }

    const payload: CancelStakedExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      expenditure,
      stakedExpenditureAddress,
      shouldPunish: true,
    };

    await cancelStakedExpenditure(payload);
  };

  const handleReleaseExpenditureStageMotion = async () => {
    if (!expenditure) {
      return;
    }

    if (!releaseStage) {
      return;
    }

    const stagedExpenditureAddress =
      extensionData && isInstalledExtensionData(extensionData)
        ? extensionData.address
        : undefined;

    if (!stagedExpenditureAddress) {
      return;
    }

    const payload: ReleaseExpenditureStageMotionPayload = {
      colonyAddress: colony.colonyAddress,
      colonyName: colony.name,
      expenditure: expenditure as Expenditure,
      slotId: Number(releaseStage),
      motionDomainId: expenditure.nativeDomainId,
      tokenAddresses: [colony.nativeToken.tokenAddress],
      stagedExpenditureAddress: stagedExpenditureAddress || '',
    };

    await releaseExpenditureStageMotion(payload);
  };

  return (
    <div className="flex flex-col gap-8">
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
        <ActionButton
          actionType={ActionTypes.EXPENDITURE_CREATE}
          values={createExpenditurePayload}
        >
          Create expenditure
        </ActionButton>
        <Button onClick={handleCreateStakedExpenditure}>
          Create staked expenditure
        </Button>
        <ActionButton
          actionType={ActionTypes.EXPENDITURE_CREATE}
          values={createStagedExpenditurePayload}
        >
          Create staged expenditure
        </ActionButton>
      </div>
      <div className="flex gap-4">
        <InputBase
          value={expenditureId}
          onChange={(e) => setExpenditureId(e.currentTarget.value)}
          placeholder="Expenditure ID"
        />
        <Button onClick={handleLockExpenditure}>Lock expenditure</Button>
        <Button onClick={handleFundExpenditure} disabled={!expenditure}>
          Fund expenditure
        </Button>
        <Button onClick={handleFinalizeExpenditure}>
          Finalize expenditure
        </Button>
        <Button onClick={handleReclaimStake}>Reclaim stake</Button>
        <Button onClick={handleCancelAndPunish} disabled={!expenditure}>
          Cancel and punish
        </Button>
      </div>
      <div className="flex gap-4">
        <InputBase
          value={releaseStage}
          onChange={(e) => setReleaseStage(e.currentTarget.value)}
          placeholder="Stage to release"
        />
        <Button onClick={() => refetch()}>Refetch expenditure</Button>
        <Button
          onClick={handleReleaseExpenditureStageMotion}
          disabled={!expenditure}
        >
          Release Expenditure Stage Motion
        </Button>
      </div>
    </div>
  );
};

export default TmpAdvancedPayments;
