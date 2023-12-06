import { useMemo } from 'react';

import { SearchSelectOption } from '~v5/shared/SearchSelect/types';
import { useMemberContext } from '~context/MemberContext';

export const useUserSelect = () => {
  const { members, verifiedMembers, loading } = useMemberContext();

  const showVerifiedUsers = verifiedMembers.length > 0;
  const selectableMembers = showVerifiedUsers ? verifiedMembers : members;

  const options = useMemo(
    () =>
      selectableMembers.reduce<SearchSelectOption[]>((result, member) => {
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
    [selectableMembers],
  );

  return {
    usersOptions: {
      isLoading: loading,
      options,
      key: 'users',
      title: { id: 'actions.recipent' },
    },
    showVerifiedUsers,
  };
};
