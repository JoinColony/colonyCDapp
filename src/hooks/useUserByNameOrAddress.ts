import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { Address, User } from '~types';
import {
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
  GetUserByNameDocument,
  GetUserByNameQuery,
  GetUserByNameQueryVariables,
} from '~gql';
import { isAddress } from '~utils/web3';
import { getContext, ContextModule } from '~context';

type UserResponse = {
  user?: User | null;
  loading: boolean;
  error?: ApolloError;
};

const getUserByName = async (name: string): Promise<UserResponse> => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  const { data, loading, error } = await apolloClient.query<
    GetUserByNameQuery,
    GetUserByNameQueryVariables
  >({
    query: GetUserByNameDocument,
    variables: {
      name,
    },
  });

  const user = data.getUserByName?.items[0];
  return { user, loading, error };
};

const getUserByAddress = async (address: Address): Promise<UserResponse> => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  const { data, error, loading } = await apolloClient.query<
    GetUserByAddressQuery,
    GetUserByAddressQueryVariables
  >({
    query: GetUserByAddressDocument,
    variables: {
      address,
    },
  });

  const user = data.getUserByAddress?.items[0];
  return { user, loading, error };
};

/*
 * Can't conditionally call the codegen query hooks so querying GraphQL directly
 */
const useUserByNameOrAddress = (username: string) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApolloError | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        user: userData,
        loading: loadingData,
        error: errorData,
      } = isAddress(username)
        ? await getUserByAddress(username)
        : await getUserByName(username);
      setError(errorData);
      setUser(userData);
      setLoading(loadingData);
    };

    fetchUser();
  }, [username]);

  return { user, loading, error };
};

export default useUserByNameOrAddress;
