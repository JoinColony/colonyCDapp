import { Extension, Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useUserTokenBalanceContext } from '~context/UserTokenBalanceContext/UserTokenBalanceContext.ts';
import { ColonyActionType } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { type RefetchAction } from '~hooks/useGetColonyAction.ts';
import { type ClaimMotionRewardsPayload } from '~redux/sagas/motions/claimMotionRewards.ts';
import { type MotionFinalizePayload } from '~redux/types/actions/motion.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type MotionAction } from '~types/motions.ts';
import { getMotionAssociatedActionId, mapPayload } from '~utils/actions.ts';
import { getIsMotionOlderThanAWeek } from '~utils/dates.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';

import { type DescriptionListItem } from '../VotingStep/partials/DescriptionList/types.ts';

import { WinningsItems } from './types.ts';

export const useFinalizeStep = (actionData: MotionAction) => {
  const {
    motionData: { motionId, motionStateHistory },
    type,
    amount,
    fromDomain,
    tokenAddress,
  } = actionData;
  const {
    colony: { colonyAddress, balances },
  } = useColonyContext();
  const { user } = useAppContext();

  const { currentBlockTime } = useCurrentBlockTime();
  const isMotionOlderThanWeek = currentBlockTime
    ? getIsMotionOlderThanAWeek(actionData.createdAt, currentBlockTime * 1000)
    : false;

  const domainBalance = getBalanceForTokenAndDomain(
    balances,
    tokenAddress ?? '',
    fromDomain?.nativeId || Id.RootDomain,
  );

  const requiresDomainFunds: boolean =
    !!fromDomain &&
    !!amount &&
    type !== ColonyActionType.MintTokensMotion &&
    type !== ColonyActionType.EmitDomainReputationPenaltyMotion &&
    type !== ColonyActionType.EmitDomainReputationRewardMotion &&
    motionStateHistory.hasPassed;

  const hasEnoughFundsToFinalize =
    !requiresDomainFunds ||
    // Safe casting since if requiresDomainFunds is true, we know amount is a string
    BigNumber.from(domainBalance ?? '0').gte(amount as string);

  const isFinalizable =
    hasEnoughFundsToFinalize && !motionStateHistory.hasFailedNotFinalizable;

  const associatedActionId = getMotionAssociatedActionId(actionData);

  const transform = useMemo(
    () =>
      mapPayload(
        (): MotionFinalizePayload => ({
          associatedActionId,
          colonyAddress,
          userAddress: user?.walletAddress || '',
          motionId,
          canMotionFail: isMotionOlderThanWeek,
        }),
      ),
    [
      associatedActionId,
      colonyAddress,
      isMotionOlderThanWeek,
      motionId,
      user?.walletAddress,
    ],
  );

  return {
    transform,
    isFinalizable,
    hasEnoughFundsToFinalize,
  };
};

export const useClaimConfig = (
  actionData: MotionAction,
  startPollingAction: (pollingInterval: number) => void,
) => {
  const {
    motionData: {
      isFinalized: isMotionFinalized,
      stakerRewards,
      usersStakes,
      voterRewards,
      remainingStakes,
    },
    transactionHash,
  } = actionData;
  const { user } = useAppContext();
  const {
    colony: { colonyAddress, nativeToken },
  } = useColonyContext();
  const { extensionData } = useExtensionData(Extension.VotingReputation);
  const { pollLockedTokenBalance } = useUserTokenBalanceContext();

  const [isClaimed, setIsClaimed] = useState(false);

  const userAddress = user?.walletAddress;
  const nativeTokenDecimals = nativeToken.decimals;
  const nativeTokenSymbol = ` ${nativeToken.symbol}`;
  const isMotionFailedNotFinalizable =
    actionData.motionData.motionStateHistory.hasFailedNotFinalizable;

  const userStake = usersStakes.find(({ address }) => address === userAddress);
  const stakerReward = stakerRewards.find(
    ({ address }) => address === userAddress,
  );

  useEffect(() => {
    if (stakerReward?.isClaimed && !isClaimed) {
      setIsClaimed(true);
    }
  }, [stakerReward?.isClaimed, isClaimed]);

  const userVoteRewardAmount = useMemo(() => {
    if (!userAddress || !voterRewards?.items) {
      return 0;
    }
    const userReward = voterRewards.items.find(
      (voterReward) => voterReward?.userAddress === userAddress,
    );

    if (!userReward) {
      return 0;
    }

    return userReward.amount;
  }, [userAddress, voterRewards]);

  const userTotalStake = useMemo(
    () =>
      userStake &&
      BigNumber.from(userStake?.stakes?.raw?.nay).add(
        userStake?.stakes?.raw?.yay || '',
      ),
    [userStake],
  );

  const totals = useMemo(() => {
    const total = BigNumber.from(userVoteRewardAmount);

    if (stakerReward) {
      return total.add(
        BigNumber.from(stakerReward?.rewards?.yay).add(
          stakerReward?.rewards.nay || '0',
        ),
      );
    }

    return total;
  }, [stakerReward, userVoteRewardAmount]);

  // if user will receive a staking reward, we need to not count it as a reward, it's just a net zero
  const userWinnings = stakerReward ? totals.sub(userTotalStake || 0) : totals;

  // Else, return full widget
  const buttonTextId = isClaimed ? 'button.claimed' : 'button.claim';
  const remainingStakesNumber = remainingStakes.length;
  const canClaimStakes = userTotalStake ? !userTotalStake.isZero() : false;
  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingAction(getSafePollingInterval());
    pollLockedTokenBalance();
  };

  const associatedActionId = getMotionAssociatedActionId(actionData);

  const claimPayload = useMemo(
    () =>
      mapPayload(
        (): ClaimMotionRewardsPayload => ({
          userAddress: userAddress || '',
          colonyAddress: colonyAddress || '',
          transactionHash: transactionHash || '',
          extensionAddress:
            extensionData && isInstalledExtensionData(extensionData)
              ? extensionData.address
              : ADDRESS_ZERO,
          associatedActionId,
        }),
      ),
    [
      userAddress,
      colonyAddress,
      transactionHash,
      extensionData,
      associatedActionId,
    ],
  );

  const getDescriptionItems = (): DescriptionListItem[] => {
    const isMotionAgreement =
      actionData.type === ColonyActionType.CreateDecisionMotion;

    if (
      !isMotionFailedNotFinalizable &&
      !isMotionFinalized &&
      !isMotionAgreement
    ) {
      return [];
    }

    const rewardValue = isMotionFailedNotFinalizable ? 0 : userWinnings || 0;
    const totalValue = isMotionFailedNotFinalizable ? 0 : totals || 0;

    return [
      {
        key: WinningsItems.Staked,
        label: formatText({ id: 'motion.finalizeStep.staked' }),
        value: (
          <div>
            <Numeral
              value={userTotalStake || 0}
              decimals={nativeTokenDecimals}
              suffix={nativeTokenSymbol}
            />
          </div>
        ),
      },
      {
        key: WinningsItems.Winnings,
        label: formatText({ id: 'motion.finalizeStep.winnings' }),
        value: (
          <div>
            <Numeral
              value={rewardValue}
              decimals={nativeTokenDecimals}
              suffix={nativeTokenSymbol}
            />
          </div>
        ),
      },
      {
        key: WinningsItems.Total,
        label: formatText({ id: 'motion.finalizeStep.total' }),
        value: (
          <div>
            <Numeral
              value={totalValue}
              decimals={nativeTokenDecimals}
              suffix={nativeTokenSymbol}
            />
          </div>
        ),
      },
    ];
  };

  const items = getDescriptionItems();

  return {
    items,
    isClaimed,
    buttonTextId,
    remainingStakesNumber,
    handleClaimSuccess,
    claimPayload,
    canClaimStakes,
  };
};
