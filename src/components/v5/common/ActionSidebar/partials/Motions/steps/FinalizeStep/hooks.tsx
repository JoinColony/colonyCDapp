import React, { useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import { Extension } from '@colony/colony-js';

import { ColonyActionType } from '~gql';
import { useAppContext, useColonyContext, useExtensionData } from '~hooks';
import { mapPayload } from '~utils/actions';
import { formatText } from '~utils/intl';
import Numeral from '~shared/Numeral';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { MotionFinalizePayload } from '~redux/types/actions/motion';
import { DescriptionListItem } from '../VotingStep/partials/DescriptionList/types';
import { MotionAction } from '~types/motions';
import { useUserTokenBalanceContext } from '~context';
import { ClaimMotionRewardsPayload } from '~redux/sagas/motions/claimMotionRewards';
import { RefetchAction } from '~common/ColonyActions/ActionDetailsPage/useGetColonyAction';

export const useFinalizeStep = (actionData: MotionAction) => {
  const {
    motionData: {
      nativeMotionDomainId,
      motionId,
      gasEstimate,
      motionStateHistory,
    },
    type,
    amount,
    fromDomain,
    tokenAddress,
  } = actionData;
  const { colony } = useColonyContext();
  const { balances } = colony || {};
  const { user } = useAppContext();

  const domainBalance = getBalanceForTokenAndDomain(
    balances,
    tokenAddress ?? '',
    Number(nativeMotionDomainId),
  );

  const requiresDomainFunds: boolean =
    !!fromDomain &&
    !!amount &&
    type !== ColonyActionType.MintTokensMotion &&
    type !== ColonyActionType.EmitDomainReputationPenaltyMotion &&
    type !== ColonyActionType.EmitDomainReputationRewardMotion;

  const isFinalizable =
    (!requiresDomainFunds ||
      // Safe casting since if requiresDomainFunds is true, we know amount is a string
      BigNumber.from(domainBalance ?? '0').gte(amount as string)) &&
    !motionStateHistory.hasFailedNotFinalizable;

  const transform = mapPayload(
    (): MotionFinalizePayload => ({
      colonyAddress: colony?.colonyAddress || '',
      userAddress: user?.walletAddress || '',
      motionId,
      gasEstimate,
    }),
  );

  return {
    transform,
    isFinalizable,
  };
};

export const useClaimConfig = (
  actionData: MotionAction,
  startPollingAction: (pollingInterval: number) => void,
  refetchAction: RefetchAction,
) => {
  const {
    motionData: {
      stakerRewards,
      usersStakes,
      databaseMotionId,
      remainingStakes,
    },
    transactionHash,
  } = actionData;
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(Extension.VotingReputation);
  const { pollLockedTokenBalance } = useUserTokenBalanceContext();

  const [isClaimed, setIsClaimed] = useState(false);

  const userAddress = user?.walletAddress;
  const colonyAddress = colony?.colonyAddress;
  const nativeTokenDecimals = colony?.nativeToken.decimals;
  const nativeTokenSymbol = colony?.nativeToken.symbol;

  const userStake = usersStakes.find(({ address }) => address === userAddress);
  const stakerReward = stakerRewards.find(
    ({ address }) => address === userAddress,
  );

  // Keep isClaimed state in sync with changes to unclaimed motions on colony object
  useEffect(() => {
    if (colony?.motionsWithUnclaimedStakes) {
      const motionIsUnclaimed = colony.motionsWithUnclaimedStakes.some(
        ({ motionId }) => motionId === databaseMotionId,
      );

      if (!motionIsUnclaimed) {
        setIsClaimed(true);
        refetchAction();
      } else {
        setIsClaimed(false);
      }
    }
  }, [colony?.motionsWithUnclaimedStakes, databaseMotionId, refetchAction]);

  // Keep isClaimed state in sync with user changes
  useEffect(() => {
    if (!user) {
      setIsClaimed(false);
    } else {
      setIsClaimed(!!stakerReward?.isClaimed);
    }
  }, [user, stakerReward?.isClaimed]);

  useEffect(() => {
    if (stakerReward?.isClaimed && !isClaimed) {
      setIsClaimed(true);
    }
  }, [stakerReward?.isClaimed, isClaimed]);

  const totals = useMemo(
    () =>
      stakerReward &&
      BigNumber.from(stakerReward?.rewards?.yay).add(
        stakerReward?.rewards.nay || '',
      ),
    [stakerReward],
  );

  const userTotalStake = useMemo(
    () =>
      userStake &&
      BigNumber.from(userStake?.stakes?.raw?.nay).add(
        userStake?.stakes?.raw?.yay || '',
      ),
    [userStake],
  );
  const userWinnings = totals?.sub(userTotalStake || 0);

  // Else, return full widget
  const buttonTextId = isClaimed ? 'button.claimed' : 'button.claim';
  const remainingStakesNumber = remainingStakes.length;
  const canClaimStakes = totals ? !totals.isZero() : false;
  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingAction(1000);
    pollLockedTokenBalance();
  };

  const claimPayload = mapPayload(
    (): ClaimMotionRewardsPayload => ({
      userAddress: userAddress || '',
      colonyAddress: colonyAddress || '',
      transactionHash: transactionHash || '',
      // @ts-ignore It exists, TS is just being a little bitch
      extensionAddress: extensionData?.address || '',
    }),
  );

  const items: DescriptionListItem[] = [
    {
      key: '1',
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
      key: '2',
      label: formatText({ id: 'motion.finalizeStep.winnings' }),
      value: (
        <div>
          <Numeral
            value={userWinnings || 0}
            decimals={nativeTokenDecimals}
            suffix={nativeTokenSymbol}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: formatText({ id: 'motion.finalizeStep.total' }),
      value: (
        <div>
          <Numeral
            value={totals || 0}
            decimals={nativeTokenDecimals}
            suffix={nativeTokenSymbol}
          />
        </div>
      ),
    },
  ];

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
