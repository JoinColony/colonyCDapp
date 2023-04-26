import { BigNumber } from 'ethers';
import { useLocation } from 'react-router-dom';
import { useEnoughTokensForStaking } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget/StakingInput/useEnoughTokensForStaking';

import { useGetColonyActionQuery, useGetUserReputationQuery } from '~gql';
import { calculateStakeLimitDecimal } from './helpers';
import useAppContext from './useAppContext';

const getTransactionHashFromPathName = (pathname: string) =>
  pathname.split('/').pop();

const useStakingSlider = (isObjection: boolean) => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { pathname } = useLocation();
  const transactionHash = getTransactionHashFromPathName(pathname);
  const { data: actionData, loading: loadingActionData } =
    useGetColonyActionQuery({
      variables: {
        transactionHash: transactionHash ?? '',
      },
    });

  const motionData = actionData?.getColonyAction?.motionData;
  const nativeToken = actionData?.getColonyAction?.colony.nativeToken;

  if (!motionData) {
    throw new Error(
      "Unable to find motion data. This is a bug since we're only calling this hook from a motion.",
    );
  }

  if (!nativeToken) {
    throw new Error(
      "Unable to find colony data. This is a bug since we're only calling this hook from within a motion.",
    );
  }

  const {
    remainingStakes: [nayRemaining, yayRemaining],
    userMinStake,
    motionStakes: {
      percentage: { nay: nayPercentageStaked, yay: yayPercentageStaked },
    },
    rootHash,
    motionDomainId,
  } = motionData;

  const { nativeTokenDecimals, nativeTokenSymbol, tokenAddress } = nativeToken;

  const {
    enoughTokensToStakeMinimum,
    loadingUserTokenBalance,
    userActivatedTokens,
  } = useEnoughTokensForStaking(
    tokenAddress,
    user?.walletAddress ?? '',
    userMinStake,
  );

  const { data, loading: loadingReputation } = useGetUserReputationQuery({
    variables: {
      input: {
        colonyAddress: actionData.getColonyAction?.colonyAddress ?? '',
        walletAddress: user?.walletAddress ?? '',
        domainId: Number(motionDomainId),
        rootHash,
      },
    },
  });

  const userReputation = data?.getUserReputation;
  /* User cannot stake more than their reputation in tokens. */
  const userMaxStake = BigNumber.from(userReputation ?? '0');
  const remainingToStake = isObjection ? nayRemaining : yayRemaining;
  const enoughReputation = userMaxStake.gt(0) && userMaxStake.gte(userMinStake);

  const userStakeLimitDecimal = calculateStakeLimitDecimal(
    remainingToStake,
    userMinStake,
    userMaxStake,
    userActivatedTokens,
  );

  const totalPercentageStaked =
    Number(nayPercentageStaked) + Number(yayPercentageStaked);

  return {
    remainingToStake: isObjection ? nayRemaining : yayRemaining,
    totalPercentageStaked,
    userMinStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
    enoughTokensToStakeMinimum,
    userActivatedTokens,
    userStakeLimitDecimal,
    isLoadingData:
      loadingUserTokenBalance ||
      userLoading ||
      walletConnecting ||
      loadingReputation ||
      loadingReputation ||
      loadingActionData,
    enoughReputation,
    userMaxStake,
  };
};

export default useStakingSlider;
