import { useGetUserByAddressQuery } from '~gql';
import { Address } from '~types';

const useUserByAddress = (address: Address) => {
  const { data, error, loading, previousData } = useGetUserByAddressQuery({
    variables: {
      address,
    },
    fetchPolicy: 'cache-and-network',
  });

  const user = data?.getUserByAddress?.items[0];
  const previousUser = previousData?.getUserByAddress?.items[0];

  return {
    user,
    loading,
    error,
    previousUser,
  };
};

export default useUserByAddress;
