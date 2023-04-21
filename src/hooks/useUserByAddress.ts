import { useGetUserByAddressQuery } from '~gql';

const useUserByAddress = (address: string) => {
  const { data, error, loading } = useGetUserByAddressQuery({
    variables: {
      address,
    },
    fetchPolicy: 'cache-and-network',
  });

  const user = data?.getUserByAddress?.items[0];
  return {
    user,
    loading,
    error,
  };
};

export default useUserByAddress;
