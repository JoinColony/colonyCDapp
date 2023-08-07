import { useGetMembersForColonyQuery } from '~gql';
import { Address, Member, MemberUser } from '~types';
import { notMaybe } from '~utils/arrays';

const useGetColonyMembers = (colonyAddress?: Address | null) => {
  const { data } = useGetMembersForColonyQuery({
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
  return allMembers.map((member) => member.user).filter<MemberUser>(notMaybe);
};

export default useGetColonyMembers;
