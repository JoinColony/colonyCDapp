import { Address } from '~types';
import { NetworkInfo } from '~constants';
import apolloClient from '~context/apolloClient';
import {
  GetTokenFromEverywhereDocument,
  GetTokenFromEverywhereQuery,
  GetTokenFromEverywhereQueryVariables,
} from '~gql';

/*
 * Wrapper around the getTokenFromEveryWhereQuery
 * to ensure that the right type is passed as the
 * network parameter
 */
export const getTokenFromEveryWhereQuery = async (
  tokenAddress: Address,
  network?: NetworkInfo,
) => {
  await apolloClient.query<
    GetTokenFromEverywhereQuery,
    GetTokenFromEverywhereQueryVariables
  >({
    query: GetTokenFromEverywhereDocument,
    variables: {
      input: {
        tokenAddress,
        network: network?.shortName,
      },
    },
  });
};
