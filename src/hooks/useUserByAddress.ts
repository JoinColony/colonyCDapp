import { useGetCurrentUserQuery } from '~gql';

const useUserByAddress = (address: string) => {
  const { data, error, loading } = useGetCurrentUserQuery({
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
