import { isAddress } from 'ethers/lib/utils';

import { useCombinedUserQuery } from '~gql';

const useUserByNameOrAddress = (usernameOrAddress: string) => {
  const { data, error, loading } = useCombinedUserQuery({
    variables: {
      name: usernameOrAddress,
      address: usernameOrAddress,
    },
    fetchPolicy: 'cache-and-network',
  });

  const user = isAddress(usernameOrAddress) ? data?.getUserByAddress?.items[0] : data?.getUserByName?.items[0];

  return {
    user,
    loading,
    error,
  };
};

export default useUserByNameOrAddress;
