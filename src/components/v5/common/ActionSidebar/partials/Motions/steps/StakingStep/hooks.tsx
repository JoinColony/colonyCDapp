import React from 'react';

import { BigNumber } from 'ethers';
import { ColonyMotionFragment, useGetUserReputationQuery } from '~gql';
import { useAppContext, useEnoughTokensForStaking } from '~hooks';
import { formatText } from '~utils/intl';
import { UserInfoListItem } from '~v5/shared/UserInfoSectionList/partials/UserInfoList/types';
import { useMotionContext } from '../../partials/MotionProvider/hooks';
import Numeral from '~shared/Numeral';
import useUsersByAddresses from '~hooks/useUsersByAddresses';

export const useStakingStep = () => {
  const { motionAction } = useMotionContext();
  const { user, userLoading, walletConnecting } = useAppContext();

  const { colony, motionData } = motionAction;
  const { nativeToken, colonyAddress } = colony;
  const { tokenAddress } = nativeToken;

  const { userMinStake, rootHash, nativeMotionDomainId } = motionData;

  const {
    hasEnoughTokens: enoughTokensToStakeMinimum,
    loadingUserTokenBalance,
    userActivatedTokens,
  } = useEnoughTokensForStaking(
    tokenAddress,
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

  return {
    isLoading:
      userLoading ||
      walletConnecting ||
      loadingUserTokenBalance ||
      loadingReputation,
    enoughTokensToStakeMinimum,
    enoughReputationToStakeMinimum,
    userActivatedTokens,
  };
};

export const useStakingInformation = (
  usersStakes: ColonyMotionFragment['usersStakes'],
  tokenDecimals: number,
  tokenSymbol: string,
): {
  votesFor: UserInfoListItem[];
  votesAgainst: UserInfoListItem[];
  isLoading?: boolean;
} => {
  const { users, loading } = useUsersByAddresses(
    usersStakes.map((user) => user.address),
  );

  const sortedUsersStakes = usersStakes?.sort((a, b) => {
    const aStakeNumber = BigNumber.from(a.stakes?.raw?.yay);
    const bStakeNumber = BigNumber.from(b.stakes?.raw?.yay);

    if (aStakeNumber.eq(bStakeNumber)) {
      return 0;
    }

    return aStakeNumber.gt(bStakeNumber) ? -1 : 1;
  });

  const getVotesArray = (voteFieldName: 'yay' | 'nay') =>
    sortedUsersStakes?.reduce((result, item) => {
      const voteValue = item.stakes?.raw?.[voteFieldName];
      if (!item || voteValue === '0') {
        return result;
      }

      const userName = users?.length
        ? users?.find((user) => user?.walletAddress === item.address)?.profile
            ?.displayName
        : undefined;

      if (!userName) {
        return result;
      }

      return [
        ...result,
        {
          key: item.address,
          info: formatText(
            { id: 'motion.staking.staked' },
            {
              value: (
                <Numeral
                  value={voteValue}
                  decimals={tokenDecimals}
                  suffix={tokenSymbol}
                />
              ),
            },
          ),
          userProps: {
            userName,
          },
        },
      ];
    }, []) || [];

  const votesFor = getVotesArray('yay');
  const votesAgainst = getVotesArray('nay');

  return {
    votesFor,
    votesAgainst,
    isLoading: loading,
  };
};
