import { BigNumber } from 'ethers';
import { useLocation } from 'react-router-dom';

import { useGetColonyActionQuery, useGetUserReputationQuery } from '~gql';
import { useAppContext } from '~hooks';
import { getTransactionHashFromPathName } from '~utils/urls';

import { calculateStakeLimitDecimal } from '../helpers';
import { useEnoughTokensForStaking } from './useEnoughTokensForStaking';

export const useStakingSlider = (isObjection: boolean) => {
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
    usersStakes,
  } = motionData;

  const userStakes = usersStakes.find(
    ({ address }) => address === user?.walletAddress,
  );

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
  const userTotalStake = isObjection
    ? userStakes?.stakes.raw.nay
    : userStakes?.stakes.raw.yay;

  const enoughReputationToStakeMinimum =
    userMaxStake.gt(0) && userMaxStake.gte(userMinStake);

  const userStakeLimitDecimal = calculateStakeLimitDecimal(
    remainingToStake,
    userMinStake,
    userMaxStake,
    userTotalStake ?? '0',
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
    enoughReputationToStakeMinimum,
    userActivatedTokens,
    userStakeLimitDecimal,
    isLoadingData:
      loadingUserTokenBalance ||
      userLoading ||
      walletConnecting ||
      loadingReputation ||
      loadingReputation ||
      loadingActionData,
    userMaxStake,
  };
};
