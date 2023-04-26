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
