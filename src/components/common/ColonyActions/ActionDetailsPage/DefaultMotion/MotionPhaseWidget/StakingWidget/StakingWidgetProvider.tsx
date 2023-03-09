import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Decimal from 'decimal.js';

import { useGetUserReputationQuery } from '~gql';
import {
  useAppContext,
  useColonyContext,
  useMinAndRequiredStakes,
  useUserBalance,
} from '~hooks';
import { MotionData, SetStateFn } from '~types';
import {
  formatStakePercentage,
  getRemainingToStake,
  getStakedPercentages,
  getUserStakes,
} from './helpers';

export interface StakingWidgetContextValues {
  canBeStaked: boolean;
  canUserStakeNay: boolean;
  totalNAYStakes: Decimal;
  remainingToStake: Decimal;
  remainingToFullyNayStaked: Decimal;
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
  setMotionStakes: SetStateFn;
  setUsersStakes: SetStateFn;
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
  setShowStakeBanner: SetStateFn;
}

const StakingWidgetProvider = ({
  children,
  motionData: {
    motionId,
    motionDomainId,
    motionStakes: { raw: rawMotionStakes },
    usersStakes: usersStakesFromDB,
    rootHash,
    skillRep,
  },
  setShowStakeBanner,
}: StakingWidgetProviderProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const [isSummary, setIsSummary] = useState(false);
  const [isObjection, setIsObjection] = useState(false);
  // for optimistic ui
  const [usersStakes, setUsersStakes] = useState(usersStakesFromDB);
  const [motionStakes, setMotionStakes] = useState(rawMotionStakes);
  const { nay } = motionStakes;
  const totalNAYStakes = useMemo(() => new Decimal(nay), [nay]);
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
  const userBalance = useUserBalance();

  const userActivatedTokens = useMemo(
    () => new Decimal(userBalance ?? '0'),
    [userBalance],
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
    getStakedPercentages(isObjection, requiredStake, motionStakes);

  useEffect(() => {
    if (!loadingStakeData && totalPercentage >= 10) {
      setShowStakeBanner(false);
    }
  }, [totalPercentage, loadingStakeData, setShowStakeBanner]);

  const { remainingToStake, remainingToFullyNayStaked } = getRemainingToStake(
    isObjection,
    requiredStake,
    motionStakes,
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

  const userStakes = getUserStakes(usersStakes, user?.walletAddress ?? '');

  const userStake = useMemo(
    () =>
      new Decimal(
        isObjection ? userStakes?.nay ?? '0' : userStakes?.yay ?? '0',
      ),
    [isObjection, userStakes],
  );

  const nativeTokenDecimals = colony?.nativeToken.decimals || 18;
  const nativeTokenSymbol = colony?.nativeToken.symbol || '';

  const stakingWidgetValues = useMemo(
    () => ({
      canBeStaked,
      canUserStakeNay,
      totalNAYStakes,
      remainingToStake,
      remainingToFullyNayStaked,
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
      setMotionStakes,
      setUsersStakes,
    }),
    [
      canBeStaked,
      canUserStakeNay,
      remainingToStake,
      remainingToFullyNayStaked,
      totalNAYStakes,
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
      setMotionStakes,
      setUsersStakes,
    ],
  );

  return (
    <StakingWidgetContext.Provider value={stakingWidgetValues}>
      {children}
    </StakingWidgetContext.Provider>
  );
};

export default StakingWidgetProvider;
