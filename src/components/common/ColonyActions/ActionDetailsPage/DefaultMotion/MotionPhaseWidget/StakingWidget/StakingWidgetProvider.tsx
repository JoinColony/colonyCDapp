import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import Decimal from 'decimal.js';

import { useGetUserReputationQuery } from '~gql';
import {
  useAppContext,
  useColonyContext,
  useMinAndRequiredStakes,
} from '~hooks';
import { MotionData, SetStateFn } from '~types';
import {
  formatStakePercentage,
  getRemainingToStake,
  getStakedPercentages,
} from './helpers';

export interface StakingWidgetContextValues {
  canBeStaked: boolean;
  canUserStakeNay: boolean;
  totalNAYStaked: string;
  remainingToStake: Decimal;
  minUserStake: Decimal;
  maxUserStake: Decimal;
  yayPercentage: string;
  nayPercentage: string;
  totalPercentage: number;
  enoughReputation: boolean;
  enoughTokens: boolean;
  isObjection: boolean;
  setIsObjection: SetStateFn;
  userActivatedTokens: Decimal;
  isSummary: boolean;
  setIsSummary: SetStateFn;
  motionId: string;
  requiredStake: Decimal;
  userStake: Decimal;
  nativeTokenDecimals: number;
  nativeTokenSymbol: string;
  reputationLoading: boolean;
  loadingStakeData: boolean;
  getErrorType: (limitExceeded: boolean) => string | null;
}

export const StakingWidgetContext = createContext<
  Partial<StakingWidgetContextValues>
>({});

export const useStakingWidgetContext = () => {
  const ctx = useContext(StakingWidgetContext);

  if (!Object.keys(ctx).length) {
    throw new Error('Could not find StakingWidgetContext');
  }

  return ctx as StakingWidgetContextValues;
};

interface StakingWidgetProviderProps {
  children: ReactNode;
  motionData: MotionData;
}

const StakingWidgetProvider = ({
  children,
  motionData: {
    motionId,
    motionDomainId,
    motionStakes: {
      raw: { nay: totalNAYStaked },
      raw: rawStakes,
    },
    rootHash,
    skillRep,
  },
}: StakingWidgetProviderProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const [isSummary, setIsSummary] = useState(false);
  const [isObjection, setIsObjection] = useState(false);

  const { data: userReputation, loading: reputationLoading } =
    useGetUserReputationQuery({
      variables: {
        input: {
          colonyAddress: colony?.colonyAddress ?? '',
          walletAddress: user?.walletAddress ?? '',
          domainId: Number(motionDomainId),
          rootHash,
        },
      },
    });

  const { minUserStake, requiredStake, loadingStakeData } =
    useMinAndRequiredStakes(skillRep);

  // TODO
  //   const {
  //     data: userData,
  //     loading: userDataLoading,
  //   } = useUserBalanceWithLockQuery({
  //     variables: {
  //       address: walletAddress,
  //       tokenAddress: nativeTokenAddress,
  //       colonyAddress,
  //     },
  //   });
  //userData?.user?.userLock?.balance || 0,

  const userActivatedTokens = useMemo(
    () => new Decimal('10000000000000000000'),
    [],
  );

  /* A user cannot stake more tokens than they have reputation. Thus, their rep is their max stake. */
  const maxUserStake = useMemo(
    () => new Decimal(userReputation?.getUserReputation ?? '0'),
    [userReputation],
  );

  /* User has enough tokens to stake */
  const enoughTokens = userActivatedTokens.gte(minUserStake);

  /* User has enough reputation to stake */
  const enoughReputation = maxUserStake.gt(0) && maxUserStake.gte(minUserStake);

  const canUserStake = !!user && enoughReputation && enoughTokens;

  const { yayPercentage, nayPercentage, totalPercentage } =
    getStakedPercentages(isObjection, requiredStake, rawStakes);

  const { remainingToStake, remainingToFullyNayStaked } = getRemainingToStake(
    isObjection,
    requiredStake,
    rawStakes,
  );

  /*
   * User's reputation in the domain is less than the amount still needed to stake, i.e. their
   * staking ability is limited, not by their number of tokens activated, but by their (lack of) reputation.
   */
  const userNeedsMoreReputation =
    userActivatedTokens.gt(maxUserStake) &&
    maxUserStake.lt(remainingToStake.toString());

  /*
   * Occurs when the remaining amount to be staked is less than the user's minimum stake. (i.e. can't
   * stake more than 100% of a motion)
   */
  const cantStakeMore =
    remainingToStake.lte(minUserStake) && !remainingToStake.isZero();

  const getErrorType = useCallback(
    (limitExceeded: boolean) => {
      if (!enoughReputation) {
        return 'reputation';
      }

      if (!enoughTokens) {
        return 'tokens';
      }

      if (cantStakeMore) {
        return 'cantStakeMore';
      }

      if (userNeedsMoreReputation) {
        return 'stakeMoreReputation';
      }

      if (limitExceeded) {
        return 'stakeMoreTokens';
      }

      return null;
    },
    [enoughReputation, enoughTokens, userNeedsMoreReputation, cantStakeMore],
  );

  const canUserStakeNay = canUserStake && remainingToFullyNayStaked.gt(0);
  const canBeStaked = canUserStake && remainingToStake.gt(0);

  // todo: Add this data to the db once we handle the stake motion saga
  const userStakes = {
    yay: new Decimal(0),
    nay: new Decimal(0),
  };

  const userStake = isObjection ? userStakes.nay : userStakes.yay;

  const nativeTokenDecimals = colony?.nativeToken.decimals || 18;
  const nativeTokenSymbol = colony?.nativeToken.symbol || '';

  const stakingWidgetValues = useMemo(
    () => ({
      canBeStaked,
      canUserStakeNay,
      totalNAYStaked,
      remainingToStake,
      minUserStake,
      maxUserStake,
      yayPercentage: formatStakePercentage(yayPercentage),
      nayPercentage: formatStakePercentage(nayPercentage),
      totalPercentage,
      enoughReputation,
      enoughTokens,
      isObjection,
      setIsObjection,
      userActivatedTokens,
      isSummary,
      setIsSummary,
      motionId,
      requiredStake,
      userStake,
      nativeTokenDecimals,
      nativeTokenSymbol,
      reputationLoading,
      loadingStakeData,
      getErrorType,
    }),
    [
      canBeStaked,
      canUserStakeNay,
      remainingToStake,
      totalNAYStaked,
      minUserStake,
      maxUserStake,
      yayPercentage,
      nayPercentage,
      totalPercentage,
      enoughReputation,
      enoughTokens,
      isObjection,
      setIsObjection,
      userActivatedTokens,
      isSummary,
      setIsSummary,
      motionId,
      requiredStake,
      userStake,
      nativeTokenDecimals,
      nativeTokenSymbol,
      reputationLoading,
      loadingStakeData,
      getErrorType,
    ],
  );

  return (
    <StakingWidgetContext.Provider value={stakingWidgetValues}>
      {children}
    </StakingWidgetContext.Provider>
  );
};

export default StakingWidgetProvider;
