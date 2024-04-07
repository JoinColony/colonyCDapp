import { type Extension, getExtensionHash } from '@colony/colony-js';

import { ContextModule, getContext } from '~context/index.ts';
import {
  GetCurrentExtensionVersionDocument,
  type GetCurrentExtensionVersionQuery,
  type GetCurrentExtensionVersionQueryVariables,
} from '~gql';

export const getExtensionVersion = async (
  extension: Extension,
): Promise<number> => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  const { data } = await apolloClient.query<
    GetCurrentExtensionVersionQuery,
    GetCurrentExtensionVersionQueryVariables
  >({
    query: GetCurrentExtensionVersionDocument,
    variables: {
      extensionHash: getExtensionHash(extension),
    },
  });

  return data.getCurrentVersionByKey?.items[0]?.version ?? 1;
};
