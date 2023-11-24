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

  const { activeBalance, inactiveBalance } = data?.getUserTokenBalance || {};

  const userActivatedTokens = BigNumber.from(activeBalance ?? 0);
  const userInactivatedTokens = BigNumber.from(inactiveBalance ?? 0);

  const hasEnoughTokens = userActivatedTokens
    .add(userInactivatedTokens)
    .gte(requiredStake);

  return {
    loadingUserTokenBalance,
    hasEnoughTokens,
    userActivatedTokens,
  };
};

export default useEnoughTokensForStaking;
