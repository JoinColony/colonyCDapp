import { isHexString } from 'ethers/lib/utils';
import { useGetUserByAddressQuery } from '~gql';
import { Address } from '~types';
import { splitWalletAddress } from '~utils/splitWalletAddress';

const useUserByAddress = (address: Address) => {
  const { data, error, loading } = useGetUserByAddressQuery({
    variables: {
      address,
    },
    fetchPolicy: 'cache-and-network',
  });

  const user = data?.getUserByAddress?.items[0];

  return {
    user: {
      ...user,
      walletAddress: isHexString(address) ? splitWalletAddress(address) : '',
    },
    loading,
    error,
  };
};

export default useUserByAddress;
