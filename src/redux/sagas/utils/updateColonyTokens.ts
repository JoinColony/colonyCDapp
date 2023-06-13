import { ADDRESS_ZERO } from '~constants';
import { ContextModule, getContext } from '~context';
import {
  CreateColonyTokensDocument,
  CreateColonyTokensMutation,
  CreateColonyTokensMutationVariables,
  DeleteColonyTokensDocument,
  DeleteColonyTokensMutation,
  DeleteColonyTokensMutationVariables,
  GetTokenFromEverywhereDocument,
  GetTokenFromEverywhereQuery,
  GetTokenFromEverywhereQueryVariables,
} from '~gql';
import { Colony } from '~types';
import { notNull } from '~utils/arrays';
import { xor } from '~utils/lodash';

/**
 * Returns an array of the token addresses currently associated with the Colony.
 */
export const getExistingTokenAddresses = (colony: Colony) =>
  colony.tokens?.items
    .filter(notNull)
    .map((tokenItem) => tokenItem.token.tokenAddress) || [];

/**
 * Function returning an array of token addresses that were either added to or deleted
 * from the modified token addresses list.
 * It returns an empty array if there's no difference between the lists
 */
export const getModifiedTokenAddresses = (
  nativeTokenAddress: string,
  existingTokenAddresses: string[],
  modifiedTokenAddresses?: string[] | null,
) => {
  if (!modifiedTokenAddresses) {
    return [];
  }

  // get a token address that has been modified, excluding colony's native token and chain's default token
  const modifiedTokenAddress = xor(
    existingTokenAddresses,
    modifiedTokenAddresses,
  ).filter(
    (tokenAddress) =>
      tokenAddress !== nativeTokenAddress && tokenAddress !== ADDRESS_ZERO,
  );
  return modifiedTokenAddress;
};

export const getPendingModifiedTokenAddresses = (
  colony: Colony,
  updatedTokenAddresses?: string[] | null,
) => {
  const nativeTokenAddress = colony.nativeToken.tokenAddress;
  const existingTokenAddresses = getExistingTokenAddresses(colony);

  const modifiedTokenAddresses: { added: string[]; removed: string[] } = {
    added: [],
    removed: [],
  };

  if (!updatedTokenAddresses) {
    return modifiedTokenAddresses;
  }

  const prevAddresses = new Set(existingTokenAddresses);
  const newAddresses = new Set(updatedTokenAddresses);

  // If a new address is not in the previous address set it has been added.
  // Ignore the chain's default and colony native tokens.
  newAddresses.forEach((address) => {
    const hasChanged = !prevAddresses.has(address);
    const isSecondaryToken =
      address !== nativeTokenAddress && address !== ADDRESS_ZERO;

    if (isSecondaryToken && hasChanged) {
      modifiedTokenAddresses.added.push(address);
    }
  });

  // If a previous address is not in the new address set, it has been removed.
  prevAddresses.forEach((address) => {
    const hasChanged = !newAddresses.has(address);
    const isSecondaryToken =
      address !== nativeTokenAddress && address !== ADDRESS_ZERO;

    if (isSecondaryToken && hasChanged) {
      modifiedTokenAddresses.removed.push(address);
    }
  });

  return modifiedTokenAddresses;
};

export function* updateColonyTokens(
  colony: Colony,
  existingTokenAddresses: string[],
  modifiedTokenAddresses: string[],
) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  yield Promise.all(
    modifiedTokenAddresses.map(async (tokenAddress) => {
      if (!existingTokenAddresses.includes(tokenAddress)) {
        /**
         * Call the GetTokenFromEverywhere query to ensure the token
         * gets added to the DB if it doesn't already exist
         */
        const response = await apolloClient.query<
          GetTokenFromEverywhereQuery,
          GetTokenFromEverywhereQueryVariables
        >({
          query: GetTokenFromEverywhereDocument,
          variables: {
            input: {
              tokenAddress,
            },
          },
        });

        /**
         * Only create colony/token entry in the DB if the token data was returned by the GetTokenFromEverywhereQuery.
         * Otherwise, it will cause any query referencing it to fail
         */
        if (response?.data.getTokenFromEverywhere?.items?.length) {
          await apolloClient.mutate<
            CreateColonyTokensMutation,
            CreateColonyTokensMutationVariables
          >({
            mutation: CreateColonyTokensDocument,
            variables: {
              input: {
                colonyID: colony.colonyAddress,
                tokenID: tokenAddress,
              },
            },
          });
        }
      } else {
        // token needs to be removed
        // get the ID of the colony/token entry in the DB (this is separate from token or colony address)
        const { colonyTokensId } =
          colony.tokens?.items.find(
            (colonyToken) => colonyToken?.token.tokenAddress === tokenAddress,
          ) || {};

        if (colonyTokensId) {
          await apolloClient.mutate<
            DeleteColonyTokensMutation,
            DeleteColonyTokensMutationVariables
          >({
            mutation: DeleteColonyTokensDocument,
            variables: {
              input: {
                id: colonyTokensId,
              },
            },
          });
        }
      }
    }),
  );
}

export const getColonyMetadataDatabaseId = (
  colonyAddress: string,
  txHash: number,
) => {
  // Temp id we use to match metadata object with colony in block ingestor.
  return `${colonyAddress}_motion-${txHash}`;
};
