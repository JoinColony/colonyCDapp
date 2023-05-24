import { ModelUserFilterInput, useGetUsersQuery } from '~gql';
import { Address, User } from '~types';
import { notNull } from '~utils/arrays';

export interface WhitelistedUser {
  address: Address;
  user?: User;
}

const getWhitelistedAddressesQueryFilter = (
  whitelistedAddresses: Address[],
): ModelUserFilterInput => {
  if (whitelistedAddresses.length === 1) {
    return {
      id: {
        eq: whitelistedAddresses[0],
      },
    };
  }

  return {
    or: whitelistedAddresses.map((address) => ({ id: { eq: address } })),
  };
};

export const useWhitelistedUsers = (
  whitelistedAddresses: Address[],
): WhitelistedUser[] => {
  const { data } = useGetUsersQuery({
    variables: {
      filter: getWhitelistedAddressesQueryFilter(whitelistedAddresses),
    },
    // The skip option is rather important here - without it, the query will return ALL the CDapp users
    skip: !whitelistedAddresses.length,
  });
  const users = data?.listUsers?.items.filter(notNull) ?? [];

  const whitelistedUsers = whitelistedAddresses.map((address) => {
    const matchingUser = users.find((user) => user.walletAddress === address);
    if (!matchingUser) {
      return {
        address,
      };
    }
    return {
      address,
      user: matchingUser,
    };
  });

  return whitelistedUsers;
};

export const getFilteredUsers = (
  users: WhitelistedUser[],
  filterTerm: string,
) => {
  return users.filter(({ user, address }) => {
    return (
      address.toLowerCase().includes(filterTerm) ||
      user?.name?.toLowerCase().includes(filterTerm) ||
      user?.profile?.displayName?.toLowerCase().includes(filterTerm)
    );
  });
};
