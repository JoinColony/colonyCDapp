import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContextModule, getContext } from '~context';
import {
  GetCurrentExtensionVersionDocument,
  GetCurrentExtensionVersionQuery,
  GetCurrentExtensionVersionQueryVariables,
} from '~gql';

export const getOneTxPaymentVersion = async (): Promise<number | null> => {
  const apolloClient = getContext(ContextModule.ApolloClient);

  const { data } = await apolloClient.query<
    GetCurrentExtensionVersionQuery,
    GetCurrentExtensionVersionQueryVariables
  >({
    query: GetCurrentExtensionVersionDocument,
    variables: {
      extensionHash: getExtensionHash(Extension.OneTxPayment),
    },
  });

  return data.getCurrentVersionByKey?.items[0]?.version ?? null;
};
