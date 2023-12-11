import React from 'react';
import { BigNumber } from 'ethers';

import { UserInfoListItem } from '~v5/shared/UserInfoSectionList/partials/UserInfoList/types';
import Numeral from '~shared/Numeral';
import { useGetUserReputationQuery } from '~gql';
import { useAppContext, useEnoughTokensForStaking } from '~hooks';
import useUsersByAddresses from '~hooks/useUsersByAddresses';
import { formatText } from '~utils/intl';
import { MotionVote } from '~utils/colonyMotions';
import { ColonyMotion } from '~types';

import { useMotionContext } from '../../partials/MotionProvider/hooks';

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
    userInactivatedTokens,
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
    userInactivatedTokens,
  };
};

export const useStakingInformation = (
  usersStakes: ColonyMotion['usersStakes'],
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

  const sortedUsersStakes = [...usersStakes].sort((a, b) => {
    const aStakeNumber = BigNumber.from(a.stakes.raw.yay);
    const bStakeNumber = BigNumber.from(b.stakes.raw.yay);

    if (aStakeNumber.eq(bStakeNumber)) {
      return 0;
    }

    return aStakeNumber.gt(bStakeNumber) ? -1 : 1;
  });

  const getVotesArray = (vote: MotionVote = MotionVote.Yay) =>
    sortedUsersStakes?.reduce((result, item) => {
      const voteValue =
        item.stakes?.raw?.[vote === MotionVote.Yay ? 'yay' : 'nay'];
      if (!item || voteValue === '0') {
        return result;
      }

      const user = users?.find(
        (potentialUser) => potentialUser?.walletAddress === item.address,
      );

      if (!user) {
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
            user,
          },
        },
      ];
    }, []) || [];

  const votesFor = getVotesArray(MotionVote.Yay);
  const votesAgainst = getVotesArray(MotionVote.Nay);

  return {
    votesFor,
    votesAgainst,
    isLoading: loading,
  };
};
