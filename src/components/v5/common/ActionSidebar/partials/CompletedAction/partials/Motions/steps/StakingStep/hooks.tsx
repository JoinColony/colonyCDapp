import { BigNumber } from 'ethers';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetUserReputationQuery } from '~gql';
import useEnoughTokensForStaking from '~hooks/useEnoughTokensForStaking.ts';

import { useMotionContext } from '../../partials/MotionProvider/hooks.ts';

export const useStakingStep = () => {
  const { motionAction } = useMotionContext();
  const { user, userLoading, walletConnecting } = useAppContext();

  const { colony, motionData, rootHash } = motionAction;
  const { nativeToken, colonyAddress } = colony;
  const { tokenAddress } = nativeToken;

  const { userMinStake, nativeMotionDomainId } = motionData;

  const {
    hasEnoughTokens: enoughTokensToStakeMinimum,
    loadingUserTokenBalance,
    userActivatedTokens,
    userInactivatedTokens,
  } = useEnoughTokensForStaking({
    tokenAddress,
    walletAddress: user?.walletAddress ?? '',
    colonyAddress,
    requiredStake: userMinStake,
  });

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

  return {
    isLoading:
      userLoading ||
      walletConnecting ||
      loadingUserTokenBalance ||
      loadingReputation,
    enoughTokensToStakeMinimum,
    enoughReputationToStakeMinimum,
    userActivatedTokens,
    userInactivatedTokens,
  };
};
