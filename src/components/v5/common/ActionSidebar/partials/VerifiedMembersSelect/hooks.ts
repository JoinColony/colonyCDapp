import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useGetVerifiedMembersQuery } from '~gql';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export const useVerifiedMembersSelect = () => {
  const { colony } = useColonyContext();
  const { data, loading } = useGetVerifiedMembersQuery({
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
              isVerified: true,
              label: profile?.displayName || walletAddress || '',
              avatar: profile?.thumbnail || profile?.avatar || '',
              id: result.length,
              profile,
              showAvatar: true,
              walletAddress,
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
        id: 'actions.verifiedMembers',
      },
    },
  };
};
