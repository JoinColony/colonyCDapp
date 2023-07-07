import { useGetMembersForColonyQuery } from '~gql';
import { Address, Member, MemberUser } from '~types';
import { notMaybe } from '~utils/arrays';

export const useGetColonyMembers = (colonyAddress?: Address | null) => {
  const { data, loading } = useGetMembersForColonyQuery({
    skip: !colonyAddress,
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
      },
    },
  });

  const watchers = data?.getMembersForColony?.watchers ?? [];
  const contributors = data?.getMembersForColony?.contributors ?? [];
  const allMembers: Member[] = [...watchers, ...contributors];
  const members = allMembers
    .map((member) => member.user)
    .filter<MemberUser>(notMaybe)
    .map((member, index) => ({
      value: member.name,
      label: member.name,
      avatar: member.profile?.avatar,
      id: index,
    }));

  return {
    members,
    loading,
  };
};
