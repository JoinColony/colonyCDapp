import { useGetUsersQuery } from '~gql';
import { Address } from '~types';

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
