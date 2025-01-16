import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { formatMembersSelectOptions } from '~v5/common/ActionSidebar/utils.ts';

export const useNonVerifiedMembersSelect = () => {
  const { totalMembers } = useMemberContext();

  const options = formatMembersSelectOptions(
    totalMembers.filter((member) => !member.isVerified),
    false,
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
