import { useFilterContext } from '~context/FilterContext';
import { useGetMembersForColonyQuery } from '~gql';

import { useColonyContext } from '~hooks';
import { searchMembers } from '~utils/members';

export const useContributorsPage = (searchValue?: string) => {
  const { colony } = useColonyContext();
  const { colonyAddress } = colony || {};

  const { selectedDomainIds, sortingMethod, filteringMethod } =
    useFilterContext();

  const { data, loading } = useGetMembersForColonyQuery({
    skip: !colonyAddress,
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
        domainIds: selectedDomainIds,
        sortingMethod,
        filteringMethod,
      },
    },
  });

  const followers = data?.getMembersForColony?.watchers ?? [];
  const contributors = data?.getMembersForColony?.contributors ?? [];

  const searchedFollowers = searchValue
    ? searchMembers(followers, searchValue)
    : followers;
  const searchedContributors = searchValue
    ? searchMembers(contributors, searchValue)
    : contributors;

  return {
    contributors: searchedContributors,
    followers: searchedFollowers,
    loading,
  };
};
