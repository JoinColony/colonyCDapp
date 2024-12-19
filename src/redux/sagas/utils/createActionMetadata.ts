import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  type CreateColonyActionMetadataMutation,
  type CreateColonyActionMetadataMutationVariables,
  CreateColonyActionMetadataDocument,
  type CreateColonyActionMetadataInput,
} from '~gql';

type ActionMetadataFields = Pick<
  CreateColonyActionMetadataInput,
  'customTitle' | 'arbitraryTxAbis'
>;

export function* createActionMetadataInDB(
  txHash: string,
  fields: ActionMetadataFields,
) {
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
          ...fields,
        },
      },
    }),
  );
}
