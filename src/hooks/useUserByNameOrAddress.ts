import { useGetUserByNameQuery, useGetUserByAddressQuery } from '~gql';
import { isAddress as isAddressFunction } from '~utils/web3';

/*
 * Can't conditionally call the codegen query hooks so querying GraphQL directly
 */
const useUserByNameOrAddress = (username: string) => {
  const isAddress = isAddressFunction(username);

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useGetUserByNameQuery({
    variables: {
      name: username,
    },
    fetchPolicy: 'cache-and-network',
    skip: isAddress,
  });

  const {
    data: addressData,
    error: addressError,
    loading: addressLoading,
  } = useGetUserByAddressQuery({
    variables: {
      address: username,
    },
    fetchPolicy: 'cache-and-network',
    skip: !isAddress,
  });

  return isAddress
    ? {
        user: addressData?.getUserByAddress?.items[0],
        error: addressError,
        loading: addressLoading,
      }
    : {
        user: userData?.getUserByName?.items[0],
        error: userError,
        loading: userLoading,
      };
};

export default useUserByNameOrAddress;
