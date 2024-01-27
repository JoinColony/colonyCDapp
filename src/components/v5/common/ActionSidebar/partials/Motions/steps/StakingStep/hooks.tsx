import { BigNumber } from 'ethers';
import React from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import { ColonyMotionFragment, useGetUserReputationQuery } from '~gql';
import useEnoughTokensForStaking from '~hooks/useEnoughTokensForStaking.ts';
import useUsersByAddresses from '~hooks/useUsersByAddresses.ts';
import Numeral from '~shared/Numeral/index.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { UserInfoListItem } from '~v5/shared/UserInfoSectionList/partials/UserInfoList/types.ts';

import { useMotionContext } from '../../partials/MotionProvider/hooks.ts';

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
