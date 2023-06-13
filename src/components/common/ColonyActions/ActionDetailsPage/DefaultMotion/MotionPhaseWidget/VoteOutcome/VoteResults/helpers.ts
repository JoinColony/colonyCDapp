import { useEffect, useState } from 'react';

import { ContextModule, getContext } from '~context';
import {
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';
import { Address, User } from '~types';

const getUsers = (
  addresses: Address[],
): Promise<(User | null | undefined)[]> => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  return Promise.all(
    addresses.map(async (address) => {
      /*
       * Per rules of hooks, can't call the codegen query hook inside a callback.
       * Hence doing it directly.
       */
      const { data } = await apolloClient.query<
        GetUserByAddressQuery,
        GetUserByAddressQueryVariables
      >({
        query: GetUserByAddressDocument,
        variables: {
          address,
        },
      });
      return data.getUserByAddress?.items[0];
    }),
  );
};

export const useGetUsers = (addresses: Address[]) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const definedUsers = (await getUsers(addresses)).filter((user) =>
        Boolean(user),
      ) as User[];
      setUsers(definedUsers);
    };
    fetchUsers();
  }, [addresses]);

  return users;
};
