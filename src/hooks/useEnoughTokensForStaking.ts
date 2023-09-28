import { BigNumber } from 'ethers';

import { useGetUserTokenBalanceQuery } from '~gql';
import { Address } from '~types';

const useEnoughTokensForStaking = (
  tokenAddress: Address,
  walletAddress: Address,
  colonyAddress: Address,
  requiredStake: string,
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

  const hasEnoughTokens = userActivatedTokens.gte(requiredStake);

  return {
    loadingUserTokenBalance,
    hasEnoughTokens,
    userActivatedTokens,
  };
};

export default useEnoughTokensForStaking;
