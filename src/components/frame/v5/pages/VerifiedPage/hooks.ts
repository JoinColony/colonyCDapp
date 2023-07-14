import { useCallback, useMemo } from 'react';
import { useColonyContext } from '~hooks';
import {
  WhitelistedUser,
  useWhitelistedUsers,
} from '~common/Dialogs/ManageWhitelistDialog/WhitelistedAddresses/helpers';
// import { useGetUserReputationLazyQuery } from '~gql';

export const useVerifiedPage = (searchValue?: string) => {
  const { colony } = useColonyContext();
  // const { colonyAddress } = colony || {};
  const whitelistedAddresses = colony?.metadata?.whitelistedAddresses ?? [];
  const users = useWhitelistedUsers(whitelistedAddresses);
  // const [usersWithReputation, setUsersWithReputation] = useState();

  const searchVerified = useCallback(
    (members: WhitelistedUser[]) =>
      members.filter(({ user }) => {
        return (
          user?.name
            .toLowerCase()
            .startsWith(searchValue?.toLowerCase() ?? '') ||
          user?.walletAddress
            .toLowerCase()
            .startsWith(searchValue?.toLowerCase() ?? '')
        );
      }),
    [searchValue],
  );

  const searchedVerified = useMemo(
    () => (searchValue ? searchVerified(users) : users),
    [searchValue, searchVerified, users],
  );

  // const [fetchUsers] = useGetUserReputationLazyQuery();

  // useEffect(() => {
  //   Promise.all(
  //     searchedVerified.map(async (user) => {
  //       const reputation = await fetchUsers({
  //         variables: {
  //           input: {
  //             colonyAddress,
  //             walletAddress: user.address,
  //           },
  //         },
  //       });

  //       return { user, reputation: reputation.data?.getUserReputation };
  //     }),
  //   ).then(setUsersWithReputation);
  // }, [colonyAddress, fetchUsers, searchedVerified]);

  // console.log(usersWithReputation);

  return {
    searchedVerified,
  };
};
