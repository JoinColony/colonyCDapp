import { useMemo } from 'react';
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

  const members = useMemo(() => {
    const watchers = data?.getMembersForColony?.watchers ?? [];
    const contributors = data?.getMembersForColony?.contributors ?? [];
    const allMembers: Member[] = [...watchers, ...contributors];

    return allMembers
      .map(({ user }) => user)
      .filter<MemberUser>(notMaybe)
      .map(({ name, profile, walletAddress }, index) => ({
        value: name,
        label: name,
        avatar: profile?.avatar || profile?.thumbnail,
        walletAddress,
        id: index,
      }));
  }, [
    data?.getMembersForColony?.contributors,
    data?.getMembersForColony?.watchers,
  ]);

  return {
    members,
    loading,
  };
};
