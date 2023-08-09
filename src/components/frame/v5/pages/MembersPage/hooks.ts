import { useSearchContext } from '~context/SearchContext';
import { useFilterContext } from '~context/FilterContext';
import { useGetMembersForColonyQuery } from '~gql';

import { useColonyContext } from '~hooks';
import { searchMembers } from '~utils/members';

export const useMembersPage = () => {
  const { colony } = useColonyContext();
  const { colonyAddress, name } = colony || {};
  const followersURL = `/colony/${name}/followers`;
  const contributorsURL = `/colony/${name}/contributors`;
  const { searchValue } = useSearchContext();

  const { filteringMethod, selectedDomainIds, sortingMethod } =
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
    fetchPolicy: 'cache-and-network',
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
    followers: searchedFollowers,
    contributors: searchedContributors,
    loading,
    followersURL,
    contributorsURL,
  };
};
