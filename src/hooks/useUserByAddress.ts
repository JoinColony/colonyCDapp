import {
  useGetUserByAddressQuery,
  useGetUserByUserOrLiquidationAddressQuery,
} from '~gql';
import { type Address } from '~types/index.ts';
import { getChainId } from '~utils/chainId.ts';

const useUserByAddress = (
  address: Address,
  tryLiquidationAddress: boolean = false,
) => {
  const getUserByAddressResult = useGetUserByAddressQuery({
    variables: {
      address,
    },
    fetchPolicy: 'cache-first',
    skip: tryLiquidationAddress || !address,
  });

  const getUserByUserOrLiquidationAddressResult =
    useGetUserByUserOrLiquidationAddressQuery({
      variables: {
        userOrLiquidationAddress: address,
        chainId: Number(getChainId()),
      },
      fetchPolicy: 'cache-first',
      skip: !tryLiquidationAddress || !address,
    });

  if (!tryLiquidationAddress) {
    const { data, previousData, loading, error } = getUserByAddressResult;

    const user = data?.getUserByAddress?.items[0];
    const previousUser = previousData?.getUserByAddress?.items[0];

    return {
      user,
      loading,
      error,
      previousUser,
    };
  }

  const { data, previousData, loading, error } =
    getUserByUserOrLiquidationAddressResult;

  const user =
    data?.getUserByAddress?.items[0] ??
    data?.getUserByLiquidationAddress?.items[0]?.user;

  const previousUser =
    previousData?.getUserByAddress?.items[0] ??
    previousData?.getUserByLiquidationAddress?.items[0]?.user;

  return {
    user,
    loading,
    error,
    previousUser,
  };
};

export default useUserByAddress;
