import { ContextModule, getContext } from '~context/index.ts';
import {
  GetTokenFromEverywhereDocument,
  type GetTokenFromEverywhereQuery,
  type GetTokenFromEverywhereQueryVariables,
} from '~gql';

export function* validateTokenAddresses({
  tokenAddresses,
}: {
  tokenAddresses: string[];
}) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  for (const tokenAddress of tokenAddresses) {
    const response = yield apolloClient.query<
      GetTokenFromEverywhereQuery,
      GetTokenFromEverywhereQueryVariables
    >({
      query: GetTokenFromEverywhereDocument,
      variables: {
        input: {
          tokenAddress,
        },
      },
      fetchPolicy: 'network-only',
    });

    if (!response?.data?.getTokenFromEverywhere) {
      throw new Error(`Invalid token: ${tokenAddress}`);
    }
  }
}
