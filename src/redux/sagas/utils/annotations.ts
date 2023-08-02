import { ContextModule, getContext } from '~context';
import {
  CreateAnnotationDocument,
  CreateAnnotationMutation,
  CreateAnnotationMutationVariables,
} from '~gql';

export const uploadAnnotationToDb = async ({ message, txHash, ipfsHash }) => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  await apolloClient.mutate<
    CreateAnnotationMutation,
    CreateAnnotationMutationVariables
  >({
    mutation: CreateAnnotationDocument,
    variables: {
      input: {
        message,
        id: txHash,
        ipfsHash,
      },
    },
  });
};
