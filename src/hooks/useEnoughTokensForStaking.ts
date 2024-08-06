import { BigNumber } from 'ethers';

import { useGetUserTokenBalanceQuery } from '~gql';
import { type Address } from '~types/index.ts';

const useEnoughTokensForStaking = ({
  tokenAddress,
  walletAddress,
  colonyAddress,
  requiredStake,
}: {
  tokenAddress: Address;
  walletAddress: Address;
  colonyAddress: Address;
  requiredStake: string;
}) => {
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

  const hasEnoughActivatedTokens = userActivatedTokens.gte(requiredStake);

  return {
    loadingUserTokenBalance,
    hasEnoughTokens,
    hasEnoughActivatedTokens,
    userActivatedTokens,
    userInactivatedTokens,
  };
};

export default useEnoughTokensForStaking;
