import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateColonyActionMetadataMutation,
  CreateColonyActionMetadataMutationVariables,
  CreateColonyActionMetadataDocument,
} from '~gql';

export function* createActionMetadataInDB(txHash: string, customTitle: string) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  yield apolloClient.mutate<
    CreateColonyActionMetadataMutation,
    CreateColonyActionMetadataMutationVariables
  >({
    mutation: CreateColonyActionMetadataDocument,
    variables: {
      input: {
        id: txHash,
        customTitle,
      },
    },
  });
}
