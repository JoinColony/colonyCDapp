import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetNotVerifiedMembersQuery } from '~gql';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export const useNonVerifiedMembersSelect = () => {
  const { colony } = useColonyContext();
  const { data, loading } = useGetNotVerifiedMembersQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });

  const options = useMemo(
    () =>
      data?.getContributorsByColony?.items.reduce<SearchSelectOption[]>(
        (result, member) => {
          if (!member) {
            return result;
          }

          const { walletAddress, profile } = member.user || {};

          return [
            ...result,
            {
              value: walletAddress || '',
              isVerified: false,
              label: profile?.displayName || walletAddress || '',
              avatar: profile?.thumbnail || profile?.avatar || '',
              id: result.length,
              showAvatar: true,
              walletAddress,
              profile,
            },
          ];
        },
        [],
      ),
    [data?.getContributorsByColony?.items],
  );

  return {
    usersOptions: {
      isLoading: loading,
      options: options || [],
      key: 'users',
      title: {
        id: 'actions.notVerifiedMembers',
      },
    },
  };
};
