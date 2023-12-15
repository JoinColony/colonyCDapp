import { ApolloClient, from, HttpLink } from '@apollo/client';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';

import cache from '~cache';

const removeTypenameLink = removeTypenameFromVariables();
const httpLink = new HttpLink({
  uri: `${process.env.AUTH_PROXY_ENDPOINT || 'http://localhost:3005'}/graphql`,
  credentials: 'include',
});

const link = from([removeTypenameLink, httpLink]);

export default new ApolloClient({
  link,
  connectToDevTools: true,
  cache,
  /*
   * @TODO Most likely we'll need to add resolvers here as well
   */
});
