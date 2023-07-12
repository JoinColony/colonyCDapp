import { useGetMembersForColonyQuery } from '~gql';

import { useColonyContext } from '~hooks';
import { searchMembers } from '~utils/members';

export const useFollowersPage = (searchValue?: string) => {
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

  const followers = data?.getMembersForColony?.watchers ?? [];

  const searchedFollowers = searchValue
    ? searchMembers(followers, searchValue)
    : followers;

  return {
    followers: searchedFollowers,
    loading,
  };
};
