import { ContextModule, getContext } from '~context/index.ts';
import {
  type CreateColonyActionMetadataMutation,
  type CreateColonyActionMetadataMutationVariables,
  CreateColonyActionMetadataDocument,
} from '~gql';

export const createActionMetadataInDB = async (
  txHash: string,
  customTitle: string,
) => {
  const apolloClient = getContext(ContextModule.ApolloClient);

  return apolloClient.mutate<
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
};
