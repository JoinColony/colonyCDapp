import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  type CreateColonyActionMetadataMutation,
  type CreateColonyActionMetadataMutationVariables,
  CreateColonyActionMetadataDocument,
} from '~gql';

export function* createActionMetadataInDB(txHash: string, customTitle: string) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  yield mutateWithAuthRetry(() =>
    apolloClient.mutate<
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
    }),
  );
}
