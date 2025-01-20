import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { formatMembersSelectOptions } from '~v5/common/ActionSidebar/utils.ts';

export const useVerifiedMembersSelect = () => {
  const { verifiedMembers } = useMemberContext();

  const options = formatMembersSelectOptions(verifiedMembers);

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
