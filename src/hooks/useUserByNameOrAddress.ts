import { isAddress } from 'ethers/lib/utils';

import { useCombinedUserQueryQuery } from '~gql';

const useUserByNameOrAddress = (usernameOrAddress: string) => {
  const { data, error, loading } = useCombinedUserQueryQuery({
    variables: {
      name: usernameOrAddress,
      address: usernameOrAddress,
    },
  });

  const user = isAddress(usernameOrAddress)
    ? data?.getUserByAddress?.items[0]
    : data?.getUserByName?.items[0];

  return {
    user,
    loading,
    error,
  };
};

export default useUserByNameOrAddress;
