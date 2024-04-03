import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { truncateAddress } from '~hooks/members/utils.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export const useNonVerifiedMembersSelect = () => {
  const { totalMembers } = useMemberContext();

  const options = totalMembers.reduce<SearchSelectOption[]>(
    (result, member) => {
      if (member.isVerified) {
        return result;
      }

      const { walletAddress, profile } = member.user || {};

      return [
        ...result,
        {
          value: walletAddress || '',
          isVerified: false,
          label:
            profile?.displayName ||
            (walletAddress && truncateAddress(walletAddress)) ||
            truncateAddress(member.contributorAddress),
          avatar: profile?.thumbnail || profile?.avatar || '',
          id: result.length,
          showAvatar: true,
          walletAddress,
          profile,
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
        id: 'actions.notVerifiedMembers',
      },
    },
  };
};
