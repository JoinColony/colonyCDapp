import { BigNumber } from 'ethers';

import { useGetColonyActionQuery, useGetUserReputationQuery } from '~gql';
import { useAppContext, useEnoughTokensForStaking } from '~hooks';
import { calculateStakeLimitDecimal } from './helpers';

export const useStakingSlider = (transactionHash: string) => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { data: actionData, loading: loadingActionData } =
    useGetColonyActionQuery({
      variables: {
        transactionHash: transactionHash ?? '',
      },
    });

  const motionData = actionData?.getColonyAction?.motionData;
  const nativeToken = actionData?.getColonyAction?.colony.nativeToken;

  // if (!motionData) {
  //   throw new Error(
  //     "Unable to find motion data. This is a bug since we're only calling this hook from a motion.",
  //   );
  // }

  // if (!nativeToken) {
  //   throw new Error(
  //     "Unable to find colony data. This is a bug since we're only calling this hook from within a motion.",
  //   );
  // }

  const {
    remainingStakes,
    userMinStake = '',
    requiredStake,
    motionStakes,
    rootHash,
    nativeMotionDomainId,
    usersStakes,
  } = motionData || {};

  const { percentage } = motionStakes || {};

  const { nay: opposePercentageStaked, yay: supportPercentageStaked } =
    percentage || {};

  const [nayRemaining, yayRemaining] = remainingStakes || [];

  const userStakes = usersStakes?.find(
    ({ address }) => address === user?.walletAddress,
  );

  const { nativeTokenDecimals, nativeTokenSymbol, tokenAddress } =
    nativeToken || {};
  const colonyAddress = actionData?.getColonyAction?.colonyAddress ?? '';

  const {
    hasEnoughTokens: enoughTokensToStakeMinimum,
    loadingUserTokenBalance,
    userActivatedTokens,
  } = useEnoughTokensForStaking(
    tokenAddress ?? '',
    user?.walletAddress ?? '',
    colonyAddress,
    userMinStake,
  );

  const { data, loading: loadingReputation } = useGetUserReputationQuery({
    variables: {
      input: {
        colonyAddress,
        walletAddress: user?.walletAddress ?? '',
        domainId: Number(nativeMotionDomainId),
        rootHash,
      },
    },
  });

  const userReputation = data?.getUserReputation;
  /* User cannot stake more than their reputation in tokens. */
  const userMaxStake = BigNumber.from(userReputation ?? '0');

  const enoughReputationToStakeMinimum =
    userMaxStake.gt(0) && userMaxStake.gte(userMinStake);

  const userStakeLimitDecimalOppose = calculateStakeLimitDecimal(
    nayRemaining,
    userMinStake,
    userMaxStake,
    userStakes?.stakes.raw.nay ?? '0',
    userActivatedTokens,
  );

  const userStakeLimitDecimalSupport = calculateStakeLimitDecimal(
    yayRemaining,
    userMinStake,
    userMaxStake,
    userStakes?.stakes.raw.yay ?? '0',
    userActivatedTokens,
  );

  return {
    requiredStake,
    remainingToStakeOppose: nayRemaining,
    remainingToStakeSupport: yayRemaining,
    userMinStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
    enoughTokensToStakeMinimum,
    enoughReputationToStakeMinimum,
    userActivatedTokens,
    userStakeLimitDecimalOppose,
    userStakeLimitDecimalSupport,
    isLoadingData:
      loadingUserTokenBalance ||
      userLoading ||
      walletConnecting ||
      loadingReputation ||
      loadingReputation ||
      loadingActionData,
    userMaxStake,
    opposePercentageStaked,
    supportPercentageStaked,
  };
};
