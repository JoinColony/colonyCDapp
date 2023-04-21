import { useGetUserByAddressQuery } from '~gql';
import { Address } from '~types';

const useUserByAddress = (address: Address) => {
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
