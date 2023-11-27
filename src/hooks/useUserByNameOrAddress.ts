import { useGetUserByNameQuery, useGetUserByAddressQuery } from '~gql';
import { isAddress as isAddressFunction } from '~utils/web3';

/*
 * Can't conditionally call the codegen query hooks so querying GraphQL directly
 */
const useUserByNameOrAddress = (userIdentifier: string) => {
  const isAddress = isAddressFunction(userIdentifier);

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useGetUserByNameQuery({
    variables: {
      name: userIdentifier,
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
      address: userIdentifier,
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
        user: userData?.getProfileByUsername?.items[0]?.user,
        error: userError,
        loading: userLoading,
      };
};

export default useUserByNameOrAddress;
