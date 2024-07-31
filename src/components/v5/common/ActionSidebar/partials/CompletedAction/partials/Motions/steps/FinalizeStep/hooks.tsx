import { Extension, Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useUserTokenBalanceContext } from '~context/UserTokenBalanceContext/UserTokenBalanceContext.ts';
import { ColonyActionType } from '~gql';
import useExtensionData from '~hooks/useExtensionData.ts';
import { type RefetchAction } from '~hooks/useGetColonyAction.ts';
import { type ClaimMotionRewardsPayload } from '~redux/sagas/motions/claimMotionRewards.ts';
import { type MotionFinalizePayload } from '~redux/types/actions/motion.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { type MotionAction } from '~types/motions.ts';
import { mapPayload } from '~utils/actions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';

import { type DescriptionListItem } from '../VotingStep/partials/DescriptionList/types.ts';

import { WinningsItems } from './types.ts';

export const useFinalizeStep = (actionData: MotionAction) => {
  const {
    motionData: { motionId, gasEstimate, motionStateHistory },
    type,
    amount,
    fromDomain,
    tokenAddress,
  } = actionData;
  const {
    colony: { colonyAddress, balances },
  } = useColonyContext();
  const { user } = useAppContext();

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

  const transform = mapPayload(
    (): MotionFinalizePayload => ({
      colonyAddress,
      userAddress: user?.walletAddress || '',
      motionId,
      gasEstimate,
    }),
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
  refetchAction: RefetchAction,
) => {
  const {
    motionData: {
      stakerRewards,
      usersStakes,
      databaseMotionId,
      remainingStakes,
      isFinalized,
    },
    transactionHash,
  } = actionData;
  const { user } = useAppContext();
  const {
    colony: { colonyAddress, nativeToken, motionsWithUnclaimedStakes },
  } = useColonyContext();
  const extension = useExtensionData(Extension.VotingReputation);
  const { pollLockedTokenBalance } = useUserTokenBalanceContext();

  const [isClaimed, setIsClaimed] = useState(false);

  const extensionData = extension?.extensionData as InstalledExtensionData;

  const userAddress = user?.walletAddress;
  const nativeTokenDecimals = nativeToken.decimals;
  const nativeTokenSymbol = ` ${nativeToken.symbol}`;
  const isMotionFailedNotFinalizable =
    actionData.motionData.motionStateHistory.hasFailedNotFinalizable;

  const userStake = usersStakes.find(({ address }) => address === userAddress);
  const stakerReward = stakerRewards.find(
    ({ address }) => address === userAddress,
  );

  // Keep isClaimed state in sync with changes to unclaimed motions on colony object
  useEffect(() => {
    if (motionsWithUnclaimedStakes) {
      const motionIsUnclaimed = motionsWithUnclaimedStakes.some(
        ({ motionId }) => motionId === databaseMotionId,
      );

      if (!motionIsUnclaimed) {
        setIsClaimed(true);
        refetchAction();
      } else {
        setIsClaimed(false);
      }
    }
  }, [motionsWithUnclaimedStakes, databaseMotionId, refetchAction]);

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
    startPollingAction(getSafePollingInterval());
    pollLockedTokenBalance();
  };

  const claimPayload = mapPayload(
    (): ClaimMotionRewardsPayload => ({
      userAddress: userAddress || '',
      colonyAddress: colonyAddress || '',
      transactionHash: transactionHash || '',
      extensionAddress: isInstalledExtensionData(extensionData)
        ? extensionData.address
        : ADDRESS_ZERO,
    }),
  );

  const items: DescriptionListItem[] = [
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
  ];
  if (isFinalized) {
    items.push(
      {
        key: WinningsItems.Winnings,
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
        key: WinningsItems.Total,
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
    );
  }
  if (isMotionFailedNotFinalizable) {
    items.push(
      {
        key: WinningsItems.Winnings,
        label: formatText({ id: 'motion.finalizeStep.winnings' }),
        value: (
          <div>
            <Numeral
              value={0}
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
              value={0}
              decimals={nativeTokenDecimals}
              suffix={nativeTokenSymbol}
            />
          </div>
        ),
      },
    );
  }

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
