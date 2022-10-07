import React, { useCallback } from 'react';
import {
  useQuery,
  gql,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  useMutation,
} from '@apollo/client';
import { Wallet, utils } from 'ethers';

import { listUsers, createUser } from '~gql/index';

const httpLink = new HttpLink({
  uri: 'http://localhost:20002/graphql',
  headers: {
    'x-api-key': 'da2-fakeApiId123456',
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const QueriesTests = () => {
  const { data, error, loading } = useQuery(gql(listUsers), {
    client,
  });

  console.log('QUERY', data);

  const [
    createUserMutation,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(gql(createUser), {
    client,
    refetchQueries: [{ query: gql(listUsers) }, 'ListUsers'],
  });

  console.log('MUTATION', mutationData);

  const handleUserCreate = useCallback(() => {
    const randomWallet = Wallet.createRandom();
    createUserMutation({
      variables: {
        input: {
          walletAddress: randomWallet.address,
          username: `user-${utils.id(randomWallet.address).slice(2, 8)}`,
        },
      },
    });
  }, [createUserMutation]);

  return (
    <div>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          <p>Users</p>
          <br />
          <button
            type="button"
            onClick={handleUserCreate}
            disabled={mutationLoading}
          >
            {mutationLoading ? 'Loading...' : 'Create new user'}
          </button>
          <br />
          <br />
          <ul>
            {data?.listUsers?.items?.map(({ walletAddress, username }) => (
              <li key={walletAddress}>
                <b>Username:</b> {username} <b>Wallet:</b> {walletAddress}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default QueriesTests;
