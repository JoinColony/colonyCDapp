import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';

import { type UserSearchSelectOption } from './types.ts';

export const useUserSelect = () => {
  const { totalMembers, loading } = useMemberContext();

  const options = useMemo(
    () =>
      totalMembers.reduce<UserSearchSelectOption[]>((result, member) => {
        if (!member) {
          return result;
        }

        const { walletAddress, profile } = member.user || {};

        return [
          ...result,
          {
            value: walletAddress || member.contributorAddress,
            label:
              profile?.displayName ||
              walletAddress ||
              member.contributorAddress,
            avatar: profile?.thumbnail || profile?.avatar || undefined,
            thumbnail: profile?.thumbnail || undefined,
            id: result.length,
            showAvatar: true,
            walletAddress,
            isVerified: member.isVerified,
          },
        ];
      }, []),
    [totalMembers],
  );

  return {
    usersOptions: {
      isLoading: loading,
      options,
      key: 'users',
      title: { id: 'actions.recipient' },
    },
  };
};
