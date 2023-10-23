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

  const getVotesArray = (isNay?: boolean) => {
    return (
      usersStakes?.reduce((result, item) => {
        if (
          !item || isNay
            ? item.stakes?.raw?.nay === '0'
            : item.stakes?.raw?.yay === '0'
        ) {
          return result;
        }

        const userName = users?.length
          ? users?.find((user) => {
              const { walletAddress } = user || {};
              return walletAddress === item.address;
            })?.profile?.displayName
          : undefined;

        if (!userName) {
          return result;
        }

        // @todo: add sorting
        return [
          ...result,
          {
            key: item.address,
            info: formatText(
              { id: 'motion.staking.staked' },
              {
                value: (
                  <Numeral
                    value={item.stakes?.raw?.yay}
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
      }, []) || []
    );
  };

  const votesFor = getVotesArray();
  const votesAgainst = getVotesArray(true);

  return {
    votesFor,
    votesAgainst,
    isLoading: loading,
  };
};
