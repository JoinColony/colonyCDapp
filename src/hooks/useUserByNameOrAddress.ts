import { useQuery, gql } from '@apollo/client';
import { isAddress } from 'ethers/lib/utils';

import { getUserFromName, getCurrentUser } from '~gql';

const useUserByNameOrAddress = (username: string) => {
  const {
    data: dataByName,
    loading: loadingName,
    error: errorName,
  } = useQuery(gql(getUserFromName), {
    variables: {
      name: username,
    },
    fetchPolicy: 'network-only',
  });

  const {
    data: dataAddress,
    loading: loadingAddress,
    error: errorAddress,
  } = useQuery(gql(getCurrentUser), {
    variables: { address: username },
  });

  const user = isAddress(username)
    ? dataAddress?.getUserByAddress?.items[0]
    : dataByName?.getUserByName?.items[0];

  return {
    user,
    loading: loadingAddress || loadingName,
    error: errorAddress || errorName,
  };
};

export default useUserByNameOrAddress;
