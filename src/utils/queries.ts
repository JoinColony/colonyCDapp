import { apolloClient } from '~apollo/index.ts';
import { type NetworkInfo, DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import {
  GetTokenFromEverywhereDocument,
  type GetTokenFromEverywhereQuery,
  type GetTokenFromEverywhereQueryVariables,
} from '~gql';
import { type Address } from '~types/index.ts';

/*
 * Wrapper around the getTokenFromEveryWhereQuery
 * to ensure that the right type is passed as the
 * network parameter
 */
export const fetchTokenFromDatabase = async (
  tokenAddress: Address,
  network: NetworkInfo,
) => {
  const response = await apolloClient.query<
    GetTokenFromEverywhereQuery,
    GetTokenFromEverywhereQueryVariables
  >({
    query: GetTokenFromEverywhereDocument,
    variables: {
      input: {
        tokenAddress,
        network: network.shortName,
      },
    },
  });

  const tokenItems = response?.data.getTokenFromEverywhere?.items;

  if (tokenItems) {
    return tokenItems[0];
  }

  return null;
};

/*
 * Method to be used when setting a query polling interval or manually starting
 * or stopping polling.
 *
 * It syncs polling with the current chain's block time, so that we don't make
 * unnecessary requests.
 *
 * @return time in milliseconds
 */
export const getSafePollingInterval = (): number => {
  const { blockTime } = DEFAULT_NETWORK_INFO;
  if (!blockTime) {
    return 1 * 1000; // fall back to 1 second
  }
  return (blockTime - 1) * 1000; // one second less than the actual block time
};

export const removeCacheEntry = (cacheEntryName: string) => {
  apolloClient.cache.evict({
    fieldName: cacheEntryName,
  });
};
