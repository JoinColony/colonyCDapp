import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React, { useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useUserTokenBalanceContext } from '~context/UserTokenBalanceContext/UserTokenBalanceContext.ts';
import {
  StreamingPaymentEndCondition,
  useGetExpenditureQuery,
  useGetStreamingPaymentQuery,
} from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import useExpenditureStaking from '~hooks/useExpenditureStaking.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import useStreamingPaymentAmountsLeft from '~hooks/useStreamingPaymentAmountsLeft.ts';
import { ActionTypes } from '~redux';
import { type CancelExpenditurePayload } from '~redux/sagas/expenditures/cancelExpenditure.ts';
import { type ClaimExpenditurePayload } from '~redux/sagas/expenditures/claimExpenditure.ts';
import { type ClaimStreamingPaymentPayload } from '~redux/sagas/expenditures/claimStreamingPayment.ts';
import { type CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure.ts';
import { type CreateStakedExpenditurePayload } from '~redux/sagas/expenditures/createStakedExpenditure.ts';
import { type CreateStreamingPaymentPayload } from '~redux/sagas/expenditures/createStreamingPayment.ts';
import { type EditExpenditurePayload } from '~redux/sagas/expenditures/editExpenditure.ts';
import { type FinalizeExpenditurePayload } from '~redux/sagas/expenditures/finalizeExpenditure.ts';
import { type FundExpenditurePayload } from '~redux/sagas/expenditures/fundExpenditure.ts';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import { type ReclaimExpenditureStakePayload } from '~redux/sagas/expenditures/reclaimExpenditureStake.ts';
import { type ReleaseExpenditureStagesPayload } from '~redux/sagas/expenditures/releaseExpenditureStages.ts';
import { type EditExpenditureMotionPayload } from '~redux/sagas/motions/expenditures/editLockedExpenditureMotion.ts';
import { type FinalizeExpenditureMotionPayload } from '~redux/sagas/motions/expenditures/finalizeExpenditureMotion.ts';
import { type ReleaseExpenditureStagesMotionPayload } from '~redux/sagas/motions/expenditures/releaseExpenditureStagesMotion.ts';
import {
  type CancelStreamingPaymentPayload,
  type CancelStakedExpenditurePayload,
} from '~redux/types/actions/expenditures.ts';
import {
  type ExpenditureFundMotionPayload,
  type ExpenditureCancelMotionPayload,
} from '~redux/types/actions/motion.ts';
import { getFormattedNumeralValue } from '~shared/Numeral/helpers.tsx';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import {
  getExpenditureDatabaseId,
  getStreamingPaymentDatabaseId,
} from '~utils/databaseId.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { getClaimableExpenditurePayouts } from '~utils/expenditures.ts';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import { ActionButton } from '~v5/shared/Button/index.ts';

const TmpAdvancedPayments = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const {
    votingReputationAddress,
    stagedExpenditureAddress,
    streamingPaymentsAddress,
  } = useEnabledExtensions();
  const { networkInverseFee = '0' } = useNetworkInverseFee();

  const { tokenBalanceData } = useUserTokenBalanceContext();

  const [tokenAddress, setTokenAddress] = useState(
    colony.nativeToken.tokenAddress,
  );
  const [decimalAmount, setDecimalAmount] = useState('18');
  const [transactionAmount, setTransactionAmount] = useState('0');
  const [expenditureId, setExpenditureId] = useState('');
  const [releaseStage, setReleaseStage] = useState('');

  const [streamingPaymentId, setStreamingPaymentId] = useState('');

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

  const { data: streamingPaymentData, refetch: refetchStreamingPayment } =
    useGetStreamingPaymentQuery({
      variables: {
        streamingPaymentId: getStreamingPaymentDatabaseId(
          colony.colonyAddress,
          Number(streamingPaymentId),
        ),
      },
      skip: Number.isNaN(streamingPaymentId),
      fetchPolicy: 'network-only',
    });
  const streamingPayment = streamingPaymentData?.getStreamingPayment;

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
  const releaseExpenditureStages = useAsyncFunction({
    submit: ActionTypes.RELEASE_EXPENDITURE_STAGES,
    error: ActionTypes.RELEASE_EXPENDITURE_STAGES_ERROR,
    success: ActionTypes.RELEASE_EXPENDITURE_STAGES_SUCCESS,
  });
  const releaseExpenditureStageMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES,
    error: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_ERROR,
    success: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_SUCCESS,
  });
  const editExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_EDIT,
    error: ActionTypes.EXPENDITURE_EDIT_ERROR,
    success: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
  });
  const cancelExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_CANCEL,
    error: ActionTypes.EXPENDITURE_CANCEL_ERROR,
    success: ActionTypes.EXPENDITURE_CANCEL_SUCCESS,
  });
  const editLockedExpenditureMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE,
    error: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_ERROR,
    success: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_SUCCESS,
  });
  const cancelExpenditureViaMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_EXPENDITURE_CANCEL,
    error: ActionTypes.MOTION_EXPENDITURE_CANCEL_ERROR,
    success: ActionTypes.MOTION_EXPENDITURE_CANCEL_SUCCESS,
  });
  const finalizeExpenditureViaMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_EXPENDITURE_FINALIZE,
    error: ActionTypes.MOTION_EXPENDITURE_FINALIZE_ERROR,
    success: ActionTypes.MOTION_EXPENDITURE_FINALIZE_SUCCESS,
  });
  const fundExpenditureViaMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_EXPENDITURE_FUND,
    error: ActionTypes.MOTION_EXPENDITURE_FUND_ERROR,
    success: ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS,
  });
  const cancelStreamingPayment = useAsyncFunction({
    submit: ActionTypes.STREAMING_PAYMENT_CANCEL,
    error: ActionTypes.STREAMING_PAYMENT_CANCEL_ERROR,
    success: ActionTypes.STREAMING_PAYMENT_CANCEL_SUCCESS,
  });
  const claimStreamingPayment = useAsyncFunction({
    submit: ActionTypes.STREAMING_PAYMENT_CLAIM,
    error: ActionTypes.STREAMING_PAYMENT_CLAIM_ERROR,
    success: ActionTypes.STREAMING_PAYMENT_CLAIM_SUCCESS,
  });

  const { currentBlockTime: blockTime } = useCurrentBlockTime();

  const { amountsAvailableToClaim, amountsClaimedToDate } =
    useStreamingPaymentAmountsLeft(
      streamingPayment,
      Math.floor(blockTime ?? Date.now() / 1000),
    );

  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  if (!rootDomain) {
    return null;
  }

  const payouts = [
    {
      amount: transactionAmount,
      tokenAddress,
      recipientAddress: user?.walletAddress ?? '',
      claimDelay: '0',
      tokenDecimals: tokenDecimalAmount,
    },
  ];

  const createExpenditurePayload: CreateExpenditurePayload = {
    payouts,
    colonyAddress: colony.colonyAddress,
    createdInDomain: rootDomain,
    fundFromDomainId: 1,
    networkInverseFee,
  };

  const createStagedExpenditurePayload: CreateExpenditurePayload = {
    payouts: [
      {
        amount: transactionAmount,
        tokenAddress,
        recipientAddress: user?.walletAddress ?? '',
        claimDelay: '0',
        tokenDecimals: tokenDecimalAmount,
      },
      {
        amount: '500',
        tokenAddress,
        recipientAddress: user?.walletAddress ?? '',
        claimDelay: '0',
        tokenDecimals: tokenDecimalAmount,
      },
    ],
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

  const createStreamingPaymentPayload: CreateStreamingPaymentPayload = {
    colonyAddress: colony.colonyAddress,
    createdInDomain: rootDomain,
    amount: transactionAmount,
    endCondition: StreamingPaymentEndCondition.FixedTime,
    interval: 86400, // One day
    recipientAddress: user?.walletAddress ?? '',
    startTimestamp: (blockTime ?? Math.floor(Date.now() / 1000)) - 604800, // One week ago
    tokenAddress,
    tokenDecimals: parseInt(decimalAmount, 10),
    endTimestamp: (blockTime ?? Math.floor(Date.now() / 1000)) + 604800, // Next week
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
    if (!expenditure) {
      return;
    }

    const finalizePayload: FinalizeExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      expenditure,
      userAddress: user?.walletAddress ?? '',
    };

    await finalizeExpenditure(finalizePayload);
  };

  const handleClaimExpenditure = async () => {
    if (!expenditure || !blockTime) {
      return;
    }

    const claimablePayouts = getClaimableExpenditurePayouts(
      expenditure.slots,
      blockTime,
      expenditure.finalizedAt,
    );

    const claimPayload: ClaimExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      claimablePayouts,
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
      stakeAmount: BigNumber.from(stakeAmount),
      stakedExpenditureAddress,
      networkInverseFee,
      tokenAddress,
      activeBalance: tokenBalanceData?.activeBalance ?? '0',
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

  const handleReleaseExpenditureStage = async () => {
    if (!expenditure || !releaseStage || !stagedExpenditureAddress) {
      return;
    }

    let slotIds: number[] = [];
    if (releaseStage.includes(',')) {
      slotIds = releaseStage.split(',').map(Number);
    } else {
      slotIds = [Number(releaseStage)];
    }

    const payload: ReleaseExpenditureStagesPayload = {
      colonyAddress: colony.colonyAddress,
      expenditure,
      stagedExpenditureAddress,
      slotIds,
      tokenAddresses: [colony.nativeToken.tokenAddress],
      userAddress: user?.walletAddress ?? '',
    };

    await releaseExpenditureStages(payload);
  };

  const handleReleaseExpenditureStageMotion = async () => {
    if (
      !expenditure ||
      !releaseStage ||
      !stagedExpenditureAddress ||
      !votingReputationAddress
    ) {
      return;
    }

    let slotIds: number[] = [];
    if (releaseStage.includes(',')) {
      slotIds = releaseStage.split(',').map(Number);
    } else {
      slotIds = [Number(releaseStage)];
    }

    const payload: ReleaseExpenditureStagesMotionPayload = {
      colonyAddress: colony.colonyAddress,
      colonyName: colony.name,
      stagedExpenditureAddress,
      votingReputationAddress,
      expenditure,
      slotIds,
      motionDomainId: expenditure.nativeDomainId,
      tokenAddresses: [colony.nativeToken.tokenAddress],
    };

    await releaseExpenditureStageMotion(payload);
  };

  const handleEdit = async () => {
    if (!expenditure) {
      return;
    }

    const payload: EditExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      expenditure,
      networkInverseFee,
      payouts: [
        {
          amount: '23.45',
          tokenAddress: colony.nativeToken.tokenAddress,
          recipientAddress: colony.colonyAddress,
          claimDelay: '0',
        },
        {
          amount: '67.89',
          tokenAddress: colony.nativeToken.tokenAddress,
          recipientAddress: user?.walletAddress ?? '',
          claimDelay: '300',
        },
      ],
      userAddress: user?.walletAddress ?? '',
    };

    await editExpenditure(payload);
  };

  const handleCancel = async () => {
    if (!expenditure) {
      return;
    }

    const payload: CancelExpenditurePayload = {
      colonyAddress: colony.colonyAddress,
      expenditure,
      stakedExpenditureAddress,
      userAddress: user?.walletAddress ?? '',
    };

    await cancelExpenditure(payload);
  };

  const handleFundViaMotion = async () => {
    if (!expenditure || !votingReputationAddress) {
      return;
    }

    const payload: ExpenditureFundMotionPayload = {
      colony,
      expenditure,
      motionDomainId: Id.RootDomain,
      fromDomainFundingPotId: 1,
      fromDomainId: 1,
    };

    await fundExpenditureViaMotion(payload);
  };

  const handleEditViaMotion = async () => {
    if (!expenditure) {
      return;
    }

    const payload: EditExpenditureMotionPayload = {
      colonyAddress: colony.colonyAddress,
      expenditure,
      networkInverseFee,
      payouts: [
        {
          amount: '23.45',
          tokenAddress: colony.nativeToken.tokenAddress,
          recipientAddress: colony.colonyAddress,
          claimDelay: '0',
        },
        {
          amount: '67.89',
          tokenAddress: colony.nativeToken.tokenAddress,
          recipientAddress: user?.walletAddress ?? '',
          claimDelay: '300',
        },
      ],
      motionDomainId: expenditure.nativeDomainId,
    };

    await editLockedExpenditureMotion(payload);
  };

  const handleCancelViaMotion = async () => {
    if (!expenditure || !votingReputationAddress) {
      return;
    }

    const payload: ExpenditureCancelMotionPayload = {
      colony,
      expenditure,
      userAddress: user?.walletAddress ?? '',
      motionDomainId: Id.RootDomain,
      votingReputationAddress,
    };

    await cancelExpenditureViaMotion(payload);
  };

  const handleFinalizeViaMotion = async () => {
    if (!expenditure || !votingReputationAddress) {
      return;
    }

    const payload: FinalizeExpenditureMotionPayload = {
      colony,
      expenditure,
      votingReputationAddress,
      motionDomainId: Id.RootDomain,
    };

    await finalizeExpenditureViaMotion(payload);
  };

  const handleCancelStreamingPayment = async () => {
    if (!streamingPayment) {
      return;
    }

    const payload: CancelStreamingPaymentPayload = {
      colonyAddress: colony.colonyAddress,
      streamingPayment,
      userAddress: user?.walletAddress ?? '',
    };

    await cancelStreamingPayment(payload);
  };

  const handleClaimStreamingPayment = async () => {
    if (!streamingPayment) {
      return;
    }

    const claimPayload: ClaimStreamingPaymentPayload = {
      colonyAddress: colony.colonyAddress,
      streamingPaymentsAddress: streamingPaymentsAddress ?? '',
      streamingPayment,
      tokenAddress,
    };

    await claimStreamingPayment(claimPayload);
  };

  const amountClaimed = amountsClaimedToDate[tokenAddress] ?? 0;
  const convertedAmountClaimed = convertToDecimal(
    amountClaimed,
    parseInt(decimalAmount, 10) || 0,
  );
  const formattedAmountClaimed = getFormattedNumeralValue(
    convertedAmountClaimed,
    amountClaimed,
  );

  const amountAvailable = amountsAvailableToClaim[tokenAddress] ?? 0;
  const convertedAmountAvailable = convertToDecimal(
    amountAvailable,
    parseInt(decimalAmount, 10) || 0,
  );
  const formattedAmountAvailable = getFormattedNumeralValue(
    convertedAmountAvailable,
    amountAvailable,
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4">
        <InputBase
          onChange={(e) => setTokenAddress(e.currentTarget.value)}
          value={tokenAddress}
          label="Token Address"
        />
        <InputBase
          onChange={(e) => setDecimalAmount(e.currentTarget.value)}
          value={decimalAmount}
          label="Token Decimals"
        />
        <InputBase
          onChange={(e) => setTransactionAmount(e.currentTarget.value)}
          value={transactionAmount}
          label="Transaction Amount"
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
        <ActionButton
          actionType={ActionTypes.STREAMING_PAYMENT_CREATE}
          values={createStreamingPaymentPayload}
        >
          Create streaming payment
        </ActionButton>
      </div>
      <div className="flex flex-wrap gap-4 rounded-lg bg-gray-100 p-3">
        <h2 className="block w-full font-bold">Expenditures</h2>
        <InputBase
          value={expenditureId}
          onChange={(e) => setExpenditureId(e.currentTarget.value)}
          placeholder="Expenditure ID"
        />
        <div className="flex flex-wrap gap-4 ">
          <Button onClick={handleLockExpenditure}>Lock</Button>
          <Button onClick={handleFundExpenditure} disabled={!expenditure}>
            Fund
          </Button>
          <Button onClick={handleFinalizeExpenditure}>Finalize</Button>
          <Button onClick={handleClaimExpenditure}>Claim</Button>
          <Button onClick={handleReclaimStake}>Reclaim stake</Button>
          <Button onClick={handleCancelAndPunish} disabled={!expenditure}>
            Cancel and punish
          </Button>
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleFundViaMotion}>Fund via motion</Button>
          <Button onClick={handleCancelViaMotion}>Cancel via motion</Button>
          <Button onClick={handleEditViaMotion}>Edit via motion</Button>
          <Button onClick={handleFinalizeViaMotion}>Finalize via motion</Button>
          <Button onClick={() => refetch()}>Refetch</Button>
        </div>
        <div className="flex w-full gap-4">
          <InputBase
            value={releaseStage}
            onChange={(e) => setReleaseStage(e.currentTarget.value)}
            placeholder="Stage to release"
          />
          <Button
            onClick={handleReleaseExpenditureStageMotion}
            disabled={!expenditure}
          >
            Release Expenditure Stage Motion
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 rounded-lg bg-gray-100 p-3">
        <h2 className="block w-full font-bold">Streaming Payments</h2>
        <InputBase
          value={releaseStage}
          onChange={(e) => setReleaseStage(e.currentTarget.value)}
          placeholder="Stage to release (or multiple stages separated by commas)"
        />
        <Button onClick={handleReleaseExpenditureStage} disabled={!expenditure}>
          Release Expenditure Stage
        </Button>
        <Button
          onClick={handleReleaseExpenditureStageMotion}
          disabled={!expenditure}
        >
          Release Expenditure Stage Motion
        </Button>
        <InputBase
          value={streamingPaymentId}
          onChange={(e) => setStreamingPaymentId(e.currentTarget.value)}
          placeholder="Streaming Payment ID"
        />
        {streamingPayment && (
          <div className="flex w-full flex-col gap-4">
            <p>
              Amount claimed to date: <b>{formattedAmountClaimed}</b>
            </p>
            <p>
              Available to claim: <b>{formattedAmountAvailable}</b>
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-4 ">
          <Button
            onClick={handleClaimStreamingPayment}
            disabled={!streamingPayment}
          >
            Claim
          </Button>
          <Button onClick={() => refetchStreamingPayment()}>Refetch</Button>
          <Button
            onClick={handleCancelStreamingPayment}
            disabled={!streamingPayment}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TmpAdvancedPayments;
