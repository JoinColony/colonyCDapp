import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export const useVerifiedMembersSelect = () => {
  const { verifiedMembers } = useMemberContext();

  const options = verifiedMembers.reduce<SearchSelectOption[]>(
    (result, member) => {
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
  );

  return {
    usersOptions: {
      options: options || [],
      key: 'users',
      title: {
        id: 'actions.verifiedMembers',
      },
    },
  };
};
