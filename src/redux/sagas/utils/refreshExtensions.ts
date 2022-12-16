import { ContextModule, getContext } from '~context';
import { GetColonyExtensionDocument, GetColonyExtensionsDocument } from '~gql';

export function* refreshExtensions() {
  const apolloClient = getContext(ContextModule.ApolloClient);

  yield apolloClient.refetchQueries({
    include: [GetColonyExtensionDocument, GetColonyExtensionsDocument],
  });
}
