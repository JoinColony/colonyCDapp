import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { truncateAddress } from '~hooks/members/utils.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

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
              (walletAddress && truncateAddress(walletAddress)) ||
              truncateAddress(member.contributorAddress),
            avatar: profile?.thumbnail || profile?.avatar || '',
            thumbnail: profile?.thumbnail || '',
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
