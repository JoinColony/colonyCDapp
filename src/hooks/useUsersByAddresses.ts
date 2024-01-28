import { useGetUsersQuery } from '~gql';
import { type Address } from '~types/index.ts';

const useUsersByAddresses = (addresses: Address[]) => {
  const { data, error, loading } = useGetUsersQuery({
    variables: {
      // We need this limit due to how filtering works right now
      limit: 9999,
      filter: {
        or: addresses.map((address) => ({ id: { eq: address } })),
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const users = data?.listUsers?.items;

  return {
    users,
    loading,
    error,
  };
};

export default useUsersByAddresses;
