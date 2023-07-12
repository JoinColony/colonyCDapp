import { useGetMembersForColonyQuery } from '~gql';

import { useColonyContext } from '~hooks';
import { searchMembers } from '~utils/members';

export const useContributorsPage = (searchValue?: string) => {
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

  const contributors = data?.getMembersForColony?.contributors ?? [];

  const searchedContributors = searchValue
    ? searchMembers(contributors, searchValue)
    : contributors;

  return {
    contributors: searchedContributors,
    loading,
  };
};
