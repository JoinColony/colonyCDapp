import { useMemo } from 'react';

import { SearchSelectOption } from '~v5/shared/SearchSelect/types';
import { useMemberContext } from '~context/MemberContext';

export const useUserSelect = () => {
  const { totalMembers, loading } = useMemberContext();

  const options = useMemo(
    () =>
      totalMembers.reduce<SearchSelectOption[]>((result, member) => {
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
            avatar: profile?.thumbnail || profile?.avatar || '',
            id: result.length,
            showAvatar: true,
            walletAddress,
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
      title: { id: 'actions.recipent' },
    },
    showVerifiedUsers: false,
  };
};
