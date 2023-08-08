import { BigNumber } from 'ethers';

import { useGetUserTokenBalanceQuery } from '~gql';
import { Address } from '~types';

export const useEnoughTokensForStaking = (
  tokenAddress: Address,
  walletAddress: Address,
  colonyAddress: Address,
  userMinStake: string,
) => {
  const { data, loading: loadingUserTokenBalance } =
    useGetUserTokenBalanceQuery({
      variables: {
        input: {
          tokenAddress,
          walletAddress,
          colonyAddress,
        },
      },
      skip: !tokenAddress || !walletAddress,
    });

  const { activeBalance } = data?.getUserTokenBalance || {};

  const userActivatedTokens = BigNumber.from(activeBalance ?? 0);

  const enoughTokensToStakeMinimum = userActivatedTokens.gte(userMinStake);

  return {
    loadingUserTokenBalance,
    enoughTokensToStakeMinimum,
    userActivatedTokens,
  };
};
