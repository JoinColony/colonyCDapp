import { BigNumber } from 'ethers';

import { useGetUserReputationQuery } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';

import { useStakingWidgetContext } from '../../StakingWidgetProvider';
import { useEnoughTokensForStaking } from '../useEnoughTokensForStaking';

const useStakingControls = (limitExceeded: boolean) => {
  const { colony, loading: loadingColony } = useColonyContext();
  const { user, userLoading, walletConnecting } = useAppContext();
  const {
    motionStakes: {
      raw: { nay: nayStakes },
    },
    userMinStake,
    motionDomainId,
    rootHash,
    remainingToStake,
  } = useStakingWidgetContext();

  const {
    userActivatedTokens,
    enoughTokensToStakeMinimum,
    loadingUserTokenBalance,
  } = useEnoughTokensForStaking(
    colony?.nativeToken.tokenAddress ?? '',
    user?.walletAddress ?? '',
    userMinStake,
  );

  const { data, loading: loadingReputation } = useGetUserReputationQuery({
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
        walletAddress: user?.walletAddress ?? '',
        domainId: Number(motionDomainId),
        rootHash,
      },
    },
  });

  const userReputation = data?.getUserReputation;
  /* User cannot stake more than their reputation in tokens. */
  const userMaxStake = BigNumber.from(userReputation ?? '0');
  const enoughReputationToStakeMinimum =
    userMaxStake.gt(0) && userMaxStake.gte(userMinStake);

  const showBackButton = nayStakes !== '0';

  const showActivateButton =
    !!user &&
    remainingToStake !== '0' &&
    enoughReputationToStakeMinimum &&
    enoughTokensToStakeMinimum &&
    limitExceeded;

  return {
    showBackButton,
    showActivateButton,
    userActivatedTokens,
    enoughTokensToStakeMinimum,
    enoughReputationToStakeMinimum,
    isLoadingData:
      loadingColony ||
      userLoading ||
      walletConnecting ||
      loadingUserTokenBalance ||
      loadingReputation,
  };
};

export default useStakingControls;
