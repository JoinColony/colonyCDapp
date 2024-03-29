import { ApolloClient, from, HttpLink } from '@apollo/client';

import cache from './cache/index.ts';
import removeTypenameLink from './removeTypenameLink.ts';

const httpLink = new HttpLink({
  uri: `${
    import.meta.env.AUTH_PROXY_ENDPOINT || 'http://localhost:3005'
  }/graphql`,
  credentials: 'include',
});

const apolloClient = new ApolloClient({
  link: from([removeTypenameLink, httpLink]),
  connectToDevTools: true,
  cache,
  /*
   * @TODO Most likely we'll need to add resolvers here as well
   */
});

export default apolloClient;
