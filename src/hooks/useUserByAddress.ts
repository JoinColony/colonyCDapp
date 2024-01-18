import { useGetUserByAddressQuery } from '~gql';
import { Address } from '~types';

const useUserByAddress = (address?: Address) => {
  const { data, error, loading } = useGetUserByAddressQuery({
    ...(address
      ? {
          variables: {
            address,
          },
        }
      : {
          skip: true,
        }),
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
