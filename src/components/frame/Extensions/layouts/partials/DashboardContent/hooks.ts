import { useGetMembersForColonyQuery } from '~gql';
import { useColonyContext } from '~hooks';

export const useGetColonyMembers = () => {
  const { colony } = useColonyContext();
  const { colonyAddress } = colony || {};

  const { data, loading } = useGetMembersForColonyQuery({
    skip: !colonyAddress,
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
      },
    },
  });

  const contributorsCount = (data?.getMembersForColony?.contributors ?? [])
    .length;

  const watchersCount = (data?.getMembersForColony?.watchers ?? []).length;

  const allMembersCount = contributorsCount + watchersCount;

  return {
    contributorsCount,
    allMembersCount,
    loading,
  };
};
